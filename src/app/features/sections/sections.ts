import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
import { SITE_CONFIG } from '../../core/config/site.config';

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
      <div class="about-photo" [class.about-photo--empty]="!photo" [appParallax]="18">
        @if (photo) {
          <img
            [src]="photo"
            [alt]="photoAlt"
            width="800"
            height="1000"
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
        <p>As respostas finais dependem do escopo combinado para cada projeto.</p>
      </header>
      <div class="faq-list">
        @for (item of questions; track item.question; let i = $index) {
          <details class="faq-item" [open]="openIndex() === i" (toggle)="onToggle(i, $event)">
            <summary>
              {{ item.question }}<span aria-hidden="true">{{ openIndex() === i ? '−' : '+' }}</span>
            </summary>
            <p>{{ item.answer }}</p>
          </details>
        }
      </div>
    </div>
    <!-- TODO: revisar respostas comerciais e operacionais -->
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqSectionComponent {
  readonly openIndex = signal(-1);
  readonly questions = [
    {
      question: 'Qual é o prazo para criar um site?',
      answer: 'O prazo é definido conforme o escopo, o conteúdo disponível e as etapas combinadas.',
    },
    {
      question: 'Quanto custa um projeto?',
      answer:
        'O orçamento depende do tipo de projeto e dos recursos necessários. Envie os detalhes para solicitar uma avaliação.',
    },
    {
      question: 'A hospedagem está incluída?',
      answer: 'Hospedagem e domínio são alinhados durante a definição do projeto.',
    },
    {
      question: 'É possível fazer manutenção depois?',
      answer: 'A possibilidade e o formato de suporte podem ser combinados conforme a necessidade.',
    },
    {
      question: 'Posso pedir alterações?',
      answer: 'As revisões e ajustes previstos são definidos no escopo antes do início.',
    },
  ] as const;
  onToggle(index: number, event: Event): void {
    if ((event.currentTarget as HTMLDetailsElement).open) this.openIndex.set(index);
    else if (this.openIndex() === index) this.openIndex.set(-1);
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
        <p>As informações serão usadas para entender o pedido e responder ao contato.</p>
        <p class="contact-channel">WhatsApp da empresa: <strong>A configurar</strong></p>
        <button class="button-primary whatsapp-placeholder" type="button" disabled>
          WhatsApp a configurar</button
        ><!-- TODO: configurar número de WhatsApp -->
      </header>
      <form class="contact-form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <label>Nome<input formControlName="name" autocomplete="name" required /></label>
        @if (form.controls.name.touched && form.controls.name.invalid) {
          <small>Informe seu nome.</small>
        }
        <label
          >E-mail<input formControlName="email" type="email" autocomplete="email" required
        /></label>
        @if (form.controls.email.touched && form.controls.email.invalid) {
          <small>Informe um e-mail válido.</small>
        }
        <label>WhatsApp<input formControlName="phone" type="tel" autocomplete="tel" /></label>
        <label
          >Tipo de projeto<select formControlName="projectType">
            <option value="">Selecione</option>
            <option>Site institucional</option>
            <option>Landing page</option>
            <option>E-commerce</option>
            <option>Sistema web</option>
            <option>Manutenção</option>
            <option>Outro</option>
          </select></label
        >
        <label class="form-message"
          >Mensagem<textarea formControlName="message" rows="4" required></textarea>
        </label>
        @if (form.controls.message.touched && form.controls.message.invalid) {
          <small>Conte brevemente sobre o que precisa.</small>
        }
        <button class="button-primary" type="submit">
          {{ formStatus() ? 'Validar novamente' : 'Enviar mensagem' }}
        </button>
        @if (formStatus()) {
          <p class="form-status" aria-live="polite">{{ formStatus() }}</p>
        }
        <p class="form-note">
          O envio ainda não está conectado. Nenhum dado será enviado por este formulário.
        </p>
      </form>
    </div>
    <!-- TODO: conectar serviço de envio e configurar o canal de WhatsApp -->
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSectionComponent {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  readonly form = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    projectType: [''],
    message: ['', Validators.required],
  });
  readonly formStatus = signal('');
  submit(): void {
    this.form.markAllAsTouched();
    this.formStatus.set(
      this.form.invalid
        ? 'Revise os campos destacados.'
        : 'Dados validados. O envio será habilitado quando o serviço de contato estiver configurado.',
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
                [attr.aria-label]="social.label + ' (abre em nova aba)'"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  @if (social.id === 'instagram') {
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle class="footer-social__dot" cx="17.3" cy="6.7" r="1" />
                  } @else {
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M7.5 10.5v6M7.5 7.5v.01M11.5 16.5v-6M11.5 13c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5v3.5" />
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
