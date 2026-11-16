import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MagneticDirective,
  ParallaxDirective,
  RevealDirective,
  ScrollProgressDirective,
  StaggerDirective,
} from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RevealDirective, StaggerDirective],
  template: ` <section
    class="content-section section-light"
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
  selector: 'app-differentials',
  standalone: true,
  imports: [RevealDirective],
  template: ` <section
    class="content-section section-light"
    id="diferenciais"
    aria-labelledby="differentials-title"
  >
    <div class="section-wrap differential-layout">
      <header class="section-heading section-heading--left" appReveal>
        <p class="section-kicker">Feito para o seu contexto</p>
        <h2 id="differentials-title">Uma base bem cuidada para sua presença digital</h2>
        <p>Decisões de projeto voltadas à clareza, à experiência em celular e à manutenção.</p>
      </header>
      <ul class="benefit-list">
        @for (benefit of benefits; track benefit.title) {
          <li appReveal>
            <span aria-hidden="true">✓</span>
            <div>
              <h3>{{ benefit.title }}</h3>
              <p>{{ benefit.description }}</p>
            </div>
          </li>
        }
      </ul>
    </div>
    <div class="section-wrap metrics-placeholder" aria-label="Indicadores a preencher">
      <p><strong>A definir</strong><span>Projetos entregues</span></p>
      <p><strong>A definir</strong><span>Anos de experiência</span></p>
      <p><strong>A definir</strong><span>Clientes atendidos</span></p>
    </div>
    <!-- TODO: substituir os indicadores apenas por dados confirmados -->
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DifferentialsSectionComponent {
  readonly benefits = [
    { title: 'Responsivo', description: 'Layout pensado para telas pequenas, médias e grandes.' },
    { title: 'Performance', description: 'Atenção ao peso e ao carregamento das páginas.' },
    { title: 'SEO técnico', description: 'Estrutura semântica e metadados organizados.' },
    { title: 'Prazo alinhado', description: 'Etapas e calendário combinados conforme o escopo.' },
  ] as const;
}

@Component({
  selector: 'app-technologies',
  standalone: true,
  imports: [RevealDirective],
  template: ` <section
    class="content-section tech-section"
    id="tecnologias"
    aria-labelledby="tech-title"
  >
    <div class="section-wrap">
      <header class="section-heading" appReveal>
        <p class="section-kicker">Ferramentas</p>
        <h2 id="tech-title">Tecnologias e recursos</h2>
        <p>Uma seleção definida conforme cada projeto.</p>
      </header>
      <div class="tech-marquee" aria-label="Tecnologias usadas">
        <ul>
          @for (tech of technologies; track tech) {
            <li>{{ tech }}</li>
          }
        </ul>
        <ul aria-hidden="true">
          @for (tech of technologies; track tech) {
            <li>{{ tech }}</li>
          }
        </ul>
      </div>
    </div>
    <!-- TODO: confirmar a lista de tecnologias da ER WEB -->
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnologiesSectionComponent {
  readonly technologies = ['Angular', 'TypeScript', 'Node.js', 'Figma', 'HTML', 'CSS'];
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ParallaxDirective, RevealDirective],
  template: ` <section
    class="content-section section-dark"
    id="sobre"
    aria-labelledby="about-title"
  >
    <div class="section-wrap about-layout">
      <div
        class="about-photo"
        [appParallax]="18"
        role="img"
        aria-label="Espaço reservado para foto de quem está por trás da ER WEB"
      >
        <span>Foto</span><small>A definir</small>
      </div>
      <div class="about-copy" appReveal>
        <p class="section-kicker">Sobre</p>
        <h2 id="about-title">Tecnologia próxima da realidade do seu negócio</h2>
        <p>
          A ER WEB desenvolve experiências para empresas e profissionais que querem apresentar seu
          trabalho com clareza na internet.
        </p>
        <p>
          O projeto é construído em conjunto, com escopo e conteúdo alinhados ao que você precisa
          comunicar.
        </p>
        <!-- TODO: substituir por apresentação pessoal real -->
      </div>
    </div>
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutSectionComponent {}

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
      <div class="testimonial-placeholder" aria-live="polite" aria-atomic="true">
        <span aria-hidden="true">“</span>
        <p>{{ testimonials()[activeIndex()].quote }}</p>
        <p class="testimonial-byline">{{ testimonials()[activeIndex()].byline }}</p>
      </div>
      <div class="testimonial-controls">
        <button type="button" aria-label="Depoimento anterior" (click)="move(-1)">←</button
        ><span>{{ activeIndex() + 1 }} / {{ testimonials().length }}</span
        ><button type="button" aria-label="Próximo depoimento" (click)="move(1)">→</button>
      </div>
    </div>
    <!-- TODO: inserir depoimentos reais somente com autorização -->
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsSectionComponent {
  readonly activeIndex = signal(0);
  readonly testimonials = signal([
    {
      quote: '[Depoimento de cliente a inserir após autorização.]',
      byline: '[Nome e projeto — confirmar autorização]',
    },
    {
      quote: '[Segundo depoimento real a inserir após autorização.]',
      byline: '[Nome e projeto — confirmar autorização]',
    },
  ] as const);
  move(direction: -1 | 1): void {
    this.activeIndex.update(
      (index) => (index + direction + this.testimonials().length) % this.testimonials().length,
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
      <div class="footer-social" aria-label="Redes sociais a configurar">
        <span>Redes sociais: a configurar</span><!-- TODO: adicionar perfis sociais reais -->
      </div>
      <p>© {{ currentYear }} ER WEB. Todos os direitos reservados.</p>
      <a class="back-to-top" href="#home">Voltar ao topo ↑</a>
    </div>
  </footer>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterSectionComponent {
  readonly currentYear = new Date().getFullYear();
}

export const LANDING_SECTION_COMPONENTS = [
  ServicesSectionComponent,
  ProcessSectionComponent,
  DifferentialsSectionComponent,
  TechnologiesSectionComponent,
  AboutSectionComponent,
  TestimonialsSectionComponent,
  FaqSectionComponent,
  FinalCtaSectionComponent,
  ContactSectionComponent,
  FooterSectionComponent,
] as const;
