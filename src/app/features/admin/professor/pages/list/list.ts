import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../../../shared/components/table/table';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProfessorService } from '../../../../../core/services/professor';
import { Professor } from '../../../../../shared/models/professor.model';
import { TableColumn } from '../../../../../shared/components/table/table';
import { ToastService } from '../../../../../core/services/toast';

@Component({
  standalone: true,
  imports: [CommonModule, TableComponent, RouterModule, FormsModule],
  templateUrl: './list.html'
})
export class List implements OnInit {

  professores: Professor[] = [];
  columns: TableColumn[] = [
    { key: 'matricula', label: 'Matrícula' },
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'escolaNome', label: 'Escola' },
    { key: 'status', label: 'Status' },
  ];
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  filtroStatus = '';
  loading = false;
  errorMessage = '';

  constructor(
    private service: ProfessorService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.errorMessage = '';

    this.service.listar(this.page, this.size, 'id,desc', this.filtroStatus ? { status: this.filtroStatus } : {}).subscribe({
      next: (response) => {
        this.professores = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message ?? 'Não foi possível carregar professores.';
        this.loading = false;
      },
    });
  }

  aplicarFiltro() {
    this.page = 0;
    this.carregar();
    this.toast.info('Filtros aplicados para professores.');
  }

  paginaAnterior() {
    if (this.page > 0) {
      this.page--;
      this.carregar();
    }
  }

  proximaPagina() {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.carregar();
    }
  }

  editar(id: number) {
    this.router.navigate(['/admin/professor/form', id]);
  }

  inativar(id: number) {
    this.service.inativar(id).subscribe({
      next: () => {
        this.toast.success('Professor inativado com sucesso.');
        this.carregar();
      },
      error: (error) => {
        this.errorMessage = error.message ?? 'Não foi possível inativar o professor.';
      },
    });
  }
}