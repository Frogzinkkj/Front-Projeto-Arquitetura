import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../../../shared/components/table/table';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CursoService } from '../../../../../core/services/curso';
import { Curso } from '../../../../../shared/models/curso.model';
import { TableColumn } from '../../../../../shared/components/table/table';
import { ToastService } from '../../../../../core/services/toast';

@Component({
  standalone: true,
  imports: [CommonModule, TableComponent, RouterModule, FormsModule],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class List implements OnInit {

  cursos: Curso[] = [];
  columns: TableColumn[] = [
    { key: 'sigla', label: 'Sigla' },
    { key: 'descricao', label: 'Descrição' },
    { key: 'escolaNome', label: 'Escola' },
    { key: 'turno', label: 'Turno' },
    { key: 'status', label: 'Status' },
  ];
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  filtroStatus = '';
  filtroTurno = '';
  loading = false;
  errorMessage = '';

  constructor(
    private service: CursoService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.errorMessage = '';

    this.service.listar(this.page, this.size, 'id,desc', {
      ...(this.filtroStatus ? { status: this.filtroStatus } : {}),
      ...(this.filtroTurno ? { turno: this.filtroTurno } : {}),
    }).subscribe({
      next: (response) => {
        this.cursos = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message ?? 'Não foi possível carregar cursos.';
        this.loading = false;
      },
    });
  }

  aplicarFiltro() {
    this.page = 0;
    this.carregar();
    this.toast.info('Filtros aplicados para cursos.');
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
    this.router.navigate(['/admin/curso/form', id]);
  }

  inativar(id: number) {
    this.service.inativar(id).subscribe({
      next: () => {
        this.toast.success('Curso inativado com sucesso.');
        this.carregar();
      },
      error: (error) => {
        this.errorMessage = error.message ?? 'Não foi possível inativar o curso.';
      },
    });
  }
}
