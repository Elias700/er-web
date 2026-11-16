import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { projects, type ProjectData } from './projects.data';
import { RevealDirective, StaggerDirective } from '../../shared/directives/reveal.directive';

interface WorkProject extends ProjectData {
  readonly previewUrl: SafeResourceUrl;
}

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [RevealDirective, StaggerDirective],
  templateUrl: './work.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkComponent {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly projects: readonly WorkProject[] = projects.map((project) => ({
    ...project,
    previewUrl: this.sanitizer.bypassSecurityTrustResourceUrl(project.websiteUrl),
  }));

  protected readonly activeIndex = signal(0);
  protected readonly isFrameLoading = signal(true);
  protected readonly isTransitioning = signal(false);
  protected readonly currentProject = computed(() => this.projects[this.activeIndex()]);
  protected readonly positionLabel = computed(
    () =>
      `${String(this.activeIndex() + 1).padStart(2, '0')} / ${String(this.projects.length).padStart(2, '0')}`,
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
