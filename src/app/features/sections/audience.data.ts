/**
 * Seção "Para quem é". Para adicionar um nicho, copie um item e troque o nome.
 * `icon` é o atributo `d` de um <path> SVG 24×24 desenhado só com traço.
 */
export interface AudienceNiche {
  readonly name: string;
  readonly icon: string;
}

export const AUDIENCE = {
  kicker: 'Para quem é',
  title: 'Feito para quem vive de atender bem',
  subtitle:
    'Profissionais e pequenos negócios que precisam ser encontrados e passar confiança antes da primeira conversa.',
  closing: 'Não encontrou o seu nicho?',
  closingLink: 'Fale comigo.',
  niches: [
    { name: 'Clínicas e consultórios', icon: 'M9 3h6v6h6v6h-6v6H9v-6H3V9h6z' },
    { name: 'Advogados', icon: 'M12 4v16M8 20h8M4 7h16M6 7l-3 6h6zM18 7l-3 6h6z' },
    {
      name: 'Nutricionistas',
      icon: 'M12 8c-2-2-7-1.5-7 3.5C5 15.5 8 20 10.5 20c1 0 1.5-.5 1.5-.5s.5.5 1.5.5C16 20 19 15.5 19 11.5 19 6.5 14 6 12 8zM12 8c0-2 1-4 3-4.5',
    },
    { name: 'Cursos online', icon: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6' },
    {
      name: 'Confeitarias e gastronomia',
      icon: 'M4 20h16M5 20v-7h14v7M5 16.5c2.3 1 4.7-1 7 0s4.7 1 7 0M12 13V9M12 6.5V5',
    },
    {
      name: 'Salões e estética',
      icon: 'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.2 7.8 20 19.5M8.2 16.2 20 4.5',
    },
    { name: 'Personal trainers', icon: 'M6.5 7v10M3.5 9.5v5M17.5 7v10M20.5 9.5v5M6.5 12h11' },
    {
      name: 'Prestadores de serviço',
      icon: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z',
    },
  ] satisfies readonly AudienceNiche[],
} as const;
