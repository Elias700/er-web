import { IMAGE_LOADER, type ImageLoaderConfig } from '@angular/common';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

/**
 * Imagens responsivas locais: para `ngSrc="/assets/hero/hero.webp"`, o NgOptimizedImage
 * pede `/assets/hero/hero-<largura>.webp` (arquivos gerados em 640, 960, 1280 e 1800).
 * Qualquer outra imagem é servida como está.
 */
function localResponsiveLoader({ src, width }: ImageLoaderConfig): string {
  if (!src.startsWith('/assets/hero/')) return src;
  return src.replace(/\.webp$/, `-${width ?? 1280}.webp`);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: IMAGE_LOADER, useValue: localResponsiveLoader },
  ],
};
