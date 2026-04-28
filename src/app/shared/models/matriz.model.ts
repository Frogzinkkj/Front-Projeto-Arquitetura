import { EntityStatus } from './domain.enums';

export interface Matriz {
  id: number;
  nome: string;
  descricao: string;
  status: EntityStatus;
  cursoId: number;
  cursoSigla?: string;
  disciplinas?: MatrizDisciplina[];
}

export interface MatrizRequest {
  nome: string;
  descricao: string;
  status: EntityStatus;
  cursoId: number;
}

export interface MatrizDisciplina {
  disciplinaId: number;
  preRequisitoId?: number | null;
}

export interface MatrizDisciplinaRequest {
  disciplinaId: number;
  preRequisitoId?: number | null;
}