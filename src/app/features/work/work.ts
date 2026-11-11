import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';

interface WorkProject {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly websiteUrl: string;
  readonly previewUrl: SafeResourceUrl;
  readonly thumbnailUrl: string;
  readonly thumbnailAlt: string;
  readonly isDemo: boolean;
}

const projectsData = [
  {
    id: 'robert-solar',
    name: 'Robert Solar',
    category: 'Landing page',
    description:
      'Página para apresentar serviços de consultoria em energia solar e facilitar o contato pelo WhatsApp.',
    tags: ['Responsivo', 'WhatsApp', 'Página única'],
    websiteUrl: 'https://robertsolar.com.br/',
    thumbnailUrl: '/assets/work/robert-solar.webp',
    thumbnailAlt: 'Apresentação ilustrativa do projeto Robert Solar',
    isDemo: false
  },
  {
    id: 'modelo-advocacia',
    name: 'Modelo de Advocacia',
    category: 'Site demonstrativo',
    description:
      'Modelo de site para apresentar um escritório de advocacia, suas áreas de atuação e seus canais de contato.',
    tags: ['Projeto demonstrativo'],
    websiteUrl: 'https://modelo-advocacia-ecru.vercel.app/',
    thumbnailUrl: '/assets/work/modelo-advocacia.webp',
    thumbnailAlt: 'Apresentação ilustrativa do projeto Modelo de Advocacia',
    isDemo: true
  }
] as const;

@Component({
  selector: 'app-work',
  standalone: true,
  templateUrl: './work.html',
  styleUrl: './work.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkComponent {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly projects: readonly WorkProject[] = projectsData.map((project) => ({
    ...project,
    previewUrl: this.sanitizer.bypassSecurityTrustResourceUrl(project.websiteUrl)
  }));

  protected readonly activeIndex = signal(0);
  protected readonly isFrameLoading = signal(true);
  protected readonly isTransitioning = signal(false);
  protected readonly currentProject = computed(() => this.projects[this.activeIndex()]);
  protected readonly positionLabel = computed(
    () => `${String(this.activeIndex() + 1).padStart(2, '0')} / ${String(this.projects.length).padStart(2, '0')}`
  );

  private frameTimer: ReturnType<typeof setTimeout> | undefined;
  private transitionTimer: ReturnType<typeof setTimeout> | undefined;

  protected isActive(index: number): boolean {
    return index === this.activeIndex();
  }

  protected selectProject(index: number): void {
    if (index < 0 || index >= this.projects.length || index === this.activeIndex()) {
      return;
    }

    this.clearTimers();
    this.isTransitioning.set(true);
    this.isFrameLoading.set(true);
    this.activeIndex.set(index);
    this.transitionTimer = setTimeout(() => this.isTransitioning.set(false), 250);
  }

  protected previousProject(): void {
    this.selectProject((this.activeIndex() - 1 + this.projects.length) % this.projects.length);
  }

  protected nextProject(): void {
    this.selectProject((this.activeIndex() + 1) % this.projects.length);
  }

  protected onFrameLoad(): void {
    if (this.frameTimer) {
      clearTimeout(this.frameTimer);
    }

    this.frameTimer = setTimeout(() => this.isFrameLoading.set(false), 350);
  }

  private clearTimers(): void {
    if (this.frameTimer) {
      clearTimeout(this.frameTimer);
      this.frameTimer = undefined;
    }

    if (this.transitionTimer) {
      clearTimeout(this.transitionTimer);
      this.transitionTimer = undefined;
    }
  }
}
