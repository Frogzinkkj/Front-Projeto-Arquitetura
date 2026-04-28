import { EntityStatus } from './domain.enums';

export interface Disciplina {
  id: number;
  sigla: string;
  descricao: string;
  cargaHoraria: number;
  status: EntityStatus;
  escolaId: number;
  escolaNome?: string;
}

export interface DisciplinaRequest {
  sigla: string;
  descricao: string;
  cargaHoraria: number;
  status: EntityStatus;
  escolaId: number;
}