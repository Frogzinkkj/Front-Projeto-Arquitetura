import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { PageResponse } from '../models/paginated-response.model';
import { Matriz, MatrizDisciplinaRequest, MatrizRequest } from '../../shared/models/matriz.model';

@Injectable({ providedIn: 'root' })
export class MatrizService {

  private readonly api = inject(Api);

  listar(page = 0, size = 10, sort = 'id,desc', filtros: Record<string, unknown> = {}): Observable<PageResponse<Matriz>> {
    return this.api.list<Matriz>('/matrizes', { page, size, sort, ...filtros });
  }

  detalhar(id: number): Observable<Matriz> {
    return this.api.detail<Matriz>(`/matrizes/${id}`);
  }

  criar(payload: MatrizRequest): Observable<Matriz> {
    return this.api.create<Matriz>('/matrizes', payload);
  }

  atualizar(id: number, payload: MatrizRequest): Observable<Matriz> {
    return this.api.update<Matriz>(`/matrizes/${id}`, payload);
  }

  inativar(id: number): Observable<Matriz> {
    return this.api.put<Matriz>(`/matrizes/${id}/inativar`);
  }

  associarDisciplina(id: number, payload: MatrizDisciplinaRequest): Observable<Matriz> {
    return this.api.create<Matriz>(`/matrizes/${id}/disciplinas`, payload);
  }
}