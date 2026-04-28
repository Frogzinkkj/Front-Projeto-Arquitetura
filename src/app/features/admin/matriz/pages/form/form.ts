import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BackendError } from '../../../../../core/models/backend-error.model';
import { MatrizDisciplinaRequest, MatrizRequest } from '../../../../../shared/models/matriz.model';
import { EntityStatus } from '../../../../../shared/models/domain.enums';
import { MatrizService } from '../../../../../core/services/matriz';
import { CursoService } from '../../../../../core/services/curso';
import { DisciplinaService } from '../../../../../core/services/disciplina';
import { Curso } from '../../../../../shared/models/curso.model';
import { Disciplina } from '../../../../../shared/models/disciplina.model';
import { ToastService } from '../../../../../core/services/toast';

@Component({
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form implements OnInit {

  nome = '';
  descricao = '';
  cursoId = 0;
  status: EntityStatus = 'ATIVO';
  disciplinaId = 0;
  preRequisitoId: number | null = null;
  cursoOptions: Curso[] = [];
  disciplinaOptions: Disciplina[] = [];
  id: number | null = null;
  errorMessage = '';
  fieldErrors: Record<string, string> = {};

  constructor(
    private service: MatrizService,
    private cursoService: CursoService,
    private disciplinaService: DisciplinaService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.carregarCursos();
    this.carregarDisciplinas();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = Number(id);
      this.service.detalhar(this.id).subscribe({
        next: (matriz) => {
          this.nome = matriz.nome;
          this.descricao = matriz.descricao;
          this.status = matriz.status;
          this.cursoId = matriz.cursoId;
        },
        error: (error) => this.handleError(error),
      });
    }
  }

  salvar() {
    const isEdit = !!this.id;

    const payload: MatrizRequest = {
      nome: this.nome,
      descricao: this.descricao,
      status: this.status,
      cursoId: Number(this.cursoId),
    };

    const request = this.id ? this.service.atualizar(this.id, payload) : this.service.criar(payload);
    request.subscribe({
      next: (matriz) => {
        const matrizId = this.id ?? matriz.id;
        if (!this.id && matrizId) {
          this.id = matrizId;
        }
        this.toast.success(isEdit ? 'Matriz atualizada com sucesso.' : 'Matriz criada com sucesso.');
        this.router.navigate(['/admin/matriz']);
      },
      error: (error) => this.handleError(error),
    });
  }

  associarDisciplina() {
    if (!this.id) {
      this.errorMessage = 'Salve a matriz antes de associar disciplinas.';
      return;
    }

    const payload: MatrizDisciplinaRequest = {
      disciplinaId: Number(this.disciplinaId),
      preRequisitoId: this.preRequisitoId ? Number(this.preRequisitoId) : null,
    };

    this.service.associarDisciplina(this.id, payload).subscribe({
      next: () => {
        this.toast.success('Disciplina associada à matriz com sucesso.');
        this.router.navigate(['/admin/matriz']);
      },
      error: (error) => this.handleError(error),
    });
  }

  private carregarCursos() {
    this.cursoService.listar(0, 1000).subscribe({
      next: (response) => {
        this.cursoOptions = response.content;
      },
      error: (error) => this.handleError(error),
    });
  }

  private carregarDisciplinas() {
    this.disciplinaService.listar(0, 1000).subscribe({
      next: (response) => {
        this.disciplinaOptions = response.content;
      },
      error: (error) => this.handleError(error),
    });
  }

  private handleError(error: BackendError) {
    this.errorMessage = error.message;
    this.fieldErrors = Object.fromEntries((error.errors ?? []).map((item) => [item.field, item.message]));
  }
}