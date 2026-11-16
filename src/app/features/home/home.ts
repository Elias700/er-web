import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WorkComponent } from '../work/work';
import {
  SplitTextDirective,
  StaggerDirective,
} from '../../shared/directives/reveal.directive';
import { HeroVisualDirective } from './hero-visual.directive';
import {
  AboutSectionComponent,
  ContactSectionComponent,
  FaqSectionComponent,
  FinalCtaSectionComponent,
  FooterSectionComponent,
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
    ServicesSectionComponent,
    ProcessSectionComponent,
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
export class HomeComponent {}
