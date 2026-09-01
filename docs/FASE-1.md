# Fase 1 — Fundação AMAR.IA

Registro histórico da fundação. Para o estado atual de autenticação e ativação da equipe, consulte [FASE-2A.md](FASE-2A.md).

## Escopo entregue no código

- Next.js App Router + TypeScript estrito + Tailwind CSS.
- Interface responsiva de app em PT-BR: feed editorial, sidebar no desktop, drawer e atalhos inferiores no celular.
- Quatro temas iniciais com filtros: amor-próprio, limites saudáveis, relacionamentos e recomeços. Cards com leitura ampliada, coração, comentar e compartilhar.
- Curtidas locais durante a visita, sem contadores fictícios; compartilhamento nativo com fallback de cópia ou exibição do link. Comentários não coletam texto e explicam a etapa futura.
- Páginas internas `/sobre`, `/maria`, `/podcasts`, `/comunidade`, `/curadoria` e `/privacidade`.
- Ícone mais recente aprovado, em fita rosa e roxa; tipografia e cores derivadas da identidade pastel.
- Navegação por rotas e âncoras, diálogos nativos com Escape e contenção de foco, foco visível, link de salto, redução de movimento e páginas de erro.
- Metadados, canonical, robots, sitemap, manifest e ícones. Indexação desabilitada por padrão no pré-lançamento e sempre em deploys Preview.
- Clientes Supabase de navegador/servidor preparados; helper de renovação de sessão reservado à Fase 2.
- Endpoint `/api/health` de liveness, cabeçalhos básicos de segurança e fontes locais sem chamadas Google Fonts.

## O que esta fase NÃO ativa

Cadastro, autenticação, conversas reais, conteúdo clínico, cobrança, podcasts e comunidade ainda não foram implementados. Não há formulários nem coleta de relatos, cookies de sessão próprios, analytics, Adsense ou chamadas à OpenAI na homepage. O manifest prepara instalação; não foi adicionado cache offline de conteúdo privado.

A curadoria foi informada pelo responsável pelo projeto. Nenhum conteúdo é apresentado como já revisado pelas profissionais. As iniciais das curadoras são marcadores tipográficos; não representam retratos.

## Atualização visual — 31/08/2026

### Refinamento de contraste, imagens e leitura móvel

- Fundo das telas em degradê lilás e rosa, com cards e painéis internos claros, bordas definidas e sombras suaves. Títulos escuros, botões roxos e navegação ativa com contraste reforçado.
- Quatro imagens relacionadas aos títulos, servidas localmente em WebP. As três cenas com pessoas são ilustrações geradas por IA; a fotografia de flores tem crédito e fonte registrados em [IMAGENS.md](IMAGENS.md). Não representam usuárias ou depoimentos.
- Imagens separadas dos títulos e textos, evitando depender da fotografia para o contraste de leitura. A leitura ampliada também exibe a imagem e seu crédito.
- Textos principais de no mínimo 16 px no celular, entrelinhas ampliadas e ações sociais de pelo menos 14 px, com alvos de toque espaçosos. Sidebar, navegação móvel, filtros e ações existentes preservados.
- Lint, TypeScript e compilação de produção aprovados. HTML das sete páginas aprovado no `static-check`; smoke HTTP local aprovado nas 20 URLs, incluindo as quatro novas imagens e a resposta 404 esperada.
- `node scripts/visual-check.mjs` valida regras estáticas de tipografia e controles nas larguras 320, 360, 390, 430 e 760 px, razões de contraste das combinações declaradas e tamanho/formato das imagens. Não substitui inspeção visual ou testes interativos em navegador.

O foco solicitado passou a ser visual e experiência de uso. Nenhuma tarefa de monitoramento foi criada, nem houve nova tentativa de publicação administrativa na Vercel. A versão anterior com feed foi posteriormente observada por HTTP no domínio público; isso não confirma a publicação deste refinamento nem resolve o bloqueio administrativo registrado abaixo.

### Histórico da conversão para feed

A homepage institucional foi reorganizada como feed de app premium, mantendo a identidade aprovada. Os quatro textos são prévias editoriais para apresentar os temas; não constituem acervo clínico revisado. Nenhuma nova integração com banco, autenticação ou cobrança foi ativada.

O responsável confirmou que a publicação anterior abre em `https://amaria-nine.vercel.app`. As capturas mostram o projeto `amaria`, na equipe GERE, com status Ready e botão Connect Git: a integração automática com GitHub ainda precisa ser configurada.

Na revisão visual, lint, TypeScript e a primeira compilação de produção passaram. A tentativa de navegador foi interrompida por queda de conexão do ambiente; o teste HTTP atualizado também não concluiu por cancelamento da aprovação de rede. Não considerar testes interativos ou publicação desta nova versão confirmados com base apenas no build. O smoke agora contempla 16 URLs e verifica também os quatro cards e seus três botões.

