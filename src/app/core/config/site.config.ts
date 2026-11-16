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
    readonly defaultMessage: string;
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
  /** Caminho da foto do Sobre (em /public). Deixe '' enquanto a foto não existir. */
  readonly aboutPhoto: string;
}

export const SITE_CONFIG: SiteConfig = {
  companyName: 'ER WEB',
  ownerName: '', // TODO: seu nome como deve aparecer no site
  siteUrl: '', // TODO: URL final do site, ex.: 'https://erweb.com.br'
  description:
    'Sites e landing pages para empresas e profissionais apresentarem seus serviços e receberem contatos pelo WhatsApp.',
  email: '', // TODO: e-mail de contato
  whatsapp: {
    number: '', // TODO: número com DDI e DDD, só dígitos, ex.: '5511999999999'
    defaultMessage: 'Olá! Vim pelo site da ER WEB e gostaria de solicitar um orçamento.',
  },
  social: {
    instagram: 'https://www.instagram.com/er.web_/',
    facebook: 'https://www.facebook.com/profile.php?id=61596543155702',
    linkedin: '', // opcional: 'https://linkedin.com/in/seu-perfil'
  },
  areaServed: 'Brasil', // TODO: confirmar região atendida
  showTestimonials: false,
  aboutPhoto: '', // TODO: '/assets/images/elias.webp' quando a foto for adicionada
};

/** Monta o link do WhatsApp. Retorna null se o número não estiver configurado. */
export function whatsappLink(message: string = SITE_CONFIG.whatsapp.defaultMessage): string | null {
  const number = SITE_CONFIG.whatsapp.number.replace(/\D/g, '');
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
