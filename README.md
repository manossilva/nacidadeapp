# Aju Guide

App mobile-first de curadoria de locais e eventos em Aracaju/SE.

**Stack:** React 18 + Vite + Tailwind CSS + Supabase + Vercel (PWA)

---

## Setup rápido

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com os valores do seu projeto Supabase.

### 3. Criar o banco de dados

No SQL Editor do Supabase, execute o conteúdo de `supabase/schema.sql`.

Depois configure o email do admin:
```sql
ALTER DATABASE postgres SET app.admin_email = 'seu@email.com';
```

### 4. Criar bucket de imagens

Supabase → Storage → New bucket → nome: `images` → marcar como **Public**.

### 5. Rodar localmente

```bash
npm run dev
```

### 6. Deploy

Conecte o repositório ao Vercel e adicione as variáveis de ambiente nas configurações do projeto.

---

## Estrutura

```
src/
  components/
    layout/    # Header, BottomNav, CategoryFilter, PageShell
    cards/     # PlaceCard, EventCard, FeaturedBanner
    admin/     # AdminShell, AdminGuard, PlaceForm, EventForm
    ui/        # Skeleton
  pages/
    Home.jsx         # "Hoje em Aju"
    Explore.jsx      # por categoria + filtros
    Detail.jsx       # detalhe de local ou evento
    Nearby.jsx       # perto de mim (geolocalização)
    admin/
      Login.jsx
      Dashboard.jsx
      Places.jsx
      Events.jsx
      Advertisers.jsx
  hooks/
    useGeolocation.js
    usePlaces.js     # usePlaces, useEvents, useNearby
  lib/
    supabase.js
    geolocation.js   # haversineDistance, formatDistance
    whatsapp.js      # links de WhatsApp e Google Maps
    analytics.js     # trackInteraction (fire-and-forget)
supabase/
  schema.sql         # schema completo + RLS
```

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Home "Hoje em Aju" |
| `/explorar` | Todos os locais e eventos |
| `/explorar/:categoria` | Filtrado por categoria |
| `/local/:slug` | Detalhe de um local |
| `/evento/:slug` | Detalhe de um evento |
| `/perto-de-mim` | Locais ordenados por distância |
| `/admin` | Dashboard (requer login) |
| `/admin/locais` | CRUD de locais |
| `/admin/eventos` | CRUD de eventos |
| `/admin/anunciantes` | Gestão de anunciantes + MRR |
