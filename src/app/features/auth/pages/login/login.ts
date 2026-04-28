import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  login() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        this.loading = false;

        if (success) {
          this.router.navigate(['/admin']);
          return;
        }

        this.errorMessage = 'Não foi possível autenticar com as credenciais informadas.';
      },
      error: (error) => {
        this.loading = false;
        if (error?.status === 401 || error?.status === 403) {
          this.errorMessage = 'Usuário ou senha inválidos.';
          return;
        }

        this.errorMessage = error?.message ?? 'Falha ao autenticar no servidor.';
      },
    });
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/admin']);
      }
    }
  }
}