import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/admin/admin-module').then(m => m.AdminModule)
  },
  {
    path: 'professor',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/professor/professor-module').then(m => m.ProfessorModule)
  },
  
];
