import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BackendError } from '../../../../../core/models/backend-error.model';
import { IesRequest } from '../../../../../shared/models/ies.model';
import { EntityStatus } from '../../../../../shared/models/domain.enums';
import { IesService } from '../../../../../core/services/ies';
import { ToastService } from '../../../../../core/services/toast';

@Component({
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form implements OnInit {

  nome = '';
  endereco = '';
  telefone = '';
  status: EntityStatus = 'ATIVO';
  id: number | null = null;
  errorMessage = '';
  fieldErrors: Record<string, string> = {};

  constructor(
    private service: IesService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = Number(id);
      this.service.detalhar(this.id).subscribe({
        next: (ies) => {
          this.nome = ies.nome;
          this.endereco = ies.endereco;
          this.telefone = ies.telefone;
          this.status = ies.status;
        },
        error: (error) => this.handleError(error),
      });
    }
  }

  salvar() {
    const payload: IesRequest = {
      nome: this.nome,
      endereco: this.endereco,
      telefone: this.telefone,
      status: this.status,
    };

    const request = this.id ? this.service.atualizar(this.id, payload) : this.service.criar(payload);
    request.subscribe({
      next: () => {
        this.toast.success(this.id ? 'IES atualizada com sucesso.' : 'IES criada com sucesso.');
        this.router.navigate(['/admin/ies']);
      },
      error: (error) => this.handleError(error),
    });
  }

  private handleError(error: BackendError) {
    this.errorMessage = error.message;
    this.fieldErrors = Object.fromEntries((error.errors ?? []).map((item) => [item.field, item.message]));
  }
}