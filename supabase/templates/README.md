# E-mails de autenticação da AMARIA

Configuração do projeto hospedado no Supabase:

1. Em **Authentication > URL Configuration**, defina **Site URL** como
   `https://amaria.me`.
2. Em **Redirect URLs**, inclua exatamente
   `https://amaria.me/auth/callback`.
3. Em **Authentication > Sign In / Providers**, mantenha **Confirm email**
   ativado.
4. Em **Authentication > Emails > Templates > Confirm sign up**, use o
   assunto `Confirme seu perfil na AMARIA` e cole o conteúdo de
   `confirmation.html`.
5. Em **Authentication > Emails > SMTP Settings**, configure um remetente do
   domínio AMARIA para substituir o remetente padrão do Supabase. Desative o
   rastreamento de links no provedor SMTP para não alterar os tokens de
   confirmação.

O template aponta para `/auth/confirm`, que valida `TokenHash` no servidor e
abre a tela premium `/auth/confirmado` após a confirmação.
