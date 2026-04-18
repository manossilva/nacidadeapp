-- ============================================================
-- MIGRAÇÃO — rodar no SQL Editor do Supabase
-- Drop + recriação limpa da tabela profiles
-- ============================================================

-- Remove tabela caso tenha sido criada com tipo errado antes
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Função update_updated_at (recria sem erro se já existir)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- Cria profiles com id como UUID explícito, sem FK direta ao auth.users
-- (evita conflito de tipo em projetos Supabase mais novos)
CREATE TABLE public.profiles (
  id          UUID NOT NULL PRIMARY KEY,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Trigger updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Função que cria perfil automaticamente ao cadastrar usuário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id::uuid,
    NEW.raw_user_meta_data ->> 'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger no cadastro de usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_read_own_profile"
  ON public.profiles FOR SELECT
  USING (auth.uid()::uuid = id);

CREATE POLICY "user_update_own_profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid()::uuid = id);

CREATE POLICY "admin_full_profiles"
  ON public.profiles FOR ALL
  USING (auth.jwt() ->> 'email' = 'tbeuramonsilva@gmail.com');
