import { CursoTurno, EntityStatus } from './domain.enums';

export interface Curso {
  id: number;
  sigla: string;
  descricao: string;
  coordenador: string;
  turno: CursoTurno;
  status: EntityStatus;
  escolaId: number;
  escolaNome?: string;
}

export interface CursoRequest {
  sigla: string;
  descricao: string;
  coordenador: string;
  turno: CursoTurno;
  status: EntityStatus;
  escolaId: number;
}