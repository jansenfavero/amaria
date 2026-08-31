# AMAR.IA

**Para amar sem se perder de você.** Plataforma de inteligência relacional para mulheres, com conteúdo, Conselheira Maria com IA e comunidade privada.

## Estado atual

Fase 1: fundação e interface de app com feed editorial, sidebar, quatro temas iniciais e páginas internas. Corações funcionam durante a visita; compartilhamento usa o navegador ou copia o link. Comentários, contas, chat, podcasts e comunidade permanecem identificados como futuros, sem coleta de relatos pessoais.

Rotas: `/`, `/sobre`, `/maria`, `/podcasts`, `/comunidade`, `/curadoria` e `/privacidade`. As reflexões são prévias editoriais, não conteúdo anunciado como revisado pelas curadoras.

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
npm run smoke
npm start
```

O endpoint `/api/health` verifica apenas se a aplicação responde; não atesta conexão com banco ou IA.

## Configuração e publicação

As instruções de implantação, pendências reais das conexões e critérios de segurança estão em [docs/FASE-1.md](docs/FASE-1.md).

- Domínio previsto: `amar.ia.br`.
- `SITE_INDEXABLE=false` mantém o pré-lançamento fora dos mecanismos de busca; não substitui proteção de acesso.
- Clientes Supabase em `src/lib/supabase/` são preparação para a Fase 2. O helper de sessão ainda não é usado por rotas públicas.
- Há manifest e ícones; não há service worker ou armazenamento offline de conversas.

## Identidade e segurança editorial

Mantida a identidade aprovada de fita em rosa e roxo, tons pastel e curadoria de Léa Fávero e Juciane Carneiro. Maria não será apresentada como psicóloga ou substituta de atendimento profissional. Ver [AGENTS.md](AGENTS.md) antes de ampliar recursos.
