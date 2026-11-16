import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
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
}
