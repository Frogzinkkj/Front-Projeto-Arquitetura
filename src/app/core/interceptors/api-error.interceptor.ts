import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { BackendError } from '../models/backend-error.model';
import { ToastService } from '../services/toast';

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {

  constructor(private toast: ToastService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          const normalized = this.normalizeError(error);
          this.toast.error(normalized.message);
          return throwError(() => normalized);
        }

        const fallback = {
          timestamp: new Date().toISOString(),
          status: 0,
          message: 'Erro inesperado ao comunicar com a API',
          data: null,
          errors: [],
        } satisfies BackendError;

        this.toast.error(fallback.message);
        return throwError(() => fallback);
      }),
    );
  }

  private normalizeError(error: HttpErrorResponse): BackendError {
    const body = error.error;

    if (this.isBackendError(body)) {
      return {
        timestamp: body.timestamp,
        status: body.status ?? error.status,
        message: body.message || this.defaultMessage(error.status),
        data: body.data ?? null,
        errors: body.errors ?? [],
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