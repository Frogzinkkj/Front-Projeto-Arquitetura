import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProfessorService } from '../../../../../core/services/professor';
import { EscolaService } from '../../../../../core/services/escola';
import { ProfessorRequest } from '../../../../../shared/models/professor.model';
import { Escola } from '../../../../../shared/models/escola.model';
import { EntityStatus } from '../../../../../shared/models/domain.enums';
import { BackendError } from '../../../../../core/models/backend-error.model';
import { ToastService } from '../../../../../core/services/toast';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './form.html'
})
export class Form implements OnInit {

  matricula = '';
  nome = '';
  email = '';
  telefone = '';
  titulacao = '';
  escolaId = 0;
  status: EntityStatus = 'ATIVO';
  escolaOptions: Escola[] = [];
  id: number | null = null;
  errorMessage = '';
  fieldErrors: Record<string, string> = {};

  constructor(
    private service: ProfessorService,
    private escolaService: EscolaService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.carregarEscolas();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = Number(id);
      this.service.detalhar(this.id).subscribe({
        next: (professor) => {
          this.matricula = professor.matricula;
          this.nome = professor.nome;
          this.email = professor.email;
          this.telefone = professor.telefone;
          this.titulacao = professor.titulacao;
          this.status = professor.status;
          this.escolaId = professor.escolaId;
        },
        error: (error) => this.handleError(error),
      });
    }
  }

  salvar() {
    const payload: ProfessorRequest = {
      matricula: this.matricula,
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      titulacao: this.titulacao,
      status: this.status,
      escolaId: Number(this.escolaId),
    };

    if (this.id) {
      this.service.atualizar(this.id, payload).subscribe({
        next: () => {
          this.toast.success('Professor atualizado com sucesso.');
          this.router.navigate(['/admin/professor']);
        },
        error: (error) => this.handleError(error),
      });
    } else {
      this.service.criar(payload).subscribe({
        next: () => {
          this.toast.success('Professor criado com sucesso.');
          this.router.navigate(['/admin/professor']);
        },
        error: (error) => this.handleError(error),
      });
    }
  }

  private carregarEscolas() {
    this.escolaService.listar(0, 1000).subscribe({
      next: (response) => {
        this.escolaOptions = response.content;
      },
      error: (error) => this.handleError(error),
    });
  }

  private handleError(error: BackendError) {
    this.errorMessage = error.message;
    this.fieldErrors = Object.fromEntries((error.errors ?? []).map((item) => [item.field, item.message]));
  }
}