export interface ProjectData {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly websiteUrl: string;
  readonly thumbnailUrl: string;
  readonly thumbnailAlt: string;
  readonly isDemo: boolean;
}

export const projects: readonly ProjectData[] = [
  {
    id: 'robert-solar',
    name: 'Robert Solar',
    category: 'Landing page',
    description:
      'Página para apresentar serviços de consultoria em energia solar e facilitar o contato pelo WhatsApp.',
    tags: ['Responsivo', 'WhatsApp', 'Página única'],
    websiteUrl: 'https://robertsolar.com.br/',
    thumbnailUrl: '/assets/work/robert-solar.webp',
    thumbnailAlt: 'Apresentação ilustrativa do projeto Robert Solar',
    isDemo: false,
  },
  {
    id: 'modelo-advocacia',
    name: 'Modelo de Advocacia',
    category: 'Site demonstrativo',
    description:
      'Modelo de site para apresentar um escritório de advocacia, suas áreas de atuação e seus canais de contato.',
    tags: ['Projeto demonstrativo'],
    websiteUrl: 'https://modelo-advocacia-ecru.vercel.app/',
    thumbnailUrl: '/assets/work/modelo-advocacia.webp',
    thumbnailAlt: 'Apresentação ilustrativa do projeto Modelo de Advocacia',
    isDemo: true,
  },
];
