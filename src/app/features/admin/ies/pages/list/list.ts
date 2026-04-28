import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TableComponent, TableColumn } from '../../../../../shared/components/table/table';
import { Ies } from '../../../../../shared/models/ies.model';
import { IesService } from '../../../../../core/services/ies';
import { ToastService } from '../../../../../core/services/toast';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TableComponent],
  templateUrl: './list.html',
})
export class List implements OnInit {

  iesList: Ies[] = [];
  columns: TableColumn[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'endereco', label: 'Endereço' },
    { key: 'telefone', label: 'Telefone' },
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
    private service: IesService,
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
        this.iesList = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message ?? 'Não foi possível carregar IES.';
        this.loading = false;
      },
    });
  }

  aplicarFiltro() {
    this.page = 0;
    this.carregar();
    this.toast.info('Filtros aplicados para IES.');
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
    this.router.navigate(['/admin/ies/form', id]);
  }

  inativar(id: number) {
    this.service.inativar(id).subscribe({
      next: () => {
        this.toast.success('IES inativada com sucesso.');
        this.carregar();
      },
      error: (error) => {
        this.errorMessage = error.message ?? 'Não foi possível inativar a IES.';
      },
    });
  }
}