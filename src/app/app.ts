import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header';
import { WhatsappFloatComponent } from './shared/components/whatsapp-float/whatsapp-float';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, WhatsappFloatComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {}
