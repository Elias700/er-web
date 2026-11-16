import {
  Directive,
  DestroyRef,
  ElementRef,
  Injector,
  Input,
  NgZone,
  afterNextRender,
  booleanAttribute,
  inject,
  OnDestroy,
  numberAttribute,
} from '@angular/core';
import { AnimationService, type RevealDirection } from '../../core/animations/animation.service';

/**
 * Base das diretivas de scroll: depois do primeiro render, agenda a criação da
 * animação na fila do AnimationService (que cede a thread entre lotes) e
 * desfaz tudo ao destruir.
 */
@Directive()
abstract class ScheduledAnimationDirective implements OnDestroy {
  protected readonly element: ElementRef<HTMLElement> = inject(ElementRef);
  protected readonly animations = inject(AnimationService);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private cleanup?: () => void;

  constructor() {
    afterNextRender(
      () => {
        if (this.destroyRef.destroyed) return;
        this.cleanup = this.animations.schedule(() => this.setup(), this.needsLibraries);
      },
      { injector: this.injector },
    );
  }

  /** false para animações só de CSS (não esperam o GSAP carregar). */
  protected readonly needsLibraries: boolean = true;

  /** Cria a animação e retorna a função que a desfaz. */
  protected abstract setup(): () => void;

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective extends ScheduledAnimationDirective {
  protected override readonly needsLibraries = false;
  @Input({ transform: booleanAttribute }) appReveal = false;
  @Input() revealDelay = 0;
  @Input() revealDuration = 0.65;
  @Input() revealDistance = 22;
  @Input() revealDirection: RevealDirection = 'up';

  protected setup(): () => void {
    if (!this.appReveal) return () => undefined;
    return this.animations.reveal(this.element.nativeElement, {
      delay: this.revealDelay,
      duration: this.revealDuration,
      distance: this.revealDistance,
      direction: this.revealDirection,
    });
  }
}

@Directive({ selector: '[appStagger]', standalone: true })
export class StaggerDirective extends ScheduledAnimationDirective {
  protected override readonly needsLibraries = false;
  @Input() appStagger = '[data-stagger-item]';

  protected setup(): () => void {
    return this.animations.stagger(
      this.element.nativeElement,
      this.appStagger || '[data-stagger-item]',
    );
  }
}

@Directive({ selector: '[appParallax]', standalone: true })
export class ParallaxDirective extends ScheduledAnimationDirective {
  @Input({ transform: numberAttribute }) appParallax = 24;

  protected setup(): () => void {
    return this.animations.parallax(this.element.nativeElement, this.appParallax);
  }
}

@Directive({ selector: '[appSplitText]', standalone: true })
export class SplitTextDirective extends ScheduledAnimationDirective {
  protected override readonly needsLibraries = false;
  @Input() appSplitText = '[data-split-word]';

  protected setup(): () => void {
    return this.animations.splitText(
      this.element.nativeElement,
      this.appSplitText || '[data-split-word]',
    );
  }
}

@Directive({ selector: '[appCounter]', standalone: true })
export class CounterDirective extends ScheduledAnimationDirective {
  @Input() appCounter = 0;
  @Input() counterDuration = 1.2;

  protected setup(): () => void {
    return this.animations.counter(this.element.nativeElement, this.appCounter, this.counterDuration);
  }
}

@Directive({ selector: '[appScrollProgress]', standalone: true })
export class ScrollProgressDirective extends ScheduledAnimationDirective {
  protected setup(): () => void {
    return this.animations.progress(this.element.nativeElement);
  }
}

/** Escreve o progresso do scroll em `--scroll-progress` (0 → 1) no elemento. */
@Directive({ selector: '[appScrollVariable]', standalone: true })
export class ScrollVariableDirective extends ScheduledAnimationDirective {
  @Input() scrollStart = 'top 75%';
  @Input() scrollEnd = 'bottom 55%';

  protected setup(): () => void {
    return this.animations.scrollVariable(
      this.element.nativeElement,
      this.scrollStart,
      this.scrollEnd,
    );
  }
}

@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective {
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  constructor() {
    afterNextRender(
      () => {
        const element = this.element.nativeElement;
        const move = (event: PointerEvent): void => {
          if (
            event.pointerType !== 'mouse' ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
          )
            return;
          const bounds = element.getBoundingClientRect();
          const x = (event.clientX - bounds.left - bounds.width / 2) * 0.08;
          const y = (event.clientY - bounds.top - bounds.height / 2) * 0.08;
          element.style.translate = `${x}px ${y}px`;
        };
        const reset = (): void => {
          element.style.translate = '';
        };
        this.zone.runOutsideAngular(() => {
          element.addEventListener('pointermove', move);
          element.addEventListener('pointerleave', reset);
        });
        this.destroyRef.onDestroy(() => {
          element.removeEventListener('pointermove', move);
          element.removeEventListener('pointerleave', reset);
          reset();
        });
      },
      { injector: this.injector },
    );
  }
}
