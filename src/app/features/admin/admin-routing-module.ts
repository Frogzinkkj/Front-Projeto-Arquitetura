import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./escola/pages/list/list').then((m) => m.List),
  },
  {
    path: 'escola',
    loadComponent: () => import('./escola/pages/list/list').then((m) => m.List),
  },
  {
    path: 'escola/form', // 👈 CRIAR
    loadComponent: () => import('./escola/pages/form/form').then((m) => m.Form),
  },
  {
    path: 'escola/form/:id', // 👈 EDITAR
    loadComponent: () => import('./escola/pages/form/form').then((m) => m.Form),
  },
  {
    path: 'professor',
    loadComponent: () => import('./professor/pages/list/list').then((m) => m.List),
  },
  {
    path: 'professor/form',
    loadComponent: () => import('./professor/pages/form/form').then((m) => m.Form),
  },
  {
    path: 'professor/form/:id',
    loadComponent: () => import('./professor/pages/form/form').then((m) => m.Form),
  },
  {
    path: 'curso',
    loadComponent: () => import('./curso/pages/list/list').then((m) => m.List),
  },
  {
    path: 'curso/form',
    loadComponent: () => import('./curso/pages/form/form').then((m) => m.Form),
  },
  {
    path: 'curso/form/:id',
    loadComponent: () => import('./curso/pages/form/form').then((m) => m.Form),
  },
  {
    path: 'ies',
    loadComponent: () => import('./ies/pages/list/list').then((m) => m.List),
  },
  {
    path: 'ies/form',
    loadComponent: () => import('./ies/pages/form/form').then((m) => m.Form),
  },
  {
    path: 'ies/form/:id',
    loadComponent: () => import('./ies/pages/form/form').then((m) => m.Form),
  },
  {
    path: 'disciplina',
    loadComponent: () => import('./disciplina/pages/list/list').then((m) => m.List),
  },
  {
    path: 'disciplina/form',
    loadComponent: () => import('./disciplina/pages/form/form').then((m) => m.Form),
  },
  {
    path: 'disciplina/form/:id',
    loadComponent: () => import('./disciplina/pages/form/form').then((m) => m.Form),
  },
  {
    path: 'matriz',
    loadComponent: () => import('./matriz/pages/list/list').then((m) => m.List),
  },
  {
    path: 'matriz/form',
    loadComponent: () => import('./matriz/pages/form/form').then((m) => m.Form),
  },
  {
    path: 'matriz/form/:id',
    loadComponent: () => import('./matriz/pages/form/form').then((m) => m.Form),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
