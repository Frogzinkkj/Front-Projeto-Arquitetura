import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { PageResponse } from '../models/paginated-response.model';
import { Disciplina, DisciplinaRequest } from '../../shared/models/disciplina.model';

@Injectable({ providedIn: 'root' })
export class DisciplinaService {

  private readonly api = inject(Api);

  listar(page = 0, size = 10, sort = 'id,desc', filtros: Record<string, unknown> = {}): Observable<PageResponse<Disciplina>> {
    return this.api.list<Disciplina>('/disciplinas', { page, size, sort, ...filtros });
  }

  detalhar(id: number): Observable<Disciplina> {
    return this.api.detail<Disciplina>(`/disciplinas/${id}`);
  }

  criar(payload: DisciplinaRequest): Observable<Disciplina> {
    return this.api.create<Disciplina>('/disciplinas', payload);
  }

  atualizar(id: number, payload: DisciplinaRequest): Observable<Disciplina> {
    return this.api.update<Disciplina>(`/disciplinas/${id}`, payload);
  }

  inativar(id: number): Observable<Disciplina> {
    return this.api.put<Disciplina>(`/disciplinas/${id}/inativar`);
  }
}