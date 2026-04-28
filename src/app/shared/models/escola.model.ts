import { EntityStatus } from './domain.enums';

export interface Escola {
  id: number;
  nome: string;
  coordenador: string;
  status: EntityStatus;
  iesId: number;
  iesNome?: string;
}

export interface EscolaRequest {
  nome: string;
  coordenador: string;
  status: EntityStatus;
  iesId: number;
}