# Fase 2A — Base de acesso da equipe

Estado: **base implementada; primeira conta e fluxo real ainda não ativados**.

## Escopo implementado

- Login por e-mail e senha apenas para contas convidadas.
- Recuperação e definição de senha com respostas que não revelam se um e-mail existe.
- Conta individual e painel inicial exclusivo para administradores ativos.
- Sessão e identidade confirmadas no servidor; autorização nunca usa `user_metadata`.
- RLS nas tabelas `account_access` e `privacy_acknowledgements`.
- Papéis `admin`, `curator` e `member`; nenhum cliente pode criar ou alterar o próprio papel.
- Validação da sessão contra `auth.sessions`, para que uma sessão revogada não mantenha acesso até o vencimento do JWT.
- Aviso de privacidade específico para a equipe e registro da versão lida.

Migração aplicada e versionada em `supabase/migrations/20260831155449_phase_2a_auth_access.sql`. Ela não cria usuários.

## Verificações executadas antes da publicação

- ESLint, TypeScript e build de produção.
- Contratos de interface pública e móvel já existentes.
- Combinações de papel/estado ativo, limites de e-mail e senha e tipografia móvel do acesso.
- Respostas HTTP das rotas públicas e de autenticação.
- Negação de `/admin`, `/minha-conta` e `/definir-senha` para visitante e cookie malformado.
- Callback sem redirecionamento externo fornecido pelo usuário.
- Grants, RLS e sessão inexistente verificados diretamente no projeto dedicado Supabase.
- Advisories de segurança e desempenho do Supabase sem alertas.

Convite, e-mail, definição de senha, login, recuperação, saída e administração ainda precisam ser testados com uma conta real. A Fase 2A só deve ser considerada concluída depois desses testes.

## Ativação controlada

1. No Supabase Auth, usar Site URL `https://amaria.me` e permitir exatamente `https://amaria.me/auth/callback` como URL de redirecionamento.
2. Convidar `contato@jansenfavero.com` pelo painel Auth, sem definir ou compartilhar senha no chat.
3. Confirmar o e-mail e definir uma senha de pelo menos 12 caracteres pelo link.
4. Localizar a conta confirmada pelo e-mail exato e, somente então, registrar `role = 'admin'` e `active = true` em `account_access` por operação administrativa.
5. Testar login, saída, recuperação e isolamento entre contas antes de iniciar o CMS.

O SMTP padrão do Supabase tem restrições de destinatários, volume e personalização. Não considerar o envio validado até um e-mail real chegar. SMTP próprio e mensagens em português devem ser decididos antes de convidar outras pessoas.

## Fora deste escopo

Cadastro público, CMS editorial, chat da Maria, comunidade, comentários, assinaturas e pagamentos. Nenhum desses itens deve ser apresentado como ativo.
