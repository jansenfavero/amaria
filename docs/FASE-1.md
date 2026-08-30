# Fase 1 — Fundação AMAR.IA

## Escopo entregue no código

- Next.js App Router + TypeScript estrito + Tailwind CSS.
- Homepage responsiva em PT-BR: marca, três pilares, proposta da Maria, curadoria e Instagram.
- Ícone mais recente aprovado, em fita rosa e roxa; tipografia e cores derivadas da identidade pastel.
- Navegação por âncoras, menu móvel acessível, foco visível, link de salto, redução de movimento e páginas de erro.
- Metadados, canonical, robots, sitemap, manifest e ícones. Indexação desabilitada por padrão no pré-lançamento e sempre em deploys Preview.
- Clientes Supabase de navegador/servidor preparados; helper de renovação de sessão reservado à Fase 2.
- Endpoint `/api/health` de liveness, cabeçalhos básicos de segurança e fontes locais sem chamadas Google Fonts.

## O que esta fase NÃO ativa

Cadastro, autenticação, conversas reais, conteúdo clínico, cobrança, podcasts e comunidade ainda não foram implementados. Não há formulários nem coleta de relatos, cookies de sessão próprios, analytics, Adsense ou chamadas à OpenAI na homepage. O manifest prepara instalação; não foi adicionado cache offline de conteúdo privado.

A curadoria foi informada pelo responsável pelo projeto. Nenhum conteúdo é apresentado como já revisado pelas profissionais. As iniciais das curadoras são marcadores tipográficos; não representam retratos.

## Conexões inspecionadas em 30/08/2026

- GitHub: `jansenfavero/amaria`, privado, branch principal `main`; base inicial `e836fac6932731bc48e704138e1645bae1309653` com README e .gitignore.
- Vercel: equipe `GERE` (`team_ASMlw2Iuhd5hOwsVxCdpM0MW`) acessível; listagem vazia e projeto `amaria` não encontrado. Nenhum projeto foi criado.
- Supabase: organização `GERE` (`vercel_icfg_rKPTaiJjAZBC8EiM8bjF7mrr`) acessível; os projetos existentes pertencem a outros produtos. Nenhum foi alterado ou reutilizado.

Não confundir conexão da conta com provisionamento dos recursos da AMAR.IA.

## Implantação Vercel

1. Confirmar a equipe GERE e autorizar a publicação: o deploy fornece o código do repositório privado à Vercel e cria um endpoint web.
2. Importar `jansenfavero/amaria`; framework Next.js; diretório raiz `.`; Node 22; instalação `npm ci`; build `npm run build`.
3. Configurar `NEXT_PUBLIC_SITE_URL=https://amar.ia.br` e `SITE_INDEXABLE=false`. Supabase/OpenAI não são necessários para executar a Fase 1.
4. Verificar build, `/`, página 404, `/api/health`, ícones e navegação móvel.
5. Adicionar `amar.ia.br` e aplicar exatamente os registros DNS indicados pelo painel. Não assumir propagação ou propriedade verificada.
6. Manter preview protegido e indexação desligada. Após revisão e lançamento, ativar `SITE_INDEXABLE=true` somente em produção.

## Preparação Supabase

1. Confirmar organização e custo de um projeto novo, exclusivo AMAR.IA; preferência técnica de região: São Paulo (`sa-east-1`).
2. Provisionar somente após a confirmação exigida pelo serviço. Não reativar nem reutilizar os outros projetos.
3. Configurar URL e publishable key nas variáveis indicadas. Nunca colocar `service_role`/secret em `NEXT_PUBLIC_*`.
4. A homepage é estática e permanece funcional com essas variáveis vazias. Um consumidor futuro de Supabase recebe erro explícito se a configuração estiver ausente.
5. Na Fase 2, implementar schema/migrações versionadas com CLI, autenticação e testes RLS para visitante, usuária A, usuária B e administradora. Não publicar tabelas antes disso.
6. Ativar o helper `updateSession` em `src/proxy.ts` somente nas rotas privadas/auth; validar claims, autorização e resposta com cookies renovados e `no-store`.
7. Definir Site URL/Redirect URLs reais. Conferir limites e SMTP próprio para e-mails personalizados em PT-BR, conforme o plano vigente.

## Próximo marco proposto

Autenticação real e perfil mínimo, esquema de conteúdos com fluxo rascunho → revisão → publicação, e área administrativa com autorização no servidor. Depois: Maria com limites, consentimento e persistência privada; áudio, assinatura e comunidade são etapas separadas.

## Referências técnicas consultadas

- https://supabase.com/changelog.md
- https://supabase.com/docs/guides/auth/server-side/creating-a-client
- https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
- https://nextjs.org/docs/app

Pacotes consultados diretamente no registro oficial npm; versões exatas em package.json. A atualização do changelog sobre templates de e-mail no Free tier deve ser considerada antes da autenticação. As mudanças em logs, schema realtime e instalação self-hosted não são usadas nesta fase.

## Verificação local deste marco

- Instalação reprodutível via `npm ci --offline --ignore-scripts`: aprovada.
- Lint e TypeScript: aprovados.
- Compilação de produção Next.js 16.3.3: aprovada sem credenciais Supabase/OpenAI.
- `npm run smoke`: aprovado para as 10 URLs previstas, incluindo 404; conferidos cabeçalhos, âncoras, idioma, ausência de formulários, manifest e noindex.
- `npm audit --omit=dev`: nenhuma vulnerabilidade reportada nas dependências de produção em 30/08/2026. Isso não substitui revisão de segurança contínua.
- Ícones derivados do emblema aprovado com redução de tamanho para a web.
- Não foi realizada verificação visual/interativa em navegador nem validação de um deploy remoto. Nenhuma conexão com banco ou OpenAI está sendo anunciada como ativa.
- TypeScript 5.9 e ESLint 9 fixados por compatibilidade com o conjunto de lint do Next.js; a primeira tentativa com TypeScript 7 foi rejeitada pelo typescript-eslint.
