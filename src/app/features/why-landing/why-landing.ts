import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CounterDirective,
  MagneticDirective,
  RevealDirective,
  ScrollVariableDirective,
  StaggerDirective,
} from '../../shared/directives/reveal.directive';
import { WHY_LANDING } from './why-landing.data';

@Component({
  selector: 'app-why-landing',
  standalone: true,
  imports: [
    CounterDirective,
    MagneticDirective,
    RevealDirective,
    ScrollVariableDirective,
    StaggerDirective,
  ],
  templateUrl: './why-landing.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhyLandingComponent {
  protected readonly content = WHY_LANDING;
}
