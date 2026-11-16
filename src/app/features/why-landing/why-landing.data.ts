/**
 * Conteúdo da seção "Por que ter uma página".
 * Regra: todo número precisa de fonte verificável. Não adicione estatísticas sem fonte.
 */

export interface WhyStat {
  /** Valor exibido no contador (sem o símbolo de %). */
  readonly value: number;
  readonly suffix: string;
  readonly text: string;
  readonly source: string;
}

export interface JourneyStep {
  readonly id: 'instagram' | 'page' | 'whatsapp' | 'client';
  readonly title: string;
  readonly description: string;
}

export interface ComparisonCard {
  readonly tone: 'without' | 'with';
  readonly title: string;
  readonly items: readonly string[];
}

export interface WhyLandingContent {
  readonly kicker: string;
  readonly title: string;
  readonly subtitle: string;
  readonly chart: {
    readonly title: string;
    readonly description: string;
    readonly label: string;
    readonly socialLabel: string;
    readonly pageLabel: string;
    readonly xAxis: string;
    readonly yAxis: string;
    readonly ariaLabel: string;
  };
  readonly journey: {
    readonly title: string;
    readonly description: string;
    readonly steps: readonly JourneyStep[];
  };
  readonly stats: {
    readonly title: string;
    readonly items: readonly WhyStat[];
  };
  readonly comparison: readonly ComparisonCard[];
  readonly cta: string;
}

export const WHY_LANDING: WhyLandingContent = {
  kicker: 'Por que ter uma página',
  title: 'Seu cliente procura você na internet. O que ele encontra?',
  subtitle:
    'Antes de chamar no WhatsApp, as pessoas pesquisam. Uma página própria reúne tudo o que elas precisam saber para confiar em você.',
  chart: {
    title: 'Presença que trabalha por você',
    description:
      'Nas redes sociais, as informações se perdem entre as publicações. Uma página organiza serviços, portfólio e contato em um endereço fácil de compartilhar.',
    label: 'Gráfico ilustrativo',
    socialLabel: 'Só redes sociais',
    pageLabel: 'Com landing page',
    xAxis: 'Tempo',
    yAxis: 'Presença digital',
    ariaLabel:
      'Gráfico ilustrativo, sem valores, com duas linhas: "Só redes sociais" quase plana e "Com landing page" subindo ao longo do tempo.',
  },
  journey: {
    title: 'O caminho até o seu WhatsApp',
    description: 'A página é a ponte entre quem descobriu você e quem decidiu chamar.',
    steps: [
      {
        id: 'instagram',
        title: 'Instagram',
        description: 'A pessoa encontra seu perfil e clica no link da bio.',
      },
      {
        id: 'page',
        title: 'Landing page',
        description: 'Vê seus serviços, trabalhos e diferenciais em um só lugar.',
      },
      {
        id: 'whatsapp',
        title: 'WhatsApp',
        description: 'Chama com um clique, já sabendo o que quer.',
      },
      {
        id: 'client',
        title: 'Cliente',
        description: 'A conversa começa com mais confiança e menos dúvidas.',
      },
    ],
  },
  stats: {
    title: 'O que as pesquisas mostram',
    items: [
      {
        value: 53,
        suffix: '%',
        text: 'das visitas a sites no celular são abandonadas se a página leva mais de 3 segundos para carregar.',
        source: 'Fonte: Google, The Need for Mobile Speed (2016).',
      },
      {
        value: 45,
        suffix: '%',
        text: 'dos consumidores pesquisam na internet antes de comprar.',
        source: 'Fonte: Opinion Box e Buscar ID (2023).',
      },
      {
        value: 73,
        suffix: '%',
        text: 'dos consumidores avaliam a reputação da empresa antes de fechar a compra.',
        source: 'Fonte: Opinion Box e Buscar ID (2023).',
      },
    ],
  },
  comparison: [
    {
      tone: 'without',
      title: 'Sem página',
      items: [
        'O cliente pergunta no direct',
        'Espera pela resposta',
        'Não acha as informações',
        'Desiste e procura outro',
      ],
    },
    {
      tone: 'with',
      title: 'Com página',
      items: [
        'Vê serviços, portfólio e contato na hora',
        'Entende como você trabalha',
        'Confia no que encontrou',
        'Chama no WhatsApp pronto para conversar',
      ],
    },
  ],
  cta: 'Quero minha página',
};
