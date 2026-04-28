import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { Escola, EscolaRequest } from '../../shared/models/escola.model';
import { PageResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class EscolaService {

  private readonly api = inject(Api);

  listar(page = 0, size = 10, sort = 'id,desc', filtros: Record<string, unknown> = {}): Observable<PageResponse<Escola>> {
    return this.api.list<Escola>('/escolas', { page, size, sort, ...filtros });
  }

  detalhar(id: number): Observable<Escola> {
    return this.api.detail<Escola>(`/escolas/${id}`);
  }

  criar(payload: EscolaRequest): Observable<Escola> {
    return this.api.create<Escola>('/escolas', payload);
  }

  atualizar(id: number, payload: EscolaRequest): Observable<Escola> {
    return this.api.update<Escola>(`/escolas/${id}`, payload);
  }

  inativar(id: number): Observable<Escola> {
    return this.api.put<Escola>(`/escolas/${id}/inativar`);
  }
}