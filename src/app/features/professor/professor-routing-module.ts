import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importe seus componentes (ajuste o caminho se necessário)
import { Monitoria } from './monitoria/monitoria'; // Exemplo de caminho
import { Relatorios } from './relatorios/relatorios'; // Exemplo de caminho

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