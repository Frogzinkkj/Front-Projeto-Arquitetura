import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { EscolaService } from '../../../../../core/services/escola';
import { IesService } from '../../../../../core/services/ies';
import { EscolaRequest } from '../../../../../shared/models/escola.model';
import { Ies } from '../../../../../shared/models/ies.model';
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

  nome = '';
  coordenador = '';
  status: EntityStatus = 'ATIVO';
  iesId = 0;
  iesOptions: Ies[] = [];
  id: number | null = null;
  errorMessage = '';
  fieldErrors: Record<string, string> = {};

  constructor(
    private service: EscolaService,
    private iesService: IesService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.carregarIes();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = Number(id);
      this.service.detalhar(this.id).subscribe({
        next: (escola) => {
          this.nome = escola.nome;
          this.coordenador = escola.coordenador;
          this.status = escola.status;
          this.iesId = escola.iesId;
        },
        error: (error) => this.handleError(error),
      });
    }
  }

  salvar() {
    const payload: EscolaRequest = {
      nome: this.nome,
      coordenador: this.coordenador,
      status: this.status,
      iesId: Number(this.iesId),
    };

    if (this.id) {
      this.service.atualizar(this.id, payload).subscribe({
        next: () => {
          this.toast.success('Escola atualizada com sucesso.');
          this.router.navigate(['/admin/escola']);
        },
        error: (error) => this.handleError(error),
      });
    } else {
      this.service.criar(payload).subscribe({
        next: () => {
          this.toast.success('Escola criada com sucesso.');
          this.router.navigate(['/admin/escola']);
        },
        error: (error) => this.handleError(error),
      });
    }
  }

  private carregarIes() {
    this.iesService.listar(0, 1000).subscribe({
      next: (response) => {
        this.iesOptions = response.content;
      },
      error: (error) => this.handleError(error),
    });
  }

  private handleError(error: BackendError) {
    this.errorMessage = error.message;
    this.fieldErrors = Object.fromEntries((error.errors ?? []).map((item) => [item.field, item.message]));
  }
}