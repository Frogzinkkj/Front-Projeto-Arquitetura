import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BackendError } from '../../../../../core/models/backend-error.model';
import { DisciplinaRequest } from '../../../../../shared/models/disciplina.model';
import { EntityStatus } from '../../../../../shared/models/domain.enums';
import { DisciplinaService } from '../../../../../core/services/disciplina';
import { EscolaService } from '../../../../../core/services/escola';
import { Escola } from '../../../../../shared/models/escola.model';
import { ToastService } from '../../../../../core/services/toast';

@Component({
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form implements OnInit {

  sigla = '';
  descricao = '';
  cargaHoraria = 0;
  escolaId = 0;
  status: EntityStatus = 'ATIVO';
  escolaOptions: Escola[] = [];
  id: number | null = null;
  errorMessage = '';
  fieldErrors: Record<string, string> = {};

  constructor(
    private service: DisciplinaService,
    private escolaService: EscolaService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.carregarEscolas();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = Number(id);
      this.service.detalhar(this.id).subscribe({
        next: (disciplina) => {
          this.sigla = disciplina.sigla;
          this.descricao = disciplina.descricao;
          this.cargaHoraria = disciplina.cargaHoraria;
          this.status = disciplina.status;
          this.escolaId = disciplina.escolaId;
        },
        error: (error) => this.handleError(error),
      });
    }
  }

  salvar() {
    const payload: DisciplinaRequest = {
      sigla: this.sigla,
      descricao: this.descricao,
      cargaHoraria: Number(this.cargaHoraria),
      status: this.status,
      escolaId: Number(this.escolaId),
    };

    const request = this.id ? this.service.atualizar(this.id, payload) : this.service.criar(payload);
    request.subscribe({
      next: () => {
        this.toast.success(this.id ? 'Disciplina atualizada com sucesso.' : 'Disciplina criada com sucesso.');
        this.router.navigate(['/admin/disciplina']);
      },
      error: (error) => this.handleError(error),
    });
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
