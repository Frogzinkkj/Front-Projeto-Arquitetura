import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importe seus componentes (ajuste o caminho se necessário)
import { Monitoria } from './pages/monitoria/monitoria';
import { Relatorios } from './pages/relatorios/relatorios';

const routes: Routes = [
  { 
    path: 'monitorias', 
    component: Monitoria 
  },
  { 
    path: 'relatorios', 
    component: Relatorios 
  },
  { 
    path: '', 
    redirectTo: 'monitorias', 
    pathMatch: 'full' // Rota padrão redireciona para monitorias
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfessorRoutingModule {}