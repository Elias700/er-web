import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  DestroyRef,
  ElementRef,
  Injector,
  Input,
  NgZone,
  PLATFORM_ID,
  afterNextRender,
  booleanAttribute,
  inject,
  OnDestroy,
  numberAttribute,
} from '@angular/core';
import { AnimationService, type RevealDirection } from '../../core/animations/animation.service';

@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements OnDestroy {
  @Input({ transform: booleanAttribute }) appReveal = false;
  @Input() revealDelay = 0;
  @Input() revealDuration = 0.65;
  @Input() revealDistance = 22;
  @Input() revealDirection: RevealDirection = 'up';

  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly animations = inject(AnimationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private cleanup?: () => void;

  constructor() {
    afterNextRender(
      () => {
        void this.animations.ready.then(() => {
          if (this.destroyRef.destroyed) return;
          if (isPlatformBrowser(this.platformId) && this.appReveal) {
            this.cleanup = this.animations.reveal(this.element.nativeElement, {
              delay: this.revealDelay,
              duration: this.revealDuration,
              distance: this.revealDistance,
              direction: this.revealDirection,
            });
          }
        });
      },
      { injector: this.injector },
    );
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

@Directive({ selector: '[appStagger]', standalone: true })
export class StaggerDirective implements OnDestroy {
  @Input() appStagger = '[data-stagger-item]';
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly animations = inject(AnimationService);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private cleanup?: () => void;

  constructor() {
    afterNextRender(
      () => {
        void this.animations.ready.then(() => {
          if (!this.destroyRef.destroyed)
            this.cleanup = this.animations.stagger(
              this.element.nativeElement,
              this.appStagger || '[data-stagger-item]',
            );
        });
      },
      { injector: this.injector },
    );
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

@Directive({ selector: '[appParallax]', standalone: true })
export class ParallaxDirective implements OnDestroy {
  @Input({ transform: numberAttribute }) appParallax = 24;
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly animations = inject(AnimationService);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private cleanup?: () => void;

  constructor() {
    afterNextRender(
      () => {
        void this.animations.ready.then(() => {
          if (!this.destroyRef.destroyed)
            this.cleanup = this.animations.parallax(this.element.nativeElement, this.appParallax);
        });
      },
      { injector: this.injector },
    );
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

@Directive({ selector: '[appSplitText]', standalone: true })
export class SplitTextDirective implements OnDestroy {
  @Input() appSplitText = '[data-split-word]';
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly animations = inject(AnimationService);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private cleanup?: () => void;
  constructor() {
    afterNextRender(
      () => {
        void this.animations.ready.then(() => {
          if (!this.destroyRef.destroyed)
            this.cleanup = this.animations.splitText(
              this.element.nativeElement,
              this.appSplitText || '[data-split-word]',
            );
        });
      },
      { injector: this.injector },
    );
  }
  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

@Directive({ selector: '[appCounter]', standalone: true })
export class CounterDirective implements OnDestroy {
  @Input() appCounter = 0;
  @Input() counterDuration = 1.2;
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly animations = inject(AnimationService);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private cleanup?: () => void;
  constructor() {
    afterNextRender(
      () => {
        void this.animations.ready.then(() => {
          if (!this.destroyRef.destroyed)
            this.cleanup = this.animations.counter(
              this.element.nativeElement,
              this.appCounter,
              this.counterDuration,
            );
        });
      },
      { injector: this.injector },
    );
  }
  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

@Directive({ selector: '[appScrollProgress]', standalone: true })
export class ScrollProgressDirective implements OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly animations = inject(AnimationService);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private cleanup?: () => void;
  constructor() {
    afterNextRender(
      () => {
        void this.animations.ready.then(() => {
          if (!this.destroyRef.destroyed)
            this.cleanup = this.animations.progress(this.element.nativeElement);
        });
      },
      { injector: this.injector },
    );
  }
  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

/** Escreve o progresso do scroll em `--scroll-progress` (0 → 1) no elemento. */
@Directive({ selector: '[appScrollVariable]', standalone: true })
export class ScrollVariableDirective implements OnDestroy {
  @Input() scrollStart = 'top 75%';
  @Input() scrollEnd = 'bottom 55%';
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly animations = inject(AnimationService);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private cleanup?: () => void;
  constructor() {
    afterNextRender(
      () => {
        void this.animations.ready.then(() => {
          if (!this.destroyRef.destroyed)
            this.cleanup = this.animations.scrollVariable(
              this.element.nativeElement,
              this.scrollStart,
              this.scrollEnd,
            );
        });
      },
      { injector: this.injector },
    );
  }
  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective {
  private readonly element = inject(ElementRef<HTMLElement>);
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
