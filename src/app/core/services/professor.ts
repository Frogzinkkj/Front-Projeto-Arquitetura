import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { PageResponse } from '../models/paginated-response.model';
import { Professor, ProfessorRequest } from '../../shared/models/professor.model';

@Injectable({ providedIn: 'root' })
export class ProfessorService {

  private readonly api = inject(Api);

  listar(page = 0, size = 10, sort = 'id,desc', filtros: Record<string, unknown> = {}): Observable<PageResponse<Professor>> {
    return this.api.list<Professor>('/professores', { page, size, sort, ...filtros });
  }

  detalhar(id: number): Observable<Professor> {
    return this.api.detail<Professor>(`/professores/${id}`);
  }

  criar(payload: ProfessorRequest): Observable<Professor> {
    return this.api.create<Professor>('/professores', payload);
  }

  atualizar(id: number, payload: ProfessorRequest): Observable<Professor> {
    return this.api.update<Professor>(`/professores/${id}`, payload);
  }

  inativar(id: number): Observable<Professor> {
    return this.api.put<Professor>(`/professores/${id}/inativar`);
  }
}