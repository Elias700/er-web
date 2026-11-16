import { Injectable, InjectionToken, inject } from '@angular/core';
import { SITE_CONFIG, whatsappLink } from '../config/site.config';

export interface ContactMessage {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly projectType: string;
  readonly message: string;
}

/**
 * Contrato do serviço de envio. Para ligar EmailJS, Formspree ou um backend,
 * crie uma classe que implemente esta interface e registre em app.config.ts:
 *
 *   { provide: CONTACT_TRANSPORT, useClass: FormspreeTransport }
 *
 * Exemplo com Formspree (sem dependência nova, só fetch):
 *
 *   export class FormspreeTransport implements ContactTransport {
 *     async send(message: ContactMessage): Promise<void> {
 *       const response = await fetch('https://formspree.io/f/SEU_ID', {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
 *         body: JSON.stringify(message),
 *       });
 *       if (!response.ok) throw new Error('Falha no envio');
 *     }
 *   }
 */
export interface ContactTransport {
  send(message: ContactMessage): Promise<void>;
}

// TODO: registrar um ContactTransport em app.config.ts para ativar o envio pelo formulário.
export const CONTACT_TRANSPORT = new InjectionToken<ContactTransport | null>('CONTACT_TRANSPORT', {
  providedIn: 'root',
  factory: () => null,
});

/** Como o formulário vai entregar a mensagem, conforme o que estiver configurado. */
export type ContactMode = 'transport' | 'whatsapp' | 'unavailable';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly transport = inject(CONTACT_TRANSPORT);

  readonly mode: ContactMode = this.transport
    ? 'transport'
    : whatsappLink()
      ? 'whatsapp'
      : 'unavailable';

  send(message: ContactMessage): Promise<void> {
    if (!this.transport) return Promise.reject(new Error('Serviço de envio não configurado.'));
    return this.transport.send(message);
  }

  /** Link do WhatsApp com a mensagem montada a partir do formulário. */
  whatsappUrl(message: ContactMessage): string | null {
    const details = [
      `*Nome:* ${message.name}`,
      `*E-mail:* ${message.email}`,
      message.phone && `*WhatsApp:* ${message.phone}`,
      message.projectType && `*Tipo de projeto:* ${message.projectType}`,
    ].filter(Boolean);
    const text = [
      `Olá! Vim pelo site da ${SITE_CONFIG.companyName}.`,
      '',
      ...details,
      '',
      message.message,
    ].join('\n');
    return whatsappLink(text);
  }
}
