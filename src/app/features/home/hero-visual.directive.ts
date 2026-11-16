import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  DestroyRef,
  ElementRef,
  Injector,
  PLATFORM_ID,
  afterNextRender,
  inject,
} from '@angular/core';
import { AnimationService } from '../../core/animations/animation.service';

@Directive({ selector: '[appHeroVisual]', standalone: true })
export class HeroVisualDirective {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly animations = inject(AnimationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private cleanup?: () => void;

  constructor() {
    afterNextRender(
      () => {
        if (!isPlatformBrowser(this.platformId)) return;

        const host: HTMLElement = this.element.nativeElement;
        const image = host.querySelector<HTMLImageElement>('.hero__image');
        const sheen = host.querySelector<HTMLElement>('.hero__image-sheen');
        const glow = host.querySelector<HTMLElement>('.hero__glow-orbit');
        if (!image || !sheen || !glow) return;

        void this.animations.ready.then(() => {
          if (this.destroyRef.destroyed) return;
          this.cleanup = this.animations.animateHeroVisual(host, image, sheen, glow);
        });
      },
      { injector: this.injector },
    );

    this.destroyRef.onDestroy(() => this.cleanup?.());
  }
}
