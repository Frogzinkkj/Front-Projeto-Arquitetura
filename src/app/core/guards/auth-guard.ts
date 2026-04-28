import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate(): boolean {
    if (typeof window !== 'undefined') {
      if (this.authService.isAuthenticated()) {
        return true;
      }
    }

    this.router.navigate(['/login']);
    return false;
  }
}
