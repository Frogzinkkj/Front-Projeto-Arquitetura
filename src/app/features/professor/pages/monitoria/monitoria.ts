import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service'; // Ajuste o caminho

@Component({
  selector: 'app-monitoria',
  standalone: true, // Já que você usou "imports: []"
  imports: [],
  templateUrl: './monitoria.html',
  styleUrl: './monitoria.css',
})
export class Monitoria {
  // Injeção de dependência moderna do Angular
  private router = inject(Router);
  private apiService = inject(ApiService);

  novaMonitoria() {
    // Exemplo: Navegar para uma tela de formulário ou abrir um modal
    console.log('Botão Nova Monitoria clicado!');
    // this.router.navigate(['/professor/nova-monitoria']); 
    
    /* Exemplo chamando a API:
    const payload = { ... };
    this.apiService.criarMonitoria(payload).subscribe({
      next: (res) => alert('Monitoria criada!'),
      error: (err) => console.error('Erro:', err)
    });
    */
  }

  verHistorico() {
    // Navega para a tela de relatórios, por exemplo
    this.router.navigate(['/relatorios']);
  }
}