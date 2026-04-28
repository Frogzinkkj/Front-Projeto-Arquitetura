import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { PageResponse } from '../models/paginated-response.model';
import { Curso, CursoRequest } from '../../shared/models/curso.model';

@Injectable({ providedIn: 'root' })
export class CursoService {

  private readonly api = inject(Api);

  listar(page = 0, size = 10, sort = 'id,desc', filtros: Record<string, unknown> = {}): Observable<PageResponse<Curso>> {
    return this.api.list<Curso>('/cursos', { page, size, sort, ...filtros });
  }

  detalhar(id: number): Observable<Curso> {
    return this.api.detail<Curso>(`/cursos/${id}`);
  }

  criar(payload: CursoRequest): Observable<Curso> {
    return this.api.create<Curso>('/cursos', payload);
  }

  atualizar(id: number, payload: CursoRequest): Observable<Curso> {
    return this.api.update<Curso>(`/cursos/${id}`, payload);
  }

  inativar(id: number): Observable<Curso> {
    return this.api.put<Curso>(`/cursos/${id}/inativar`);
  }
}
