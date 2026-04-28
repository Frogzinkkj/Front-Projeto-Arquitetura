import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Api } from './api';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'token';
  private readonly MOCK_ROLE_KEY = 'mock_role';
  private readonly MOCK_USERNAME_KEY = 'mock_username';
  private readonly MOCK_PROFESSOR_USERNAME = 'ana.silveira';
  private readonly MOCK_PROFESSOR_PASSWORD = 'prof123';

  constructor(private api: Api) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  login(username: string, password: string): Observable<boolean> {
    if (this.isMockProfessorCredentials(username, password)) {
      this.saveMockSession(username, 'PROFESSOR');
      return of(true);
    }

    return this.api.create<LoginResponse>('/auth/login', { username, password }).pipe(
      map((response: LoginResponse) => {
        const token = response?.token?.trim();

        if (token && this.isBrowser()) {
          localStorage.setItem(this.TOKEN_KEY, token);
          this.clearMockSession();
        }

        return !!token;
      }),
    );
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem(this.TOKEN_KEY);
      this.clearMockSession();
    }
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem(this.TOKEN_KEY) || !!localStorage.getItem(this.MOCK_ROLE_KEY);
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
    const storedRole = this.getStoredMockRole();
    const payload = this.decodeToken();
    if (!payload) return storedRole ? [storedRole] : [];

    // Try common claim names
    const maybe = payload.roles ?? payload.role ?? payload.authorities ?? payload.authoritiesList ?? null;

    if (!maybe) return storedRole ? [storedRole] : [];

    if (Array.isArray(maybe)) {
      return maybe.map(String);
    }

    if (typeof maybe === 'string') {
      // comma separated or single
      return maybe.includes(',') ? maybe.split(',').map(s => s.trim()) : [maybe];
    }

    return storedRole ? [storedRole] : [];
  }

  getHomeRoute(): string {
    return this.isProfessorUser() ? '/professor' : '/admin';
  }

  isProfessorUser(): boolean {
    return this.getUserRoles().some((role) => /prof/i.test(role));
  }

  private isMockProfessorCredentials(username: string, password: string): boolean {
    return username.trim().toLowerCase() === this.MOCK_PROFESSOR_USERNAME
      && password === this.MOCK_PROFESSOR_PASSWORD;
  }

  private saveMockSession(username: string, role: string): void {
    if (!this.isBrowser()) return;

    localStorage.setItem(this.MOCK_USERNAME_KEY, username);
    localStorage.setItem(this.MOCK_ROLE_KEY, role);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private clearMockSession(): void {
    if (!this.isBrowser()) return;

    localStorage.removeItem(this.MOCK_USERNAME_KEY);
    localStorage.removeItem(this.MOCK_ROLE_KEY);
  }

  private getStoredMockRole(): string | null {
    if (!this.isBrowser()) return null;

    return localStorage.getItem(this.MOCK_ROLE_KEY);
  }
}