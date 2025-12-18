export enum TipoTarefa {
  HIDRATACAO = 'HIDRATACAO',
  NUTRICAO = 'NUTRICAO',
  RECONSTRUCAO = 'RECONSTRUCAO'
}

export enum StatusTarefa {
  PENDENTE = 'PENDENTE',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA'
}

export interface Tarefa {
  id?: number;
  data: Date;
  tipo: TipoTarefa;
  descricao: string;
  status: StatusTarefa;
  pontos: number;
  observacoes?: string;
  idUsuario: number;
  confirmada?: boolean; // Nova propriedade
  dataConfirmacao?: Date; // Nova propriedade
}
