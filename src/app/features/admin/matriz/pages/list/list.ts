import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TableComponent, TableColumn } from '../../../../../shared/components/table/table';
import { Matriz } from '../../../../../shared/models/matriz.model';
import { MatrizService } from '../../../../../core/services/matriz';
import { ToastService } from '../../../../../core/services/toast';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TableComponent],
  templateUrl: './list.html',
})
export class List implements OnInit {

  matrizes: Matriz[] = [];
  columns: TableColumn[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'descricao', label: 'Descrição' },
    { key: 'cursoSigla', label: 'Curso' },
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
    private service: MatrizService,
    private router: Router,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.errorMessage = '';

    this.service.listar(this.page, this.size, 'id,desc', this.filtroStatus ? { status: this.filtroStatus } : {}).subscribe({
      next: (response) => {
        this.matrizes = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message ?? 'Não foi possível carregar matrizes.';
        this.loading = false;
      },
    });
  }

  aplicarFiltro() {
    this.page = 0;
    this.carregar();
    this.toast.info('Filtros aplicados para matrizes.');
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
    this.router.navigate(['/admin/matriz/form', id]);
  }

  inativar(id: number) {
    this.service.inativar(id).subscribe({
      next: () => {
        this.toast.success('Matriz inativada com sucesso.');
        this.carregar();
      },
      error: (error) => {
        this.errorMessage = error.message ?? 'Não foi possível inativar a matriz.';
      },
    });
  }
}