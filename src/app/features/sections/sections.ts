import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MagneticDirective,
  ParallaxDirective,
  RevealDirective,
  ScrollProgressDirective,
  StaggerDirective,
} from '../../shared/directives/reveal.directive';
import { AUDIENCE } from './audience.data';
import { INCLUDED } from './included.data';
import { TESTIMONIALS } from './testimonials.data';
import { VISIBLE_FAQ, formatPrice, type FaqSegment } from './faq.data';
import { PROJECT_TYPES } from './contact.data';
import { isPlatformBrowser } from '@angular/common';
import { SITE_CONFIG, formatWhatsappNumber, whatsappLink } from '../../core/config/site.config';
import { ContactService, type ContactResult } from '../../core/contact/contact.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RevealDirective, StaggerDirective],
  template: ` <section
    class="content-section section-light section-white"
    id="servicos"
    aria-labelledby="services-title"
  >
    <div class="section-wrap">
      <header class="section-heading" appReveal>
        <p class="section-kicker">O que fazemos</p>
        <h2 id="services-title">Soluções para apresentar seu negócio online</h2>
        <p>Da primeira página ao suporte contínuo, escolha o que faz sentido para o seu momento.</p>
      </header>
      <div class="service-grid" appStagger>
        @for (service of services; track service.title) {
          <article class="service-card" data-stagger-item>
            <span class="service-symbol" aria-hidden="true">{{ service.symbol }}</span>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
          </article>
        }
      </div>
      <!-- TODO: conteúdo real -->
    </div>
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesSectionComponent {
  readonly services = [
    {
      title: 'Sites institucionais',
      description: 'Apresente sua empresa, seus serviços e as formas de contato em um só lugar.',
      symbol: '▱',
    },
    {
      title: 'Landing pages',
      description: 'Uma página focada em explicar uma oferta e orientar a próxima ação.',
      symbol: '↗',
    },
    {
      title: 'E-commerce',
      description: 'Uma loja online organizada para exibir produtos e apoiar o processo de compra.',
      symbol: '□',
    },
    {
      title: 'Sistemas web',
      description:
        'Ferramentas acessadas pelo navegador, planejadas conforme a necessidade do projeto.',
      symbol: '⌘',
    },
    {
      title: 'Manutenção',
      description: 'Ajustes e cuidados técnicos para manter seu site atualizado.',
      symbol: '⚙',
    },
    {
      title: 'SEO',
      description:
        'Boas práticas técnicas e de conteúdo para ajudar mecanismos de busca a entender seu site.',
      symbol: '⌕',
    },
  ] as const;
}

@Component({
  selector: 'app-audience',
  standalone: true,
  imports: [RevealDirective, StaggerDirective],
  template: ` <section
    class="content-section audience-section"
    id="para-quem"
    aria-labelledby="audience-title"
  >
    <div class="section-wrap">
      <header class="section-heading" appReveal>
        <p class="section-kicker">{{ content.kicker }}</p>
        <h2 id="audience-title">{{ content.title }}</h2>
        <p>{{ content.subtitle }}</p>
      </header>
      <ul class="audience-grid" appStagger>
        @for (niche of content.niches; track niche.name) {
          <li class="audience-card" data-stagger-item>
            <span class="audience-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path [attr.d]="niche.icon" /></svg>
            </span>
            <span class="audience-name">{{ niche.name }}</span>
          </li>
        }
      </ul>
      <p class="audience-closing" appReveal>
        {{ content.closing }} <a href="#contato">{{ content.closingLink }}</a>
      </p>
    </div>
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudienceSectionComponent {
  protected readonly content = AUDIENCE;
}

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [RevealDirective, ScrollProgressDirective],
  template: ` <section
    class="content-section section-dark"
    id="processo"
    aria-labelledby="process-title"
  >
    <div class="section-wrap">
      <header class="section-heading section-heading--light" appReveal>
        <p class="section-kicker">Etapas claras</p>
        <h2 id="process-title">Como trabalhamos</h2>
        <p>Um caminho acompanhado do primeiro alinhamento até a publicação.</p>
      </header>
      <div class="process-timeline">
        <span class="process-line-track" aria-hidden="true"
          ><span class="process-line-fill" appScrollProgress></span
        ></span>
        <ol class="process-list">
          @for (step of steps; track step.title; let index = $index) {
            <li class="process-step" appReveal [revealDelay]="index * 0.06">
              <span class="process-number">0{{ index + 1 }}</span>
              <div>
                <h3>{{ step.title }}</h3>
                <p>{{ step.description }}</p>
              </div>
            </li>
          }
        </ol>
      </div>
      <!-- TODO: revisar etapas e responsabilidades -->
    </div>
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessSectionComponent {
  readonly steps = [
    { title: 'Briefing', description: 'Entendemos o negócio, o público e o objetivo do projeto.' },
    { title: 'Design', description: 'Organizamos o conteúdo e definimos a direção visual.' },
    {
      title: 'Desenvolvimento',
      description: 'Construímos a experiência para diferentes tamanhos de tela.',
    },
    { title: 'Testes', description: 'Revisamos navegação, conteúdo e funcionamento.' },
    {
      title: 'Lançamento',
      description: 'Preparamos a publicação conforme a infraestrutura combinada.',
    },
    { title: 'Suporte', description: 'Alinhamos os cuidados e próximos ajustes após a entrega.' },
  ] as const;
}

@Component({
  selector: 'app-included',
  standalone: true,
  imports: [RevealDirective, StaggerDirective],
  template: ` <section
    class="content-section section-light"
    id="incluso"
    aria-labelledby="included-title"
  >
    <div class="section-wrap included-layout">
      <header class="section-heading section-heading--left" appReveal>
        <p class="section-kicker">{{ content.kicker }}</p>
        <h2 id="included-title">{{ content.title }}</h2>
        <p>{{ content.subtitle }}</p>
      </header>
      <ul class="included-list" appStagger>
        @for (item of content.items; track item.title) {
          <li data-stagger-item>
            <span class="included-check" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
            </span>
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </li>
        }
      </ul>
    </div>
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncludedSectionComponent {
  protected readonly content = INCLUDED;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ParallaxDirective, RevealDirective],
  template: ` <section
    class="content-section section-dark about-section"
    id="sobre"
    aria-labelledby="about-title"
  >
    <div class="section-wrap about-layout">
      <div class="about-photo" [class.about-photo--empty]="!photo.src" [appParallax]="18">
        @if (photo.src) {
          <img
            [src]="photo.src"
            [attr.srcset]="photo.srcset || null"
            sizes="(max-width: 800px) 92vw, 40vw"
            [alt]="photoAlt"
            width="1086"
            height="1448"
            loading="lazy"
            decoding="async"
          />
        } @else {
          <!-- Placeholder decorativo até a foto existir (SITE_CONFIG.aboutPhoto) -->
          <span class="about-photo__monogram" aria-hidden="true">ER</span>
        }
      </div>
      <div class="about-copy" appReveal>
        <p class="section-kicker">Sobre mim</p>
        <h2 id="about-title">Quem está por trás da ER WEB</h2>
        <p>
          Sou desenvolvedor web e crio sites para empresas e profissionais que querem apresentar seu
          trabalho com clareza na internet. Em cada projeto, sigo boas práticas de programação e de
          design para entregar páginas rápidas, organizadas e fáceis de usar em qualquer tela.
        </p>
        <p>
          Sou formado em Licenciatura em Pedagogia, e essa formação aparece no meu jeito de
          trabalhar: escuto com atenção, explico cada etapa sem termos complicados e organizo o
          conteúdo para que seu público entenda sua mensagem logo de primeira.
        </p>
        <p>
          Hoje curso Análise e Desenvolvimento de Sistemas, o que me mantém estudando e atualizado
          sobre as ferramentas e os métodos que uso no dia a dia.
        </p>
        <ul class="about-highlights" aria-label="Formação e atuação">
          <li><span>Atuação</span><strong>Desenvolvimento web</strong></li>
          <li><span>Formação</span><strong>Licenciatura em Pedagogia</strong></li>
          <li><span>Cursando</span><strong>Análise e Desenvolvimento de Sistemas</strong></li>
        </ul>
      </div>
    </div>
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutSectionComponent {
  protected readonly photo = SITE_CONFIG.aboutPhoto;
  protected readonly photoAlt = SITE_CONFIG.ownerName
    ? `Foto de ${SITE_CONFIG.ownerName}, desenvolvedor da ${SITE_CONFIG.companyName}`
    : `Foto do desenvolvedor da ${SITE_CONFIG.companyName}`;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [RevealDirective],
  template: ` <section
    class="content-section section-light"
    id="depoimentos"
    aria-labelledby="testimonials-title"
  >
    <div class="section-wrap">
      <header class="section-heading" appReveal>
        <p class="section-kicker">Depoimentos</p>
        <h2 id="testimonials-title">A experiência de quem trabalhou com a ER WEB</h2>
      </header>
      @if (testimonials.length) {
        <div class="testimonial-placeholder" aria-live="polite" aria-atomic="true">
          <span aria-hidden="true">“</span>
          <p>{{ testimonials[activeIndex()].quote }}</p>
          <p class="testimonial-byline">{{ testimonials[activeIndex()].byline }}</p>
        </div>
        @if (testimonials.length > 1) {
          <div class="testimonial-controls">
            <button type="button" aria-label="Depoimento anterior" (click)="move(-1)">←</button
            ><span>{{ activeIndex() + 1 }} / {{ testimonials.length }}</span
            ><button type="button" aria-label="Próximo depoimento" (click)="move(1)">→</button>
          </div>
        }
      }
    </div>
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsSectionComponent {
  readonly activeIndex = signal(0);
  readonly testimonials = TESTIMONIALS;
  move(direction: -1 | 1): void {
    this.activeIndex.update(
      (index) => (index + direction + this.testimonials.length) % this.testimonials.length,
    );
  }
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RevealDirective],
  template: ` <section
    class="content-section section-light faq-section"
    id="faq"
    aria-labelledby="faq-title"
  >
    <div class="section-wrap faq-layout">
      <header class="section-heading section-heading--left" appReveal>
        <p class="section-kicker">Dúvidas comuns</p>
        <h2 id="faq-title">Perguntas frequentes</h2>
        <p class="faq-help">
          Não encontrou sua dúvida?
          @if (whatsapp) {
            <a [href]="whatsapp" target="_blank" rel="noopener noreferrer"
              >Fale comigo no WhatsApp</a
            >
          } @else {
            <a href="#contato">Fale comigo</a>
          }
        </p>
      </header>
      <div class="faq-list">
        @for (item of questions; track item.question; let i = $index) {
          <div class="faq-item">
            <h3 class="faq-question">
              <button
                type="button"
                class="faq-trigger"
                [id]="'faq-trigger-' + i"
                [attr.aria-expanded]="openIndex() === i"
                [attr.aria-controls]="'faq-panel-' + i"
                (click)="toggle(i)"
              >
                {{ item.question }}
                <span aria-hidden="true">{{ openIndex() === i ? '−' : '+' }}</span>
              </button>
            </h3>
            <div
              class="faq-panel"
              role="region"
              [id]="'faq-panel-' + i"
              [attr.aria-labelledby]="'faq-trigger-' + i"
              [hidden]="openIndex() !== i"
            >
              <p>
                @for (part of item.answer; track $index) {
                  @if (isText(part)) {
                    <span>{{ part }}</span>
                  } @else {
                    <strong class="faq-highlight">{{ highlightText(part) }}</strong>
                  }
                }
              </p>
            </div>
          </div>
        }
      </div>
    </div>
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqSectionComponent {
  readonly openIndex = signal(-1);
  /** Só as perguntas com resposta preenchida (as marcadas como null em faq.data.ts ficam ocultas). */
  readonly questions = VISIBLE_FAQ;
  protected readonly whatsapp = whatsappLink(
    `Olá! Vim pelo site da ${SITE_CONFIG.companyName} e tenho uma dúvida.`,
  );
  protected isText(part: FaqSegment): part is string {
    return typeof part === 'string';
  }
  protected highlightText(part: Exclude<FaqSegment, string>): string {
    return 'price' in part ? formatPrice(part.price) : part.highlight;
  }
  toggle(index: number): void {
    this.openIndex.update((current) => (current === index ? -1 : index));
  }
}

@Component({
  selector: 'app-final-cta',
  standalone: true,
  imports: [MagneticDirective, RevealDirective],
  template: ` <section class="content-section final-cta" id="orcamento" aria-labelledby="cta-title">
    <div class="section-wrap final-cta__inner" appReveal>
      <p class="section-kicker">Vamos conversar</p>
      <h2 id="cta-title">Conte um pouco sobre o projeto que você tem em mente.</h2>
      <a class="button-primary" appMagnetic href="#contato"
        >Solicitar orçamento <span aria-hidden="true">↗</span></a
      >
    </div>
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalCtaSectionComponent {}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, RevealDirective],
  template: ` <section
    class="content-section section-dark"
    id="contato"
    aria-labelledby="contact-title"
  >
    <div class="section-wrap contact-layout">
      <header class="section-heading section-heading--left section-heading--light" appReveal>
        <p class="section-kicker">Contato</p>
        <h2 id="contact-title">Vamos falar do seu projeto</h2>
        <p>Conte o que você precisa. Eu respondo com os próximos passos e uma proposta.</p>
        @if (whatsapp || email) {
          <ul class="contact-channels" aria-label="Canais de contato">
            @if (whatsapp) {
              <li>
                <span class="contact-channel__label">WhatsApp</span>
                <a
                  class="contact-channel__link"
                  [href]="whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  [attr.aria-label]="'Conversar no WhatsApp: ' + whatsappNumber + ' (abre em nova aba)'"
                >
                  <svg class="whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z" />
                    <path d="M9.2 9.4c.3 2.3 2.1 4.2 4.5 4.7l1-1 1.6.8" />
                  </svg>
                  {{ whatsappNumber }}
                </a>
              </li>
            }
            @if (email) {
              <li>
                <span class="contact-channel__label">E-mail</span>
                <a class="contact-channel__link" [href]="'mailto:' + email">{{ email }}</a>
              </li>
            }
          </ul>
        }
      </header>
      <form class="contact-form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="form-field">
          <label for="contact-name">Nome</label>
          <input
            id="contact-name"
            formControlName="name"
            placeholder="Seu nome completo"
            autocomplete="name"
            required
            [attr.aria-invalid]="showError('name')"
            [attr.aria-describedby]="showError('name') ? 'contact-name-error' : null"
          />
          @if (showError('name')) {
            <small id="contact-name-error">Informe seu nome.</small>
          }
        </div>
        <div class="form-field">
          <label for="contact-email">E-mail</label>
          <input
            id="contact-email"
            formControlName="email"
            placeholder="seuemail@exemplo.com"
            type="email"
            autocomplete="email"
            required
            [attr.aria-invalid]="showError('email')"
            [attr.aria-describedby]="showError('email') ? 'contact-email-error' : null"
          />
          @if (showError('email')) {
            <small id="contact-email-error">
              {{
                form.controls.email.hasError('required')
                  ? 'Informe seu e-mail.'
                  : 'Confira o e-mail. Exemplo: nome@email.com'
              }}
            </small>
          }
        </div>
        <div class="form-field">
          <label for="contact-phone">WhatsApp <span class="form-optional">(opcional)</span></label>
          <input
            id="contact-phone"
            formControlName="phone"
            type="tel"
            inputmode="numeric"
            autocomplete="tel-national"
            placeholder="(00) 00000-0000"
            maxlength="15"
            (input)="maskPhone()"
            [attr.aria-invalid]="showError('phone')"
            [attr.aria-describedby]="showError('phone') ? 'contact-phone-error' : null"
          />
          @if (showError('phone')) {
            <small id="contact-phone-error">Informe DDD e número. Exemplo: (11) 98765-4321</small>
          }
        </div>
        <div class="form-field">
          <label for="contact-type">Tipo de projeto</label>
          <select
            id="contact-type"
            formControlName="projectType"
            required
            [class.is-placeholder]="!form.controls.projectType.value"
            [attr.aria-invalid]="showError('projectType')"
            [attr.aria-describedby]="showError('projectType') ? 'contact-type-error' : null"
          >
            <option value="" disabled>Selecione o tipo de projeto</option>
            @for (type of projectTypes; track type) {
              <option [value]="type">{{ type }}</option>
            }
          </select>
          @if (showError('projectType')) {
            <small id="contact-type-error">Selecione o tipo de projeto.</small>
          }
        </div>
        <div class="form-field form-field--full">
          <label for="contact-message">Mensagem</label>
          <textarea
            id="contact-message"
            formControlName="message"
            placeholder="Conte um pouco sobre o seu negócio e o que você precisa…"
            rows="4"
            required
            [attr.aria-invalid]="showError('message')"
            [attr.aria-describedby]="showError('message') ? 'contact-message-error' : null"
          ></textarea>
          @if (showError('message')) {
            <small id="contact-message-error">
              Conte em pelo menos {{ minMessageLength }} caracteres o que você precisa.
            </small>
          }
        </div>

        @if (status() === 'success') {
          <div class="form-success" role="status">
            <p>
              {{
                sentUrl()
                  ? 'Abrimos o WhatsApp com sua mensagem. É só tocar em enviar por lá!'
                  : 'Mensagem enviada! Vou responder o quanto antes.'
              }}
            </p>
            @if (sentUrl(); as url) {
              <a class="form-success__retry" [href]="url" target="_blank" rel="noopener noreferrer"
                >Não abriu? Clique aqui</a
              >
            }
            <button type="button" class="form-reset" (click)="resetForm()">
              Enviar outra mensagem
            </button>
          </div>
        } @else {
          <button class="button-primary" type="submit" [disabled]="status() === 'sending'">
            @if (status() === 'sending') {
              Enviando…
            } @else if (channel === 'whatsapp') {
              <svg class="whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z" />
                <path d="M9.2 9.4c.3 2.3 2.1 4.2 4.5 4.7l1-1 1.6.8" />
              </svg>
              Enviar pelo WhatsApp
            } @else {
              Enviar mensagem
            }
          </button>
          <p
            class="form-status"
            [class.form-status--error]="status() === 'error'"
            aria-live="polite"
          >
            @switch (status()) {
              @case ('invalid') {
                Revise os campos destacados.
              }
              @case ('error') {
                Não foi possível enviar agora. Tente novamente em instantes.
              }
            }
          </p>
        }
        <p class="form-note">
          Ao clicar em enviar, você será direcionado ao WhatsApp com sua mensagem pronta. Seus dados
          são usados só para responder o seu contato.
        </p>
      </form>
    </div>
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSectionComponent {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly contact = inject(ContactService);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly channel = this.contact.channel;
  protected readonly whatsapp = whatsappLink();
  protected readonly whatsappNumber = formatWhatsappNumber();
  protected readonly email = SITE_CONFIG.email;
  protected readonly minMessageLength = 10;
  protected readonly projectTypes = PROJECT_TYPES;
  protected readonly status = signal<'idle' | 'invalid' | 'sending' | 'success' | 'error'>('idle');
  /** URL aberta no último envio pelo WhatsApp (para o link "Não abriu? Clique aqui"). */
  protected readonly sentUrl = signal<string | null>(null);

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)],
    projectType: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(this.minMessageLength)]],
  });

  protected showError(
    control: 'name' | 'email' | 'phone' | 'projectType' | 'message',
  ): boolean {
    const field = this.form.controls[control];
    return field.invalid && field.touched;
  }

  /** Formata como (00) 0000-0000 ou (00) 00000-0000 enquanto a pessoa digita. */
  protected maskPhone(): void {
    const control = this.form.controls.phone;
    const digits = control.value.replace(/\D/g, '').slice(0, 11);
    let masked = digits;
    if (digits.length > 2) masked = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    else if (digits.length > 0) masked = `(${digits}`;
    if (digits.length > 6) {
      const split = digits.length === 11 ? 7 : 6;
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2, split)}-${digits.slice(split)}`;
    }
    if (masked !== control.value) control.setValue(masked, { emitEvent: false });
  }

  /**
   * Sem await antes do window.open: o navegador só permite abrir uma nova aba
   * se isso acontecer no mesmo clique (senão bloqueia como pop-up).
   */
  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.status.set('invalid');
      afterNextRender(
        () =>
          this.host.nativeElement
            .querySelector<HTMLElement>('.contact-form [aria-invalid="true"]')
            ?.focus(),
        { injector: this.injector },
      );
      return;
    }

    let result: ContactResult | Promise<ContactResult>;
    try {
      result = this.contact.send(this.form.getRawValue());
    } catch {
      this.status.set('error');
      return;
    }

    if (!(result instanceof Promise)) {
      this.handleResult(result);
      return;
    }

    // Envio assíncrono (ex.: e-mail no futuro)
    this.status.set('sending');
    result.then(
      (value) => this.handleResult(value),
      () => this.status.set('error'),
    );
  }

  private handleResult(result: ContactResult): void {
    if (result.kind === 'redirect') {
      if (isPlatformBrowser(this.platformId)) window.open(result.url, '_blank', 'noopener');
      this.sentUrl.set(result.url);
    } else {
      this.sentUrl.set(null);
    }
    // O formulário não é limpo: a pessoa pode tentar de novo se precisar.
    this.status.set('success');
  }

  /** "Enviar outra mensagem": limpa o formulário e volta ao estado inicial. */
  protected resetForm(): void {
    this.form.reset();
    this.sentUrl.set(null);
    this.status.set('idle');
    afterNextRender(
      () => this.host.nativeElement.querySelector<HTMLElement>('#contact-name')?.focus(),
      { injector: this.injector },
    );
  }
}

