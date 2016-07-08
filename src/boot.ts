import 'zone.js/dist/zone';

import { enableProdMode } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { provideRouter, HashLocationStrategy, PathLocationStrategy } from '@ngrx/router';

import { AppComponent, routes } from './app/app.component';
import { Store } from './store';    


if (process.env.ENV === 'production') {
  enableProdMode();
}

bootstrap(AppComponent, [
  // provideRouter(routes, HashLocationStrategy),
  provideRouter(routes, PathLocationStrategy),
  Store,
  disableDeprecatedForms(),
  provideForms()
]);
