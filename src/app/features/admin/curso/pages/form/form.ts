import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CursoService } from '../../../../../core/services/curso';
import { EscolaService } from '../../../../../core/services/escola';
import { CursoRequest } from '../../../../../shared/models/curso.model';
import { Escola } from '../../../../../shared/models/escola.model';
import { EntityStatus, CursoTurno } from '../../../../../shared/models/domain.enums';
import { BackendError } from '../../../../../core/models/backend-error.model';
import { ToastService } from '../../../../../core/services/toast';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class Form implements OnInit {

  sigla = '';
  descricao = '';
  coordenador = '';
  turno: CursoTurno = 'NOTURNO';
  status: EntityStatus = 'ATIVO';
  escolaId = 0;
  escolaOptions: Escola[] = [];
  id: number | null = null;
  errorMessage = '';
  fieldErrors: Record<string, string> = {};

  constructor(
    private service: CursoService,
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
        next: (curso) => {
          this.sigla = curso.sigla;
          this.descricao = curso.descricao;
          this.coordenador = curso.coordenador;
          this.turno = curso.turno;
          this.status = curso.status;
          this.escolaId = curso.escolaId;
        },
        error: (error) => this.handleError(error),
      });
    }
  }

  salvar() {
    const payload: CursoRequest = {
      sigla: this.sigla,
      descricao: this.descricao,
      coordenador: this.coordenador,
      turno: this.turno,
      status: this.status,
      escolaId: Number(this.escolaId),
    };

    if (this.id) {
      this.service.atualizar(this.id, payload).subscribe({
        next: () => {
          this.toast.success('Curso atualizado com sucesso.');
          this.router.navigate(['/admin/curso']);
        },
        error: (error) => this.handleError(error),
      });
    } else {
      this.service.criar(payload).subscribe({
        next: () => {
          this.toast.success('Curso criado com sucesso.');
          this.router.navigate(['/admin/curso']);
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
