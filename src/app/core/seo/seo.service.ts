import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_CONFIG } from '../config/site.config';

const TITLE = `${SITE_CONFIG.companyName} | Sites e landing pages profissionais`;
const OG_IMAGE_PATH = '/assets/og-image.png';

/**
 * Mantém title, description, Open Graph, canonical e JSON-LD em sincronia com o site.config.ts.
 * As mesmas tags existem estáticas no index.html para robôs que não executam JavaScript.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(): void {
    const { description, siteUrl, companyName } = SITE_CONFIG;
    const image = siteUrl ? `${siteUrl}${OG_IMAGE_PATH}` : OG_IMAGE_PATH;

    this.title.setTitle(TITLE);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: TITLE });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:site_name', content: companyName });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ name: 'twitter:title', content: TITLE });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    if (siteUrl) {
      this.meta.updateTag({ property: 'og:url', content: `${siteUrl}/` });
      this.setCanonical(`${siteUrl}/`);
    }
    this.setJsonLd();
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }

  private setJsonLd(): void {
    const { companyName, ownerName, description, siteUrl, email, whatsapp, social, areaServed } =
      SITE_CONFIG;
    const sameAs = [social.instagram, social.linkedin].filter(Boolean);
    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: companyName,
      description,
      areaServed,
      knowsAbout: ['Desenvolvimento web', 'Landing pages', 'Sites institucionais'],
      ...(siteUrl && { url: `${siteUrl}/`, image: `${siteUrl}${OG_IMAGE_PATH}` }),
      ...(email && { email }),
      ...(whatsapp.number && { telephone: `+${whatsapp.number.replace(/\D/g, '')}` }),
      ...(sameAs.length && { sameAs }),
      ...(ownerName && { founder: { '@type': 'Person', name: ownerName } }),
    };

    let script = this.document.getElementById('ld-professional-service');
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'ld-professional-service';
      script.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
