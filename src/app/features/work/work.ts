import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';

const ROBERT_SOLAR_URL = 'https://robertsolar.com.br/';

interface WorkPreviewScreen {
  readonly id: string;
  readonly label: string;
  readonly url: SafeResourceUrl;
}

interface WorkProject {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly description: string;
  readonly imageSrc: string | null;
  readonly previewScreens: readonly WorkPreviewScreen[];
  readonly websiteUrl: string | null;
}

@Component({
  selector: 'app-work',
  standalone: true,
  templateUrl: './work.html',
  styleUrl: './work.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkComponent {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly projects: readonly WorkProject[] = [
    {
      id: 'robert-solar',
      name: 'Robert Solar',
      type: 'Landing page',
      description:
        'Página para apresentar os serviços de consultoria em energia solar e facilitar o contato pelo WhatsApp.',
      imageSrc: null,
      previewScreens: [
        {
          id: 'inicio',
          label: 'Início',
          url: this.sanitizer.bypassSecurityTrustResourceUrl(ROBERT_SOLAR_URL)
        },
        {
          id: 'vantagens',
          label: 'Vantagens',
          url: this.sanitizer.bypassSecurityTrustResourceUrl(`${ROBERT_SOLAR_URL}#vantagens`)
        },
        {
          id: 'sobre',
          label: 'Sobre',
          url: this.sanitizer.bypassSecurityTrustResourceUrl(`${ROBERT_SOLAR_URL}#sobre`)
        }
      ],
      websiteUrl: ROBERT_SOLAR_URL
    }
  ];

  protected readonly activeIndex = signal(0);
  protected readonly activeScreenIndex = signal(0);
  protected readonly currentProject = computed(() => this.projects[this.activeIndex()]);
  protected readonly currentScreen = computed(
    () => this.currentProject().previewScreens[this.activeScreenIndex()]
  );
  protected readonly hasMultipleProjects = computed(() => this.projects.length > 1);
  protected readonly positionLabel = computed(
    () => `${this.activeIndex() + 1} / ${this.projects.length}`
  );

  private pointerStartX: number | null = null;

  protected isActive(index: number): boolean {
    return index === this.activeIndex();
  }

  protected isPrevious(index: number): boolean {
    return index === this.wrapIndex(this.activeIndex() - 1);
  }

  protected isNext(index: number): boolean {
    return index === this.wrapIndex(this.activeIndex() + 1);
  }

  protected isCurrentScreen(index: number): boolean {
    return index === this.activeScreenIndex();
  }

  protected selectScreen(index: number): void {
    if (index >= 0 && index < this.currentProject().previewScreens.length) {
      this.activeScreenIndex.set(index);
    }
  }

  protected previousProject(): void {
    if (this.hasMultipleProjects()) {
      this.activeIndex.update((index) => this.wrapIndex(index - 1));
      this.activeScreenIndex.set(0);
    }
  }

  protected nextProject(): void {
    if (this.hasMultipleProjects()) {
      this.activeIndex.update((index) => this.wrapIndex(index + 1));
      this.activeScreenIndex.set(0);
    }
  }

  protected onPointerDown(event: PointerEvent): void {
    this.pointerStartX = event.pointerType === 'touch' ? event.clientX : null;
  }

  protected onPointerUp(event: PointerEvent): void {
    if (this.pointerStartX === null) {
      return;
    }

    const distance = event.clientX - this.pointerStartX;
    this.pointerStartX = null;

    if (Math.abs(distance) >= 40) {
      distance > 0 ? this.previousProject() : this.nextProject();
    }
  }

  protected onPointerCancel(): void {
    this.pointerStartX = null;
  }

  private wrapIndex(index: number): number {
    return (index + this.projects.length) % this.projects.length;
  }
}
