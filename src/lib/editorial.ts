export const topics = [
  {
    id: "amor-proprio",
    name: "Amor-próprio",
    caption: "Comece por você",
    tone: "rose",
  },
  {
    id: "limites",
    name: "Limites saudáveis",
    caption: "Seu espaço importa",
    tone: "sage",
  },
  {
    id: "relacionamentos",
    name: "Relacionamentos",
    caption: "Vínculos com sentido",
    tone: "lilac",
  },
  {
    id: "recomecos",
    name: "Recomeços",
    caption: "Novos caminhos",
    tone: "sand",
  },
] as const;

export type TopicId = (typeof topics)[number]["id"];

export const posts = [
  {
    id: "o-amor-que-voce-oferece",
    topic: "amor-proprio" as TopicId,
    kicker: "UM LEMBRETE GENTIL",
    title: "Você também merece o amor que oferece.",
    excerpt:
      "Entre cuidar de quem você ama e dar conta de tanta coisa, existe alguém que também precisa de espaço: você.",
    question: "Que gesto de carinho você gostaria de oferecer a si mesma hoje?",
    paragraphs: [
      "Nem todo cuidado precisa ser grande. Às vezes, ele cabe em uma pausa, em uma escolha feita com calma ou em reservar um momento que seja só seu.",
      "Esta é uma primeira conversa sobre amor-próprio: reconhecer que os seus desejos também podem ocupar um lugar na sua história. Sem a obrigação de acertar sempre ou de transformar tudo de uma vez.",
    ],
    tone: "plum",
    number: "01",
  },
  {
    id: "o-espaco-dos-seus-limites",
    topic: "limites" as TopicId,
    kicker: "RELAÇÕES COM MAIS ESPAÇO",
    title: "Seu limite também merece ser ouvido.",
    excerpt:
      "Estar perto de alguém não precisa significar deixar de escutar o que é importante para você.",
    question:
      "O que você gostaria que as pessoas entendessem melhor sobre o seu tempo e o seu espaço?",
    paragraphs: [
      "Cada pessoa chega a uma relação com ritmos, vontades e possibilidades diferentes. Dar nome a essas diferenças pode abrir uma conversa sobre o que faz sentido para cada uma.",
      "Neste tema, vamos explorar o lugar dos limites nas relações, sem fórmulas prontas e respeitando os diferentes contextos de cada história.",
    ],
    tone: "sage",
    number: "02",
  },
  {
    id: "inteira-em-uma-relacao",
    topic: "relacionamentos" as TopicId,
    kicker: "VÍNCULOS QUE FAZEM SENTIDO",
    title: "Amar alguém. Continuar sendo você.",
    excerpt:
      "Há muitas formas de construir um vínculo. Queremos conversar sobre aquelas em que também existe espaço para a sua individualidade.",
    question:
      "Quais partes de você gostaria de preservar e compartilhar nas suas relações?",
    paragraphs: [
      "As relações fazem parte da nossa vida, mas não precisam contar a nossa história inteira. Interesses, amizades e projetos pessoais também compõem quem somos.",
      "Este será um espaço para olhar para os encontros, as diferenças e as escolhas que atravessam os vínculos — com curiosidade, respeito e sem uma definição única de como amar.",
    ],
    tone: "lilac",
    number: "03",
  },
  {
    id: "um-comeco-no-seu-tempo",
    topic: "recomecos" as TopicId,
    kicker: "CADA HISTÓRIA TEM SEU TEMPO",
    title: "Você não precisa florescer com pressa.",
    excerpt:
      "Um novo capítulo pode começar devagar. Com espaço para o que ficou, para as dúvidas e para o que ainda está por vir.",
    question:
      "O que você gostaria de levar consigo para o seu próximo capítulo?",
    paragraphs: [
      "Nem sempre um recomeço vem acompanhado de certezas. Às vezes, ele se parece mais com experimentar uma possibilidade e perceber, aos poucos, o que combina com você.",
      "Aqui, queremos abrir conversas sobre mudanças, escolhas e novos caminhos. Cada trajetória merece ser olhada com respeito ao seu próprio tempo.",
    ],
    tone: "sand",
    number: "04",
  },
] as const;

export type EditorialPost = (typeof posts)[number];
