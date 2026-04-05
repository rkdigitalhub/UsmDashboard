import { InjectionToken } from '@angular/core';

export interface AppApiConfig {
  apiBaseUrl: string;
  assetBaseUrl: string;
}

export const APP_API_CONFIG = new InjectionToken<AppApiConfig>('APP_API_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    apiBaseUrl: '/api',
    assetBaseUrl: 'assets'
  })
});