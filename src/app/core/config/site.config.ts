/**
 * Configuração central do site. Todos os componentes leem estes valores.
 * Campos vazios ('') são tratados como "não configurado": o elemento
 * correspondente (botão, ícone, link) simplesmente não aparece.
 */
export interface SiteConfig {
  readonly companyName: string;
  readonly ownerName: string;
  /** URL pública do site, sem barra no final. Usada em SEO, sitemap e JSON-LD. */
  readonly siteUrl: string;
  readonly description: string;
  readonly email: string;
  readonly whatsapp: {
    /** Somente dígitos, com DDI e DDD. Ex.: '5511999999999'. */
    readonly number: string;
    /** Saudação inicial de todas as mensagens enviadas pelo site. */
    readonly greeting: string;
  };
  readonly social: {
    readonly instagram: string;
    readonly facebook: string;
    readonly linkedin: string;
  };
  /** Cidade/região atendida, usada nos dados estruturados. */
  readonly areaServed: string;
  /** Mostra a seção de depoimentos e o link no menu. Só ative com depoimentos reais. */
  readonly showTestimonials: boolean;
  /**
   * Foto do Sobre (arquivos em /public). `src` vazio mostra o placeholder.
   * `srcset` lista versões menores para celular.
   */
  readonly aboutPhoto: { readonly src: string; readonly srcset: string };
}

export const SITE_CONFIG: SiteConfig = {
  companyName: 'ER WEB',
  ownerName: '', // TODO: seu nome como deve aparecer no site
  siteUrl: '', // TODO: URL final do site, ex.: 'https://erweb.com.br'
  description:
    'Sites e landing pages para empresas e profissionais apresentarem seus serviços e receberem contatos pelo WhatsApp.',
  email: '', // TODO: e-mail de contato
  whatsapp: {
    number: '5571984231897',
    greeting: 'Olá, Elias! Vim pelo site da ER WEB e gostaria de um orçamento.',
  },
  social: {
    instagram: 'https://www.instagram.com/er.web_/',
    facebook: 'https://www.facebook.com/profile.php?id=61596543155702',
    linkedin: '', // opcional: 'https://linkedin.com/in/seu-perfil'
  },
  areaServed: 'Brasil', // TODO: confirmar região atendida
  showTestimonials: false,
  aboutPhoto: {
    src: '/assets/images/elias-1086.webp',
    srcset: '/assets/images/elias-600.webp 600w, /assets/images/elias-1086.webp 1086w',
  },
};

/** Monta o link do WhatsApp. Retorna null se o número não estiver configurado. */
export function whatsappLink(message: string = SITE_CONFIG.whatsapp.greeting): string | null {
  const number = SITE_CONFIG.whatsapp.number.replace(/\D/g, '');
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Número formatado para exibição. Ex.: '5571984231897' → '(71) 98423-1897'.
 * Remove o DDI 55 quando presente.
 */
export function formatWhatsappNumber(number: string = SITE_CONFIG.whatsapp.number): string {
  let digits = number.replace(/\D/g, '');
  if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2);
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return digits;
}
