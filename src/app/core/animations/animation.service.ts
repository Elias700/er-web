import { isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  DestroyRef,
  Injector,
  NgZone,
  PLATFORM_ID,
  afterNextRender,
  inject,
} from '@angular/core';
import type { gsap as GsapInstance } from 'gsap';
import type Lenis from 'lenis';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

export type RevealDirection = 'up' | 'down' | 'left' | 'right';

export interface RevealOptions {
  readonly delay?: number;
  readonly duration?: number;
  readonly distance?: number;
  readonly direction?: RevealDirection;
}

@Injectable({ providedIn: 'root' })
export class AnimationService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly injector = inject(Injector);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private gsap?: typeof GsapInstance;
  private scrollTrigger?: typeof ScrollTriggerType;
  private lenis?: Lenis;
  private reducedMotion = true;
  private initialized = false;
  private resolveReady?: () => void;
  readonly ready = new Promise<void>((resolve) => {
    this.resolveReady = resolve;
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => void this.initialize(), { injector: this.injector });
    }
    this.destroyRef.onDestroy(() => this.destroy());
  }

  private async initialize(): Promise<void> {
    if (this.initialized || !isPlatformBrowser(this.platformId)) {
      return;
    }

    this.initialized = true;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reducedMotion) {
      this.resolveReady?.();
      return;
    }

    try {
      const [gsapModule, scrollModule, lenisModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('lenis'),
      ]);

      this.zone.runOutsideAngular(() => {
        this.gsap = gsapModule.gsap;
        this.scrollTrigger = scrollModule.ScrollTrigger;
        this.gsap.registerPlugin(this.scrollTrigger);
        this.lenis = new lenisModule.default({ autoRaf: false, anchors: false });
        this.lenis.on('scroll', () => this.scrollTrigger?.update());
        const tickerCallback = (time: number): void => this.lenis?.raf(time * 1000);
        this.gsap.ticker.add(tickerCallback);
        this.gsap.ticker.lagSmoothing(0);
        this.removeTicker = () => this.gsap?.ticker.remove(tickerCallback);
      });
    } catch {
      // O conteúdo continua visível se as bibliotecas não puderem carregar.
    } finally {
      this.resolveReady?.();
    }
  }

  private removeTicker?: () => void;
  private readonly setupQueue: (() => void)[] = [];
  private flushing = false;

  /**
   * Agenda a criação de uma animação.
   * - `needsLibraries = false` (reveal/stagger/splitText, só CSS): roda na hora.
   * - `needsLibraries = true` (GSAP/ScrollTrigger): espera as bibliotecas e roda em
   *   lotes de ~8 ms, cedendo a thread entre eles, para não gerar tarefas longas (TBT).
   * Retorna a função de limpeza, que também cancela a tarefa se ela ainda não rodou.
   */
  schedule(task: () => () => void, needsLibraries = true): () => void {
    if (!needsLibraries) return task();
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    void this.ready.then(() => {
      this.setupQueue.push(() => {
        if (!cancelled) cleanup = task();
      });
      this.flushQueue();
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }

  // ----- Revelação ao rolar: só CSS + um IntersectionObserver, sem leituras de layout -----

  private revealObserver?: IntersectionObserver;
  private readonly revealCallbacks = new WeakMap<Element, () => void>();

  private get prefersReducedMotion(): boolean {
    return (
      !isPlatformBrowser(this.platformId) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  /** Observa o elemento e chama `onEnter` uma vez quando ele entra (equivale a "top 88%"). */
  private observeOnce(element: Element, onEnter: () => void): () => void {
    this.revealObserver ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          this.revealObserver?.unobserve(entry.target);
          this.revealCallbacks.get(entry.target)?.();
          this.revealCallbacks.delete(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    this.revealCallbacks.set(element, onEnter);
    this.revealObserver.observe(element);
    return () => {
      this.revealObserver?.unobserve(element);
      this.revealCallbacks.delete(element);
    };
  }

  /**
   * Prepara elementos com o estado inicial (classe `reveal-pending` + variáveis CSS)
   * e devolve funções para revelá-los e para limpar tudo.
   * Depois da transição, as classes saem e o elemento volta aos próprios estilos.
   */
  private prepareReveal(
    items: readonly HTMLElement[],
    options: { x?: number; y?: number; duration: number; delay: number; step: number },
  ): { show: () => void; clear: () => void } {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const clear = (): void => {
      timers.forEach(clearTimeout);
      for (const item of items) {
        item.classList.remove('reveal-pending', 'reveal-in');
        for (const prop of ['--reveal-x', '--reveal-y', '--reveal-duration', '--reveal-delay'])
          item.style.removeProperty(prop);
      }
    };
    items.forEach((item, index) => {
      item.style.setProperty('--reveal-x', `${options.x ?? 0}px`);
      item.style.setProperty('--reveal-y', `${options.y ?? 0}px`);
      item.style.setProperty('--reveal-duration', `${options.duration}s`);
      item.style.setProperty('--reveal-delay', `${options.delay + index * options.step}s`);
      item.classList.add('reveal-pending');
    });
    const show = (): void => {
      items.forEach((item) => item.classList.add('reveal-in'));
      const total = options.duration + options.delay + items.length * options.step;
      timers.push(setTimeout(clear, total * 1000 + 100));
    };
    return { show, clear };
  }

  reveal(element: HTMLElement, options: RevealOptions = {}): () => void {
    if (this.prefersReducedMotion) return () => undefined;
    const distance = options.distance ?? 22;
    const offset = {
      up: { y: distance },
      down: { y: -distance },
      left: { x: distance },
      right: { x: -distance },
    }[options.direction ?? 'up'];
    const { show, clear } = this.prepareReveal([element], {
      ...offset,
      duration: options.duration ?? 0.65,
      delay: options.delay ?? 0,
      step: 0,
    });
    const stop = this.observeOnce(element, show);
    return () => {
      stop();
      clear();
    };
  }

  stagger(element: HTMLElement, selector: string, options: RevealOptions = {}): () => void {
    if (this.prefersReducedMotion) return () => undefined;
    const children = [...element.querySelectorAll<HTMLElement>(selector)];
    if (!children.length) return () => undefined;
    const { show, clear } = this.prepareReveal(children, {
      y: options.distance ?? 18,
      duration: options.duration ?? 0.55,
      delay: options.delay ?? 0,
      step: 0.1,
    });
    const stop = this.observeOnce(element, show);
    return () => {
      stop();
      clear();
    };
  }

  private flushQueue(): void {
    if (this.flushing) return;
    this.flushing = true;
    const run = (): void => {
      const start = performance.now();
      while (this.setupQueue.length && performance.now() - start < 8) {
        this.setupQueue.shift()?.();
      }
      if (this.setupQueue.length) {
        setTimeout(run, 0);
      } else {
        this.flushing = false;
      }
    };
    this.zone.runOutsideAngular(() => setTimeout(run, 0));
  }

  parallax(element: HTMLElement, distance = 24): () => void {
    const gsap = this.gsap;
    if (!gsap || this.reducedMotion || window.matchMedia('(max-width: 767px)').matches) {
      return () => undefined;
    }
    let context: ReturnType<typeof gsap.context> | undefined;
    this.zone.runOutsideAngular(() => {
      context = gsap.context(() => {
        gsap.fromTo(
          element,
          { y: -distance },
          {
            y: distance,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }, element);
    });
    return () => context?.revert();
  }

  splitText(element: HTMLElement, selector: string): () => void {
    if (this.prefersReducedMotion) return () => undefined;
    const words = [...element.querySelectorAll<HTMLElement>(selector)];
    if (!words.length) return () => undefined;
    const { show, clear } = this.prepareReveal(words, {
      y: 18,
      duration: 0.6,
      delay: 0.05,
      step: 0.045,
    });
    const stop = this.observeOnce(element, show);
    return () => {
      stop();
      clear();
    };
  }

  animateHeroVisual(
    host: HTMLElement,
    image: HTMLImageElement,
    sheen: HTMLElement,
    glow: HTMLElement,
  ): () => void {
    const gsap = this.gsap;
    if (!gsap || this.reducedMotion) return () => undefined;

    let context: ReturnType<typeof gsap.context> | undefined;
    let removeTilt = (): void => undefined;

    this.zone.runOutsideAngular(() => {
      context = gsap.context(() => {
        gsap.set(image, { transformPerspective: 1100, transformOrigin: 'center center' });

        // Sem animar a opacidade: a imagem é o LCP e precisa estar visível desde o início.
        const entrance = gsap.timeline();
        entrance.fromTo(
          image,
          { x: 52, y: 34, rotateY: -18, rotateX: 8, scale: 0.9 },
          {
            x: 0,
            y: 0,
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            duration: 1.2,
            ease: 'expo.out',
          },
        );
        entrance.fromTo(
          sheen,
          { xPercent: -140, autoAlpha: 0 },
          {
            xPercent: 140,
            autoAlpha: 0.75,
            duration: 0.9,
            ease: 'power2.inOut',
            onComplete: () => {
              gsap.set(sheen, { autoAlpha: 0 });
              sheen.style.willChange = 'auto';
            },
          },
          '+=0.1',
        );

        gsap.to(image, {
          y: -8,
          duration: 3,
          delay: 1.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });

        const canTilt = window.matchMedia(
          '(min-width: 768px) and (hover: hover) and (pointer: fine)',
        ).matches;
        if (!canTilt) return;

        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;
        let tickerActive = false;

        const updateTilt = (): void => {
          currentX += (targetX - currentX) * 0.1;
          currentY += (targetY - currentY) * 0.1;
          gsap.set(image, { rotateX: currentX, rotateY: currentY });
          gsap.set(glow, { x: -currentY * 1.5, y: currentX * 1.5 });

          const settled = Math.abs(targetX - currentX) + Math.abs(targetY - currentY) < 0.02;
          if (settled) {
            currentX = targetX;
            currentY = targetY;
            if (targetX === 0 && targetY === 0) {
              gsap.ticker.remove(updateTilt);
              tickerActive = false;
            }
          }
        };

        const startTilt = (): void => {
          if (tickerActive) return;
          gsap.ticker.add(updateTilt);
          tickerActive = true;
        };

        const onPointerMove = (event: PointerEvent): void => {
          if (event.pointerType !== 'mouse') return;
          const bounds = host.getBoundingClientRect();
          const horizontal = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
          const vertical = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
          targetX = (0.5 - vertical) * 12;
          targetY = (horizontal - 0.5) * 12;
          startTilt();
        };

        const onPointerLeave = (): void => {
          targetX = 0;
          targetY = 0;
          startTilt();
        };

        const enableTilt = (): void => {
          host.addEventListener('pointermove', onPointerMove, { passive: true });
          host.addEventListener('pointerleave', onPointerLeave);
        };
        entrance.eventCallback('onComplete', enableTilt);

        removeTilt = (): void => {
          host.removeEventListener('pointermove', onPointerMove);
          host.removeEventListener('pointerleave', onPointerLeave);
          gsap.ticker.remove(updateTilt);
        };
      }, host);
    });

    return () => {
      removeTilt();
      context?.revert();
    };
  }

  counter(element: HTMLElement, target: number, duration = 1.2): () => void {
    const gsap = this.gsap;
    const scrollTrigger = this.scrollTrigger;
    if (!gsap || !scrollTrigger || this.reducedMotion) return () => undefined;
    let context: ReturnType<typeof gsap.context> | undefined;
    // O HTML já traz o valor final (visível sem JS ou com movimento reduzido);
    // só zera quando a animação realmente vai acontecer.
    element.textContent = '0';
    this.zone.runOutsideAngular(() => {
      context = gsap.context(() => {
        const value = { current: 0 };
        gsap.to(value, {
          current: target,
          duration,
          ease: 'power1.out',
          onUpdate: () => {
            element.textContent = String(Math.round(value.current));
          },
          scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        });
      }, element);
    });
    return () => {
      context?.revert();
      element.textContent = String(target);
    };
  }

  /**
   * Publica o progresso do scroll (0 → 1) na variável CSS `--scroll-progress`
   * do elemento. O CSS decide o que fazer com ela (desenhar linhas, preencher
   * barras, acender etapas). Sem animação, a variável fica no valor padrão do CSS (1).
   */
  scrollVariable(element: HTMLElement, start = 'top 75%', end = 'bottom 55%'): () => void {
    const gsap = this.gsap;
    const scrollTrigger = this.scrollTrigger;
    if (!gsap || !scrollTrigger || this.reducedMotion) return () => undefined;
    let trigger: ScrollTriggerType | undefined;
    const proxy = { value: 0 };
    let tween: ReturnType<typeof gsap.to> | undefined;
    this.zone.runOutsideAngular(() => {
      element.style.setProperty('--scroll-progress', '0');
      tween = gsap.to(proxy, {
        value: 1,
        ease: 'none',
        onUpdate: () => element.style.setProperty('--scroll-progress', proxy.value.toFixed(4)),
        scrollTrigger: { trigger: element, start, end, scrub: 0.6 },
      });
      trigger = tween.scrollTrigger;
    });
    return () => {
      trigger?.kill();
      tween?.kill();
      element.style.removeProperty('--scroll-progress');
    };
  }

  progress(element: HTMLElement): () => void {
    const gsap = this.gsap;
    if (!gsap || !this.scrollTrigger || this.reducedMotion) return () => undefined;
    let context: ReturnType<typeof gsap.context> | undefined;
    this.zone.runOutsideAngular(() => {
      context = gsap.context(
        () =>
          gsap.fromTo(
            element,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: element.parentElement,
                start: 'top 65%',
                end: 'bottom 60%',
                scrub: true,
              },
            },
          ),
        element,
      );
    });
    return () => context?.revert();
  }

  destroy(): void {
    this.removeTicker?.();
    this.lenis?.destroy();
    this.scrollTrigger?.killAll();
  }
}
