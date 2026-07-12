import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { headerInterceptor } from './core/interceptors/header-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true,
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      })
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        headerInterceptor,
        errorInterceptor,
        loadingInterceptor,
      ])
    ),
  ],
};