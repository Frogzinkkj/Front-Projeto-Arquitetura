import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEnvelope } from '../models/api-envelope.model';
import { BackendError, BackendValidationError } from '../models/backend-error.model';
import { PageResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root',
})
export class Api {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = this.resolveBaseUrl();

  list<T>(path: string, params: Record<string, unknown> = {}): Observable<PageResponse<T>> {
    return this.http
      .get<unknown>(this.url(path), { params: this.toHttpParams(params) })
      .pipe(
        map((response) => this.normalizeListResponse<T>(response, params)),
        catchError((error) => {
          if (!this.shouldRetryWithoutApiPrefix(error, path)) {
            return throwError(() => error);
          }

          return this.http
            .get<unknown>(this.urlWithoutApiPrefix(path), { params: this.toHttpParams(params) })
            .pipe(map((response) => this.normalizeListResponse<T>(response, params)));
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  detail<T>(path: string): Observable<T> {
    return this.http
      .get<unknown>(this.url(path))
      .pipe(
        map((response) => this.unwrap<T>(response)),
        catchError((error) => {
          if (!this.shouldRetryWithoutApiPrefix(error, path)) {
            return throwError(() => error);
          }

          return this.http.get<unknown>(this.urlWithoutApiPrefix(path)).pipe(map((response) => this.unwrap<T>(response)));
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  create<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .post<unknown>(this.url(path), body)
      .pipe(
        map((response) => this.unwrap<T>(response)),
        catchError((error) => {
          if (!this.shouldRetryWithoutApiPrefix(error, path)) {
            return throwError(() => error);
          }

          return this.http.post<unknown>(this.urlWithoutApiPrefix(path), body).pipe(map((response) => this.unwrap<T>(response)));
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  update<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .put<unknown>(this.url(path), body)
      .pipe(
        map((response) => this.unwrap<T>(response)),
        catchError((error) => {
          if (!this.shouldRetryWithoutApiPrefix(error, path)) {
            return throwError(() => error);
          }

          return this.http.put<unknown>(this.urlWithoutApiPrefix(path), body).pipe(map((response) => this.unwrap<T>(response)));
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  put<T>(path: string, body?: unknown): Observable<T> {
    return this.http
      .put<unknown>(this.url(path), body ?? {})
      .pipe(
        map((response) => this.unwrap<T>(response)),
        catchError((error) => {
          if (!this.shouldRetryWithoutApiPrefix(error, path)) {
            return throwError(() => error);
          }

          return this.http.put<unknown>(this.urlWithoutApiPrefix(path), body ?? {}).pipe(map((response) => this.unwrap<T>(response)));
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  patch<T>(path: string, body?: unknown): Observable<T> {
    return this.http
      .patch<unknown>(this.url(path), body ?? {})
      .pipe(
        map((response) => this.unwrap<T>(response)),
        catchError((error) => {
          if (!this.shouldRetryWithoutApiPrefix(error, path)) {
            return throwError(() => error);
          }

          return this.http.patch<unknown>(this.urlWithoutApiPrefix(path), body ?? {}).pipe(map((response) => this.unwrap<T>(response)));
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  private url(path: string): string {
    const route = path.startsWith('/auth') || path.startsWith('/monitorias') || path.startsWith('/api')
      ? path
      : `/api${path.startsWith('/') ? path : `/${path}`}`;

    if (this.shouldUseRelativeUrl()) {
      return route;
    }

    return `${this.baseUrl}${route}`;
  }

  private urlWithoutApiPrefix(path: string): string {
    return path;
  }

  private shouldRetryWithoutApiPrefix(error: unknown, path: string): boolean {
    return error instanceof HttpErrorResponse
      && error.status === 404
      && !path.startsWith('/api')
      && !path.startsWith('/auth')
      && !path.startsWith('/monitorias');
  }

  private resolveBaseUrl(): string {
    return environment.apiUrl.replace(/\/$/, '');
  }

  private shouldUseRelativeUrl(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }

  private unwrap<T>(response: unknown): T {
    if (this.isEnvelope<T>(response) || this.isApiResponseEnvelope<T>(response)) {
      return response.data;
    }

    return response as T;
  }

  private isEnvelope<T>(response: unknown): response is ApiEnvelope<T> {
    return typeof response === 'object' && response !== null && 'data' in response && 'status' in response;
  }

  private isApiResponseEnvelope<T>(response: unknown): response is { success: boolean; data: T; message: string } {
    return typeof response === 'object' && response !== null && 'data' in response && 'success' in response;
  }

  private isPageResponse<T>(response: unknown): response is PageResponse<T> {
    return typeof response === 'object' && response !== null && 'content' in response && 'totalElements' in response;
  }

  private normalizeListResponse<T>(response: unknown, params: Record<string, unknown>): PageResponse<T> {
    if (this.isPageResponse<T>(response)) {
      return response;
    }

    const unwrapped = this.unwrap<unknown>(response);

    if (this.isPageResponse<T>(unwrapped)) {
      return unwrapped;
    }

    if (Array.isArray(unwrapped)) {
      const page = Number(params['page'] ?? 0);
      const size = Number(params['size'] ?? unwrapped.length);

      return {
        content: unwrapped as T[],
        page,
        size,
        totalElements: unwrapped.length,
        totalPages: 1,
        first: true,
        last: true,
      };
    }

    throw new Error('Formato de resposta inválido para listagem.');
  }

  private toHttpParams(params: Record<string, unknown>): HttpParams {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }

      httpParams = httpParams.set(key, String(value));
    });

    return httpParams;
  }

  private handleError(error: unknown): Observable<never> {
    if (this.isBackendError(error)) {
      return throwError(() => error);
    }

    if (error instanceof HttpErrorResponse) {
      return throwError(() => this.normalizeError(error));
    }

    return throwError(() => ({
      timestamp: new Date().toISOString(),
      status: 0,
      message: 'Erro inesperado ao comunicar com a API',
      data: null,
      errors: [],
    } satisfies BackendError));
  }

  private normalizeError(error: HttpErrorResponse): BackendError {
    const backendBody = error.error;

    if (this.isBackendError(backendBody)) {
      return {
        timestamp: backendBody.timestamp,
        status: backendBody.status ?? error.status,
        message: backendBody.message || this.defaultMessage(error.status),
        data: backendBody.data ?? null,
        errors: backendBody.errors ?? [],
      };
    }

    return {
      timestamp: new Date().toISOString(),
      status: error.status,
      message: this.defaultMessage(error.status),
      data: null,
      errors: [],
    };
  }

  private isBackendError(value: unknown): value is BackendError {
    return typeof value === 'object' && value !== null && 'message' in value && 'status' in value;
  }

  private defaultMessage(status: number): string {
    if (status === 400) return 'Falha de validação';
    if (status === 404) return 'Registro não encontrado';
    if (status >= 500) return 'Erro inesperado no servidor';
    return 'Erro inesperado ao comunicar com a API';
  }
}
