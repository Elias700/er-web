/**
 * Depoimentos reais, somente com autorização do cliente.
 * A seção só aparece quando SITE_CONFIG.showTestimonials = true e a lista não está vazia.
 * Nunca use depoimentos fictícios.
 */
export interface Testimonial {
  readonly quote: string;
  /** Ex.: 'Maria Silva, Clínica Exemplo' */
  readonly byline: string;
}

export const TESTIMONIALS: readonly Testimonial[] = [
  // { quote: '...', byline: 'Nome, empresa' },
];
