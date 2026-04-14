import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Api } from './api';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'token';

  constructor(private api: Api) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  login(username: string, password: string): Observable<boolean> {
    return this.api.create<LoginResponse>('/auth/login', { username, password }).pipe(
      map((response) => {
        const token = response?.token?.trim();

        if (token && this.isBrowser()) {
          localStorage.setItem(this.TOKEN_KEY, token);
        }

        return !!token;
      }),
    );
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  decodeToken(): any | null {
    const token = this.getToken();
    if (!token || typeof window === 'undefined') return null;

    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;

      const payload = parts[1];

      // atob may throw for malformed base64; try to parse safely
      const decoded = (() => {
        try {
          return JSON.parse(window.atob(payload));
        } catch {
          try {
            // handle unicode
            return JSON.parse(decodeURIComponent(escape(window.atob(payload))));
          } catch {
            return null;
          }
        }
      })();

      return decoded;
    } catch {
      return null;
    }
  }

  getUserRoles(): string[] {
    const payload = this.decodeToken();
    if (!payload) return [];

    // Try common claim names
    const maybe = payload.roles ?? payload.role ?? payload.authorities ?? payload.authoritiesList ?? null;

    if (!maybe) return [];

    if (Array.isArray(maybe)) {
      return maybe.map(String);
    }

    if (typeof maybe === 'string') {
      // comma separated or single
      return maybe.includes(',') ? maybe.split(',').map(s => s.trim()) : [maybe];
    }

    return [];
  }
}