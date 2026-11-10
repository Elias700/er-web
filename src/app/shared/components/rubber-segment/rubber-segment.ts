import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
  viewChildren
} from '@angular/core';

export interface RubberSegmentItem {
  readonly value: string;
  readonly label: string;
  readonly href: string | null;
}

export type RubberSegmentSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-rubber-segment',
  standalone: true,
  templateUrl: './rubber-segment.html',
  styleUrl: './rubber-segment.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RubberSegmentComponent {
  readonly items = input.required<readonly RubberSegmentItem[]>();
  readonly value = input<string | null>(null);
  readonly defaultValue = input<string | null>(null);
  readonly trackColor = input('var(--color-brand-surface)');
  readonly thumbColor = input('var(--color-brand-primary)');
  readonly textColor = input('var(--color-white)');
  readonly activeTextColor = input('var(--color-brand-ink)');
  readonly size = input<RubberSegmentSize>('md');
  readonly radius = input('10px');
  readonly inset = input(3);
  readonly equalSlots = input(true);
  readonly stretch = input(100);
  readonly squash = input(3);
  readonly speed = input(1);
  readonly glide = input(75);
  readonly disabled = input(false);
  readonly ariaLabel = input('Navegação por seções');
  readonly valueChange = output<string>();

  protected readonly selectedValue = computed(() => {
    const items = this.items();
    const candidate = this.value() ?? this.internalValue() ?? this.defaultValue();
    const selected = items.find((item) => item.value === candidate && item.href !== null);

    return selected?.value ?? items.find((item) => item.href !== null)?.value ?? null;
  });

  private readonly internalValue = signal<string | null>(null);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly track = viewChild<ElementRef<HTMLElement>>('track');
  private readonly thumb = viewChild<ElementRef<HTMLElement>>('thumb');
  private readonly itemElements = viewChildren<ElementRef<HTMLElement>>('segmentItem');
  private resizeObserver: ResizeObserver | null = null;
  private activeAnimation: Animation | null = null;
  private lastSelectedValue: string | null = null;
  private observedItems: readonly RubberSegmentItem[] = [];

  constructor() {
    effect(() => {
      const value = this.selectedValue();
      const items = this.items();
      const itemsChanged = items !== this.observedItems;
      this.observedItems = items;
      const shouldAnimate = this.lastSelectedValue !== null && value !== this.lastSelectedValue;
      this.lastSelectedValue = value;

      afterNextRender(
        () => {
          if (!this.resizeObserver || itemsChanged) {
            this.observeGeometry();
          }

          this.positionThumb(value, shouldAnimate);
        },
        { injector: this.injector }
      );
    });

    this.destroyRef.onDestroy(() => {
      this.resizeObserver?.disconnect();
      this.activeAnimation?.cancel();
    });
  }

  protected isItemEnabled(item: RubberSegmentItem): boolean {
    return !this.disabled() && item.href !== null;
  }

  protected isSelected(item: RubberSegmentItem): boolean {
    return this.selectedValue() === item.value;
  }

  protected onItemClick(item: RubberSegmentItem): void {
    if (!this.isItemEnabled(item)) {
      return;
    }

    if (this.value() === null) {
      this.internalValue.set(item.value);
    }

    this.valueChange.emit(item.value);
  }

  private observeGeometry(): void {
    const track = this.track()?.nativeElement;
    if (!track || typeof ResizeObserver === 'undefined') {
      this.positionThumb(this.selectedValue(), false);
      return;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver ??= new ResizeObserver(() => {
      this.positionThumb(this.selectedValue(), false);
    });
    this.resizeObserver.observe(track);
    this.itemElements().forEach(({ nativeElement }) => this.resizeObserver?.observe(nativeElement));
  }

  private positionThumb(value: string | null, animate: boolean): void {
    const track = this.track()?.nativeElement;
    const thumb = this.thumb()?.nativeElement;
    const target = this.itemElements().find(
      ({ nativeElement }) => nativeElement.dataset['segmentValue'] === value
    )?.nativeElement;

    if (!track || !thumb || !target) {
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const inset = this.inset();
    const targetX = targetRect.left - trackRect.left + inset;
    const targetWidth = Math.max(0, targetRect.width - inset * 2);
    const targetY = targetRect.top - trackRect.top + inset;
    const targetHeight = Math.max(0, targetRect.height - inset * 2);
    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!animate || reduceMotion || typeof thumb.animate !== 'function') {
      this.activeAnimation?.cancel();
      thumb.style.width = `${targetWidth}px`;
      thumb.style.height = `${targetHeight}px`;
      thumb.style.transform = `translate(${targetX}px, ${targetY}px)`;
      return;
    }

    const currentRect = thumb.getBoundingClientRect();
    const fromX = currentRect.left - trackRect.left;
    const fromY = currentRect.top - trackRect.top;
    const fromWidth = currentRect.width;
    const fromHeight = currentRect.height;
    const distance = targetX - fromX;
    const direction = Math.sign(distance) || 1;
    const stretchScale = 1 + Math.min(Math.max(this.stretch(), 0), 120) / 300;
    const squashScale = 1 - Math.min(Math.max(this.squash(), 0), 30) / 100;
    const overshoot =
      Math.min(Math.abs(distance) * (Math.max(this.glide(), 0) / 400), 20) * direction;

    this.activeAnimation?.cancel();
    thumb.style.width = `${targetWidth}px`;
    thumb.style.height = `${targetHeight}px`;
    this.activeAnimation = thumb.animate(
      [
        {
          transform: `translate(${fromX}px, ${fromY}px) scaleX(1)`,
          width: `${fromWidth}px`,
          height: `${fromHeight}px`
        },
        {
          transform: `translate(${fromX + direction * 8}px, ${fromY}px) scaleX(${stretchScale})`,
          offset: 0.18
        },
        {
          transform: `translate(${targetX + overshoot}px, ${targetY}px) scaleX(${squashScale})`,
          offset: 0.78
        },
        {
          transform: `translate(${targetX}px, ${targetY}px) scaleX(1)`,
          width: `${targetWidth}px`,
          height: `${targetHeight}px`
        }
      ],
      {
        duration: 440 / Math.max(this.speed(), 0.2),
        easing: 'cubic-bezier(0.22, 1.15, 0.36, 1)',
        fill: 'forwards'
      }
    );
  }
}
