import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../../../shared/components/table/table';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EscolaService } from '../../../../../core/services/escola';
import { Router } from '@angular/router';
import { Escola } from '../../../../../shared/models/escola.model';
import { TableColumn } from '../../../../../shared/components/table/table';
import { ToastService } from '../../../../../core/services/toast';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, TableComponent, RouterModule, FormsModule],
  templateUrl: './list.html',
})
export class List implements OnInit {

  escolas: Escola[] = [];
  columns: TableColumn[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'coordenador', label: 'Coordenador' },
    { key: 'iesNome', label: 'IES' },
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
    private service: EscolaService,
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
        this.escolas = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message ?? 'Não foi possível carregar escolas.';
        this.loading = false;
      },
    });
  }

  aplicarFiltro() {
    this.page = 0;
    this.carregar();
    this.toast.info('Filtros aplicados para escolas.');
  }

  proximaPagina() {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.carregar();
    }
  }

  paginaAnterior() {
    if (this.page > 0) {
      this.page--;
      this.carregar();
    }
  }

  editar(id: number) {
    this.router.navigate(['/admin/escola/form', id]);
  }

  inativar(id: number) {
    this.service.inativar(id).subscribe({
      next: () => {
        this.toast.success('Escola inativada com sucesso.');
        this.carregar();
      },
      error: (error) => {
        this.errorMessage = error.message ?? 'Não foi possível inativar a escola.';
      },
    });
  }
}