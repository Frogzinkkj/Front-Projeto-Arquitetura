import { EntityStatus } from './domain.enums';

export interface Professor {
  id: number;
  matricula: string;
  nome: string;
  email: string;
  telefone: string;
  titulacao: string;
  status: EntityStatus;
  escolaId: number;
  escolaNome?: string;
}

export interface ProfessorRequest {
  matricula: string;
  nome: string;
  email: string;
  telefone: string;
  titulacao: string;
  status: EntityStatus;
  escolaId: number;
}