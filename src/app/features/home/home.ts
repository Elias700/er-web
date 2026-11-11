import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WorkComponent } from '../work/work';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [WorkComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}
