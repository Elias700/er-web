import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WorkComponent } from '../work/work';
import {
  ParallaxDirective,
  SplitTextDirective,
  StaggerDirective,
} from '../../shared/directives/reveal.directive';
import {
  AboutSectionComponent,
  ContactSectionComponent,
  DifferentialsSectionComponent,
  FaqSectionComponent,
  FinalCtaSectionComponent,
  FooterSectionComponent,
  ProcessSectionComponent,
  ServicesSectionComponent,
  TechnologiesSectionComponent,
  TestimonialsSectionComponent,
} from '../sections/sections';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    WorkComponent,
    SplitTextDirective,
    StaggerDirective,
    ParallaxDirective,
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
  ],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
