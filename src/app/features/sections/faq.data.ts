/**
 * Perguntas frequentes. Edite aqui; a seção e os dados estruturados (JSON-LD FAQPage)
 * são gerados a partir desta lista.
 *
 * A resposta é uma lista de trechos:
 *  - texto simples: 'Texto'
 *  - destaque (negrito na cor da marca): { highlight: '7 dias' }
 *  - valor em reais (formatado como R$): { price: 389 }
 *
 * Uma pergunta com `answer: null` fica oculta no site e fora do JSON-LD até ser preenchida.
 */
export type FaqSegment = string | { readonly highlight: string } | { readonly price: number };

export interface FaqItem {
  readonly question: string;
  readonly answer: readonly FaqSegment[] | null;
}

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: 'Qual é o prazo para criar um site?',
    answer: [
      'Depois das reuniões de alinhamento, quando o conteúdo e o objetivo do projeto estiverem definidos, a entrega acontece em até ',
      { highlight: '7 dias' },
      '. Projetos maiores, como sistemas ou lojas virtuais, podem ter um prazo diferente, combinado antes de começar.',
    ],
  },
  {
    question: 'Quanto custa um projeto?',
    answer: [
      'Os projetos começam a partir de ',
      { price: 389 },
      '. O valor final depende do tamanho e das funcionalidades do projeto, e você recebe o orçamento antes de qualquer compromisso. ',
      { highlight: 'Hospedagem e domínio já estão inclusos.' },
    ],
  },
  {
    question: 'A hospedagem e o domínio estão inclusos?',
    // TODO: confirmar por quanto tempo (ex.: primeiro ano) e como funciona a renovação
    answer: [
      'Sim. A hospedagem e o domínio (o endereço do seu site, como seunegocio.com.br) já estão inclusos no valor do projeto.',
    ],
  },
  {
    question: 'O que eu preciso ter para começar?',
    answer: [
      'Basta saber o que o seu negócio oferece e para quem. Se tiver logo, fotos e textos, ótimo. Se não tiver, eu te ajudo a organizar o conteúdo durante o alinhamento.',
    ],
  },
  {
    question: 'O site vai funcionar bem no celular?',
    answer: [
      'Sim. Todos os projetos são responsivos, ou seja, se adaptam a celulares, tablets e computadores.',
    ],
  },
  {
    question: 'Meu site vai aparecer no Google?',
    answer: [
      'O site é entregue com as boas práticas de SEO básico, que ajudam o Google a entender e encontrar sua página. A posição nos resultados depende de vários fatores e não pode ser garantida por ninguém, mas sua página começa do jeito certo.',
    ],
  },
  {
    question: 'Posso pedir alterações?',
    // TODO: manter a resposta atual ou definir quantas rodadas de ajustes estão incluídas
    answer: ['As revisões e ajustes previstos são definidos no escopo antes do início.'],
  },
  {
    question: 'É possível fazer manutenção depois?',
    // TODO: manter a resposta atual ou explicar como funciona (valor mensal, por demanda etc.)
    answer: [
      'A possibilidade e o formato de suporte podem ser combinados conforme a necessidade.',
    ],
  },
  {
    question: 'Como funciona o pagamento?',
    // TODO: preencher formas de pagamento e condições (ex.: Pix, cartão, entrada + entrega).
    // Enquanto for null, a pergunta não aparece no site.
    answer: null,
  },
  {
    question: 'Você atende empresas de outras cidades?',
    answer: [
      'Sim. Todo o processo pode ser feito online, por videochamada e WhatsApp, de qualquer lugar do Brasil.',
    ],
  },
];

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Formata um valor como moeda brasileira (ex.: 389 → "R$ 389"). */
export function formatPrice(value: number): string {
  return currency.format(value);
}

/** Texto puro de uma resposta (usado no JSON-LD). */
export function faqAnswerText(answer: readonly FaqSegment[]): string {
  return answer
    .map((part) =>
      typeof part === 'string' ? part : 'price' in part ? formatPrice(part.price) : part.highlight,
    )
    .join('');
}

/** Só as perguntas com resposta preenchida. */
export const VISIBLE_FAQ = FAQ_ITEMS.filter(
  (item): item is FaqItem & { readonly answer: readonly FaqSegment[] } => item.answer !== null,
);

/** Dados estruturados FAQPage (schema.org) a partir das perguntas visíveis. */
export function faqJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: VISIBLE_FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: faqAnswerText(item.answer) },
    })),
  };
}
