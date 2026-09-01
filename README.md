# AMAR.IA

**Para amar sem se perder de você.** Plataforma de inteligência relacional para mulheres, com conteúdo, Conselheira Maria com IA e comunidade privada.

## Estado atual

Fase 1 concluída: fundação e interface de app com feed editorial, sidebar, quatro temas iniciais e páginas internas. Corações funcionam durante a visita; compartilhamento usa o navegador ou copia o link.

Fase 2A em ativação: autenticação por convite para a equipe, recuperação e definição de senha, conta individual, permissões protegidas e painel administrativo inicial. Não há cadastro público. Comentários, chat, podcasts e comunidade permanecem identificados como futuros, sem coleta de relatos pessoais.

Rotas públicas: `/`, `/sobre`, `/maria`, `/podcasts`, `/comunidade`, `/curadoria` e `/privacidade`. Acesso da equipe: `/entrar`, `/recuperar-acesso`, `/definir-senha`, `/minha-conta` e `/admin`. As reflexões são prévias editoriais, não conteúdo anunciado como revisado pelas curadoras.

Interface com fundo degradê lilás/rosa, superfícies brancas contrastantes e imagens editoriais locais. Texto principal móvel de pelo menos 16 px; ações sociais de 14 px. Procedência das imagens em [docs/IMAGENS.md](docs/IMAGENS.md).

Stack: Next.js App Router, TypeScript e Tailwind CSS; clientes Supabase preparados; GitHub → Vercel. OpenAI Responses API será integrada exclusivamente no servidor em uma fase posterior.

## Desenvolvimento

Requer Node.js 22 ou superior e npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

A homepage funciona sem credenciais Supabase ou OpenAI. O arquivo `.env.local` não deve ser commitado. Use somente publishable key em variáveis públicas Supabase.

## Verificação

```bash
npm run lint
npm run typecheck
npm run build
node scripts/static-check.mjs
node scripts/visual-check.mjs
node scripts/auth-check.mjs
npm run smoke
npm start
```

O endpoint `/api/health` verifica apenas se a aplicação responde; não atesta conexão com banco ou IA.

## Configuração e publicação

O registro da fundação está em [docs/FASE-1.md](docs/FASE-1.md). A implementação e os critérios de ativação do acesso estão em [docs/FASE-2A.md](docs/FASE-2A.md).

- Domínio previsto: `amar.ia.br`.
- `SITE_INDEXABLE=false` mantém o pré-lançamento fora dos mecanismos de busca; não substitui proteção de acesso.
- O acesso usa somente a publishable key no aplicativo. Identidade e permissões são verificadas no servidor, com RLS e papéis mantidos fora do cliente.
- Há manifest e ícones; não há service worker ou armazenamento offline de conversas.

## Identidade e segurança editorial

Mantida a identidade aprovada de fita em rosa e roxo, tons pastel e curadoria de Léa Fávero e Juciane Carneiro. Maria não será apresentada como psicóloga ou substituta de atendimento profissional. Ver [AGENTS.md](AGENTS.md) antes de ampliar recursos.
