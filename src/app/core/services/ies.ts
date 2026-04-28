import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { PageResponse } from '../models/paginated-response.model';
import { Ies, IesRequest } from '../../shared/models/ies.model';

@Injectable({ providedIn: 'root' })
export class IesService {

  private readonly api = inject(Api);

  listar(page = 0, size = 10, sort = 'id,desc', filtros: Record<string, unknown> = {}): Observable<PageResponse<Ies>> {
    return this.api.list<Ies>('/ies', { page, size, sort, ...filtros });
  }

  detalhar(id: number): Observable<Ies> {
    return this.api.detail<Ies>(`/ies/${id}`);
  }

  criar(payload: IesRequest): Observable<Ies> {
    return this.api.create<Ies>('/ies', payload);
  }

  atualizar(id: number, payload: IesRequest): Observable<Ies> {
    return this.api.update<Ies>(`/ies/${id}`, payload);
  }

  inativar(id: number): Observable<Ies> {
    return this.api.patch<Ies>(`/ies/${id}/inativar`);
  }
}