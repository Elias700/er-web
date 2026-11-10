import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  Injector,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { auditTime, fromEvent } from 'rxjs';
import {
  RubberSegmentComponent,
  type RubberSegmentItem
} from '../rubber-segment/rubber-segment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RubberSegmentComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  protected readonly menuOpen = signal(false);
  protected readonly isScrolled = signal(false);
  protected readonly activeNavigation = signal('home');
  protected readonly navigationItems: readonly RubberSegmentItem[] = [
    { value: 'home', label: 'Home', href: '#home' },
    { value: 'trabalhos', label: 'Trabalhos', href: null },
    { value: 'planos', label: 'Planos', href: null },
    { value: 'contato', label: 'Contato', href: null }
  ];

  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly injector = inject(Injector);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly brandLink = viewChild<ElementRef<HTMLAnchorElement>>('brandLink');
  private readonly menuToggle = viewChild<ElementRef<HTMLButtonElement>>('menuToggle');
  private readonly firstMobileLink = viewChild<ElementRef<HTMLAnchorElement>>('firstMobileLink');

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isScrolled.set(window.scrollY > 40);

    fromEvent(window, 'scroll', { passive: true })
      .pipe(auditTime(50), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isScrolled.set(window.scrollY > 40));

    fromEvent(window, 'resize')
      .pipe(auditTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (window.innerWidth >= 1024) {
          const wasOpen = this.menuOpen();
          this.menuOpen.set(false);

          if (wasOpen) {
            this.brandLink()?.nativeElement.focus();
          }
        }
      });
  }

  protected toggleMenu(): void {
    const shouldOpen = !this.menuOpen();
    this.menuOpen.set(shouldOpen);

    if (shouldOpen) {
      afterNextRender(() => this.firstMobileLink()?.nativeElement.focus(), {
        injector: this.injector
      });
    }
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected onNavigationClick(): void {
    this.closeMenu();
  }

  protected onNavigationSelection(value: string): void {
    this.activeNavigation.set(value);
  }

  protected onMobileNavigation(item: RubberSegmentItem): void {
    this.activeNavigation.set(item.value);
    this.closeMenu();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (
      this.menuOpen() &&
      event.target instanceof Node &&
      !this.host.nativeElement.contains(event.target)
    ) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.menuOpen()) {
      this.closeMenu();
      this.menuToggle()?.nativeElement.focus();
    }
  }
}
