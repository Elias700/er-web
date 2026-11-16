import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { whatsappLink } from '../../../core/config/site.config';

/**
 * Botão fixo de WhatsApp. Só existe se o número estiver configurado
 * e só aparece depois que o Hero sai da tela.
 */
@Component({
  selector: 'app-whatsapp-float',
  standalone: true,
  template: `
    @if (link) {
      <a
        class="whatsapp-float"
        [class.whatsapp-float--visible]="visible()"
        [href]="link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp (abre em nova aba)"
        [attr.tabindex]="visible() ? null : -1"
        [attr.aria-hidden]="visible() ? null : 'true'"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z" />
          <path d="M9.2 9.4c.3 2.3 2.1 4.2 4.5 4.7l1-1 1.6.8" />
        </svg>
      </a>
    }
  `,
  styles: `
    .whatsapp-float {
      position: fixed;
      right: max(1rem, env(safe-area-inset-right));
      bottom: max(1rem, env(safe-area-inset-bottom));
      z-index: 40;
      display: grid;
      width: 3.5rem;
      height: 3.5rem;
      place-items: center;
      border-radius: 999px;
      background: var(--color-brand-primary);
      box-shadow: 0 14px 30px -10px rgb(5 46 35 / 55%);
      color: #052e23;
      opacity: 0;
      pointer-events: none;
      translate: 0 1rem;
      transition:
        opacity 0.3s ease,
        translate 0.3s ease,
        background-color 0.2s ease;
    }
    .whatsapp-float--visible {
      opacity: 1;
      pointer-events: auto;
      translate: 0 0;
    }
    .whatsapp-float:hover {
      background: var(--color-brand-hover);
    }
    .whatsapp-float:focus-visible {
      outline: 3px solid #34d399;
      outline-offset: 4px;
    }
    svg {
      width: 1.6rem;
      height: 1.6rem;
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 1.9;
    }
    @media (prefers-reduced-motion: reduce) {
      .whatsapp-float {
        transition: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsappFloatComponent {
  protected readonly link = whatsappLink();
  protected readonly visible = signal(false);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (!this.link) return;
    afterNextRender(
      () => {
        const hero = document.getElementById('home');
        if (!hero) {
          this.visible.set(true);
          return;
        }
        const observer = new IntersectionObserver(([entry]) =>
          this.visible.set(!entry.isIntersecting),
        );
        observer.observe(hero);
        this.destroyRef.onDestroy(() => observer.disconnect());
      },
      { injector: this.injector },
    );
  }
}
