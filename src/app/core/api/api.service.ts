import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_API_CONFIG, type AppApiConfig } from './api-config';

export interface ApiRequestOptions {
  params?: HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
  headers?: HttpHeaders | Record<string, string | string[]>;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(APP_API_CONFIG) private readonly config: AppApiConfig
  ) {}

  get<T>(path: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.get<T>(this.buildApiUrl(path), options);
  }

  post<T>(path: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http.post<T>(this.buildApiUrl(path), body, options);
  }

  put<T>(path: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http.put<T>(this.buildApiUrl(path), body, options);
  }

  patch<T>(path: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http.patch<T>(this.buildApiUrl(path), body, options);
  }

  delete<T>(path: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.delete<T>(this.buildApiUrl(path), options);
  }

  getAsset<T>(assetPath: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.get<T>(this.buildAssetUrl(assetPath), options);
  }

  private buildApiUrl(path: string): string {
    return this.joinUrl(this.config.apiBaseUrl, path);
  }

  private buildAssetUrl(path: string): string {
    return this.joinUrl(this.config.assetBaseUrl, path);
  }

  private joinUrl(base: string, path: string): string {
    const normalizedBase = base.replace(/\/+$/, '');
    const normalizedPath = path.replace(/^\/+/, '');
    return `${normalizedBase}/${normalizedPath}`;
  }
}