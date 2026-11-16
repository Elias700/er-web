import { Injectable, InjectionToken, inject } from '@angular/core';
import { SITE_CONFIG, whatsappLink } from '../config/site.config';

/** Valores do formulário de contato. `projectType` já é o texto da opção (ex.: "Não sei"). */
export interface ContactFormValue {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly projectType: string;
  readonly message: string;
}

/**
 * Monta a mensagem do WhatsApp. Função pura: mesma entrada, mesma saída.
 * - remove espaços no início e no fim de cada campo;
 * - omite a linha inteira de qualquer campo vazio;
 * - `*texto*` vira negrito no WhatsApp.
 * A codificação para URL (encodeURIComponent) é feita em `whatsappLink`.
 */
export function buildWhatsAppMessage(
  form: ContactFormValue,
  greeting: string = SITE_CONFIG.whatsapp.greeting,
): string {
  const fields: readonly [label: string, value: string][] = [
    ['Nome', form.name],
    ['E-mail', form.email],
    ['WhatsApp', form.phone],
    ['Tipo de projeto', form.projectType],
    ['Mensagem', form.message],
  ];
  const lines = fields
    .map(([label, value]) => [label, value.trim()] as const)
    .filter(([, value]) => value !== '')
    .map(([label, value]) => `*${label}:* ${value}`);

  return [greeting.trim(), '', ...lines, '', 'Aguardo seu retorno!'].join('\n');
}

/** Resultado de um envio. */
export type ContactResult =
  /** Abrir uma URL (ex.: WhatsApp). Deve ser aberta no mesmo clique, sem await antes. */
  | { readonly kind: 'redirect'; readonly url: string }
  /** Mensagem entregue por um serviço (ex.: e-mail). */
  | { readonly kind: 'sent' };

/**
 * Estratégia de envio. Hoje só existe a do WhatsApp. Para enviar por e-mail
 * (ex.: Web3Forms), crie outra classe e registre em app.config.ts:
 *
 *   { provide: CONTACT_STRATEGY, useClass: Web3FormsContactStrategy }
 *
 *   export class Web3FormsContactStrategy implements ContactStrategy {
 *     readonly id = 'email';
 *     async send(form: ContactFormValue): Promise<ContactResult> {
 *       const response = await fetch('https://api.web3forms.com/submit', {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
 *         body: JSON.stringify({ access_key: 'SUA_CHAVE', ...form }),
 *       });
 *       if (!response.ok) throw new Error('Falha no envio');
 *       return { kind: 'sent' };
 *     }
 *   }
 *
 * O componente não muda: ele trata 'redirect' (abre a URL) e 'sent' (mostra sucesso).
 */
export interface ContactStrategy {
  readonly id: 'whatsapp' | 'email';
  send(form: ContactFormValue): ContactResult | Promise<ContactResult>;
}

@Injectable({ providedIn: 'root' })
export class WhatsAppContactStrategy implements ContactStrategy {
  readonly id = 'whatsapp' as const;

  send(form: ContactFormValue): ContactResult {
    const url = whatsappLink(buildWhatsAppMessage(form));
    if (!url) throw new Error('Número de WhatsApp não configurado em site.config.ts.');
    return { kind: 'redirect', url };
  }
}

export const CONTACT_STRATEGY = new InjectionToken<ContactStrategy>('CONTACT_STRATEGY', {
  providedIn: 'root',
  factory: () => inject(WhatsAppContactStrategy),
});

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly strategy = inject(CONTACT_STRATEGY);

  /** Qual canal está ativo ('whatsapp' ou 'email'). */
  readonly channel = this.strategy.id;

  /** Mesma função pura, exposta pelo serviço. */
  buildWhatsAppMessage(form: ContactFormValue): string {
    return buildWhatsAppMessage(form);
  }

  send(form: ContactFormValue): ContactResult | Promise<ContactResult> {
    return this.strategy.send(form);
  }
}
