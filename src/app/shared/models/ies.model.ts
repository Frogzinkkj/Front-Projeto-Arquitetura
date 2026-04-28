import { EntityStatus } from './domain.enums';

export interface Ies {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  status: EntityStatus;
}

export interface IesRequest {
  nome: string;
  endereco: string;
  telefone: string;
  status: EntityStatus;
}