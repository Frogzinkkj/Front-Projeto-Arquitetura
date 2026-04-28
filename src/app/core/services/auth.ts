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
}