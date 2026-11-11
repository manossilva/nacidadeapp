// Os três tipos de acesso do Menu. Por enquanto mudam só os textos da tela de
// login; os perfis de lojista, órgão público e administrador entram com o banco.
export const LOGIN_TYPES = {
  usuario:  { menuLabel: 'Entrar como usuário',       title: 'Entrar como usuário',       subtitle: 'Bem-vindo de volta' },
  parceiro: { menuLabel: 'Entrar como parceiro',      title: 'Entrar como parceiro',      subtitle: 'Para lojas e negócios cadastrados' },
  orgao:    { menuLabel: 'Entrar como órgão público', title: 'Entrar como órgão público', subtitle: 'Para prefeituras e órgãos públicos' },
}
