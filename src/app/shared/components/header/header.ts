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
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { auditTime, fromEvent } from 'rxjs';
import { RubberSegmentComponent, type RubberSegmentItem } from '../rubber-segment/rubber-segment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RubberSegmentComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly menuOpen = signal(false);
  protected readonly isScrolled = signal(false);
  protected readonly hiddenOnScroll = signal(false);
  protected readonly activeNavigation = signal('home');
  protected readonly navigationItems: readonly RubberSegmentItem[] = [
    { value: 'home', label: 'Início', href: '#home' },
    { value: 'servicos', label: 'Serviços', href: '#servicos' },
    { value: 'trabalhos', label: 'Projetos', href: '#trabalhos' },
    { value: 'processo', label: 'Processo', href: '#processo' },
    { value: 'sobre', label: 'Sobre', href: '#sobre' },
    { value: 'faq', label: 'FAQ', href: '#faq' },
    { value: 'contato', label: 'Contato', href: '#contato' },
  ];

  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly injector = inject(Injector);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly brandLink = viewChild<ElementRef<HTMLAnchorElement>>('brandLink');
  private readonly menuToggle = viewChild<ElementRef<HTMLButtonElement>>('menuToggle');
  private readonly firstMobileLink = viewChild<ElementRef<HTMLAnchorElement>>('firstMobileLink');
  private previousScrollY = 0;

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isScrolled.set(window.scrollY > 40);
    this.previousScrollY = window.scrollY;

    fromEvent(window, 'scroll', { passive: true })
      .pipe(auditTime(50), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const currentY = window.scrollY;
        this.isScrolled.set(currentY > 40);
        this.hiddenOnScroll.set(
          currentY > this.previousScrollY && currentY > 240 && !this.menuOpen(),
        );
        this.previousScrollY = currentY;
      });

    afterNextRender(
      () => {
        const sections = this.navigationItems
          .map((item) => item.href)
          .filter((href): href is string => href !== null)
          .map((href) => document.querySelector<HTMLElement>(href))
          .filter((section): section is HTMLElement => section !== null);
        const observer = new IntersectionObserver(
          (entries) => {
            const visible = entries
              .filter((entry) => entry.isIntersecting)
              .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            const id = visible?.target.id;
            if (id) this.activeNavigation.set(id);
          },
          { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.2, 0.5] },
        );
        sections.forEach((section) => observer.observe(section));
        this.destroyRef.onDestroy(() => observer.disconnect());
      },
      { injector: this.injector },
    );

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
    if (shouldOpen) this.hiddenOnScroll.set(false);

    if (shouldOpen) {
      afterNextRender(() => this.firstMobileLink()?.nativeElement.focus(), {
        injector: this.injector,
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
