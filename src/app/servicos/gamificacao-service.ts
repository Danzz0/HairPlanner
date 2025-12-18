import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RankingItem {
  posicao: number;
  nome: string;
  pontos: number;
  nivel: number;
  sequenciaAtual: number;
}

export interface EstatisticasUsuario {
  totalTarefas: number;
  tarefasConcluidas: number;
  taxaConclusao: number;
  diasConsecutivos: number;
  melhorSequencia: number;
  pontosSemana: number;
  nivel: number;
  ranking: number;
}

@Injectable({
  providedIn: 'root',
})
export class GamificacaoService {
  private apiUrl = 'http://localhost:3000';
  private http = inject(HttpClient);

  obterRankingGlobal(): Observable<RankingItem[]> {
    return this.http.get<RankingItem[]>(`${this.apiUrl}/ranking`);
  }

  obterEstatisticasUsuario(idUsuario: number): Observable<EstatisticasUsuario> {
    return this.http.get<EstatisticasUsuario>(`${this.apiUrl}/estatisticas/${idUsuario}`);
  }
}