A conexão administrativa Vercel continua retornando 404 ao consultar `amaria` na equipe GERE. A confirmação do site anterior veio do responsável e das capturas, não dessa consulta.

O script `node scripts/static-check.mjs` permite verificar o HTML real gerado das sete páginas sem depender de rede: idioma, heading principal único, links internos, âncoras, quatro cards, doze ações sociais, ausência de formulários e noindex. Ele complementa, mas não substitui, o smoke HTTP e a verificação interativa.

Resultado final local: lint, TypeScript, compilação de produção e `static-check` aprovados para as sete páginas. Interface salva na `main` em `aa7e9ba683c7f7ee24f5926dad9f9272d2989c29`.

**Publicação desta revisão bloqueada:** o envio ao projeto `amaria`, equipe GERE, foi rejeitado pela proteção de publicação porque a consulta anterior retornou 404 e não confirmou a identidade do destino. Não houve novo deploy confirmado nem alteração do site já existente. Não repetir o envio ou mudar de caminho para contornar esse bloqueio; confirmar o Project ID correto e resolver a autorização antes de continuar.

## Conexões inspecionadas em 30/08/2026

- GitHub: `jansenfavero/amaria`, privado. A versão validada `e512716dc6333a496805ffd36a8b8a1fa06fcff7` foi aprovada e promovida à `main`, sem reescrever histórico. PR #1 incorporado.
- Vercel: equipe `GERE` (`team_ASMlw2Iuhd5hOwsVxCdpM0MW`) confirmada e publicação autorizada. A conexão aceitou os 34 arquivos e informou o deploy `dpl_CHsFC3YhUjpw1B1gPP7VTnz8yYu6`, alvo production. Entretanto, consultas de projeto, status e logs retornaram 404. **Publicação não confirmada.** Não recriar um segundo projeto sem resolver essa inconsistência.
- Supabase: projeto exclusivo `AMAR.IA`, ref `lhmrojqehenwviyytkmr`, na organização `GERE` (`vercel_icfg_rKPTaiJjAZBC8EiM8bjF7mrr`), região São Paulo (`sa-east-1`), status confirmado `ACTIVE_HEALTHY`. Custo informado pelo serviço: zero por mês no provisionamento atual. Consulta SQL de conexão aprovada; schema public vazio e verificação inicial de segurança sem alertas. Nenhum projeto de outro produto foi alterado.

API Supabase: `https://lhmrojqehenwviyytkmr.supabase.co`. URL e publishable key configuradas em `.env.local`, excluído do Git. Não há service-role/secret no cliente. As variáveis ainda NÃO foram configuradas em um deploy Vercel verificado.

Não confundir conexão da conta com provisionamento dos recursos da AMAR.IA.

## Implantação Vercel

1. Autorização da equipe GERE já recebida. Resolver a divergência entre criação do deploy e consultas 404 antes de considerar a plataforma publicada ou disparar outro deploy.
2. Vincular `jansenfavero/amaria` ao projeto correto para deploy automático; framework Next.js; Root Directory vazio para a raiz (a API rejeita `.`); Node 22; instalação `npm ci`; build `npm run build`.
3. Configurar `NEXT_PUBLIC_SITE_URL=https://amar.ia.br` e `SITE_INDEXABLE=false`. Supabase/OpenAI não são necessários para executar a Fase 1.
4. Verificar build, `/`, página 404, `/api/health`, ícones e navegação móvel.
5. Adicionar `amar.ia.br` e aplicar exatamente os registros DNS indicados pelo painel. Não assumir propagação ou propriedade verificada.
6. Manter preview protegido e indexação desligada. Após revisão e lançamento, ativar `SITE_INDEXABLE=true` somente em produção.

## Preparação Supabase

1. Projeto exclusivo já provisionado e verificado: `lhmrojqehenwviyytkmr`. Não criar outro projeto, reativar ou reutilizar projetos de outros produtos.
2. Região São Paulo (`sa-east-1`); custo informado e registrado no fluxo de confirmação do serviço: zero mensal. Alterações de plano, capacidade ou recursos pagos exigem nova avaliação.
3. URL e publishable key configuradas localmente; ainda pendentes nas variáveis da Vercel. Nunca colocar `service_role`/secret em `NEXT_PUBLIC_*`.
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
- Não foi realizada verificação visual/interativa em navegador nem validação de um deploy remoto. O banco foi verificado pela conexão administrativa Supabase, mas os fluxos da aplicação ainda não consomem dados. OpenAI não integrada.
- TypeScript 5.9 e ESLint 9 fixados por compatibilidade com o conjunto de lint do Next.js; a primeira tentativa com TypeScript 7 foi rejeitada pelo typescript-eslint.