@Component({
  selector: 'app-site-footer',
  standalone: true,
  template: ` <footer class="site-footer">
    <div class="section-wrap footer-layout">
      <a class="footer-brand" href="#home" aria-label="ER Web — voltar ao início"
        >ER <strong>WEB</strong></a
      >
      <nav aria-label="Links do rodapé">
        <a href="#servicos">Serviços</a><a href="#trabalhos">Projetos</a
        ><a href="#processo">Processo</a><a href="#sobre">Sobre</a><a href="#faq">FAQ</a
        ><a href="#contato">Contato</a>
      </nav>
      @if (socialLinks.length || email) {
        <ul class="footer-social" aria-label="Redes sociais e contato">
          @for (social of socialLinks; track social.id) {
            <li>
              <a
                [href]="social.url"
                target="_blank"
                rel="noopener noreferrer"
                [attr.aria-label]="social.label + ' da ' + companyName"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  @switch (social.id) {
                    @case ('instagram') {
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle class="footer-social__dot" cx="17.3" cy="6.7" r="1" />
                    }
                    @case ('facebook') {
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <path d="M15.5 7.5h-1.6c-1.6 0-2.4.9-2.4 2.5V21M9 13h6" />
                    }
                    @case ('linkedin') {
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <path d="M7.5 10.5v6M7.5 7.5v.01M11.5 16.5v-6M11.5 13c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5v3.5" />
                    }
                  }
                </svg>
              </a>
            </li>
          }
          @if (email) {
            <li>
              <a [href]="'mailto:' + email" [attr.aria-label]="'Enviar e-mail para ' + email">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2.5" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </a>
            </li>
          }
        </ul>
      }
      <p>© {{ currentYear }} {{ companyName }}. Todos os direitos reservados.</p>
      <a class="back-to-top" href="#home">Voltar ao topo ↑</a>
    </div>
  </footer>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterSectionComponent {
  readonly currentYear = new Date().getFullYear();
  readonly companyName = SITE_CONFIG.companyName;
  readonly email = SITE_CONFIG.email;
  /** Só entram as redes com link configurado. */
  readonly socialLinks = (
    [
      { id: 'instagram', label: 'Instagram', url: SITE_CONFIG.social.instagram },
      { id: 'facebook', label: 'Facebook', url: SITE_CONFIG.social.facebook },
      { id: 'linkedin', label: 'LinkedIn', url: SITE_CONFIG.social.linkedin },
    ] as const
  ).filter((social) => social.url);
}

export const LANDING_SECTION_COMPONENTS = [
  ServicesSectionComponent,
  AudienceSectionComponent,
  ProcessSectionComponent,
  IncludedSectionComponent,
  AboutSectionComponent,
  TestimonialsSectionComponent,
  FaqSectionComponent,
  FinalCtaSectionComponent,
  ContactSectionComponent,
  FooterSectionComponent,
] as const;
