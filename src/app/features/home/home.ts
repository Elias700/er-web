import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  afterNextRender,
  inject,
} from '@angular/core';
import { WorkComponent } from '../work/work';
import {
  SplitTextDirective,
  StaggerDirective,
} from '../../shared/directives/reveal.directive';
import { HeroVisualDirective } from './hero-visual.directive';
import { WhyLandingComponent } from '../why-landing/why-landing';
import { SITE_CONFIG } from '../../core/config/site.config';
import { TESTIMONIALS } from '../sections/testimonials.data';
import {
  AboutSectionComponent,
  AudienceSectionComponent,
  ContactSectionComponent,
  FaqSectionComponent,
  FinalCtaSectionComponent,
  FooterSectionComponent,
  IncludedSectionComponent,
  ProcessSectionComponent,
  ServicesSectionComponent,
  TestimonialsSectionComponent,
} from '../sections/sections';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    WorkComponent,
    NgOptimizedImage,
    SplitTextDirective,
    StaggerDirective,
    HeroVisualDirective,
    WhyLandingComponent,
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
  ],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly showTestimonials = SITE_CONFIG.showTestimonials && TESTIMONIALS.length > 0;

  /**
   * Se a página abrir com uma âncora (ex.: /#contato), renderiza todas as seções
   * adiadas de imediato e rola até o destino quando ele existir de verdade.
   * Sem isso, o navegador pararia no placeholder e as seções acima o empurrariam.
   */
  protected readonly renderAll =
    isPlatformBrowser(inject(PLATFORM_ID)) && window.location.hash.length > 1;

  constructor() {
    if (!this.renderAll) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    afterNextRender(() => {
      // Espera não haver placeholders e a altura da página ficar estável por ~10 quadros
      // (blocos adiados carregam chunks em momentos diferentes), depois rola até o destino.
      const started = performance.now();
      let lastHeight = -1;
      let stableFrames = 0;
      const tryScroll = (): void => {
        const target = document.getElementById(id);
        const height = document.documentElement.scrollHeight;
        stableFrames = height === lastHeight ? stableFrames + 1 : 0;
        lastHeight = height;
        const settled =
          target &&
          !target.classList.contains('defer-slot') &&
          !document.querySelector('.defer-slot') &&
          stableFrames >= 10;
        if (settled || performance.now() - started > 5000) {
          target?.scrollIntoView({ block: 'start' });
        } else {
          requestAnimationFrame(tryScroll);
        }
      };
      requestAnimationFrame(tryScroll);
    });
  }
}
