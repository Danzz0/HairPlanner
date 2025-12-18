import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importando tipos dos seus arquivos existentes
import { TipoTarefa, StatusTarefa, Tarefa } from '../../models/Tarefa';
import { TarefaService } from '../../servicos/tarefa-service';
import { UsuarioService } from '../../servicos/usuario-service';

interface DiaCalendario {
  dia: number;
  data: Date;
  tarefas: Tarefa[];
  hoje: boolean;
  temTarefa: boolean;
  vazio?: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  // Expor enums para o template
  TipoTarefa = TipoTarefa;
  StatusTarefa = StatusTarefa;
  
  // Estado da aplicação
  pagina: string = 'dashboard';
  mes: number = new Date().getMonth();
  ano: number = new Date().getFullYear();
  tarefas: Tarefa[] = [];
  
  // IDs (simulado - em produção viria do login)
  idUsuario: number = 1;
  
  // Estado do modal
  modalAberto: boolean = false;
  modalEdicaoAberto: boolean = false;
  tipoTarefaSelecionado: TipoTarefa = TipoTarefa.HIDRATACAO;
  dataSelecionadaModal: Date = new Date();
  tarefaEditando: Tarefa | null = null;
  
  // Estado da atividade do dia
  tarefaHoje: Tarefa | null = null;
  
  // Sequência de dias
  sequenciaDias: number = 0;

  constructor(
    private tarefaService: TarefaService,
    private usuarioService: UsuarioService
  ) {}

  // Propriedades computadas para o template
  get proximaTarefa(): Tarefa | null {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const tarefasFuturas = this.tarefas
      .filter(t => t.status === StatusTarefa.PENDENTE && new Date(t.data) >= hoje)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    
    return tarefasFuturas.length > 0 ? tarefasFuturas[0] : null;
  }
  
  get progressoPorcentagem(): number {
    const tarefasConcluidas = this.tarefas.filter(t => t.status === StatusTarefa.CONCLUIDA).length;
    const totalTarefas = this.tarefas.length;
    return totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0;
  }
  
  get tarefasConcluidas(): number {
    return this.tarefas.filter(t => t.status === StatusTarefa.CONCLUIDA).length;
  }
  
  get diasConsecutivos(): number {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    let dias = 0;
    let dataVerificacao = new Date(hoje);
    
    while (true) {
      const temTarefaConfirmada = this.tarefas.some(t => {
        const dataTarefa = new Date(t.data);
        dataTarefa.setHours(0, 0, 0, 0);
        return dataTarefa.getTime() === dataVerificacao.getTime() && 
               t.status === StatusTarefa.CONCLUIDA && 
               t.confirmada;
      });
      
      if (!temTarefaConfirmada) break;
      
      dias++;
      dataVerificacao.setDate(dataVerificacao.getDate() - 1);
      
      if (dias >= 365) break;
    }
    
    return dias;
  }

  ngOnInit(): void {
    this.carregarTarefasUsuario();
    this.carregarSequencia();
  }

  // ============ NAVEGAÇÃO ============
  mostrarPagina(pagina: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.pagina = pagina;
    if (pagina === 'dashboard') {
      this.atualizarTarefaHoje();
    }
  }

  // ============ CARREGAMENTO DE DADOS ============
  carregarTarefasUsuario(): void {
    this.tarefaService.listarTarefasPorUsuario(this.idUsuario).subscribe({
      next: (tarefas) => {
        this.tarefas = tarefas.map(t => ({
          ...t,
          data: new Date(t.data)
        }));
        this.atualizarTarefaHoje();
        this.atualizarSequencia();
      },
      error: (err) => {
        console.error('Erro ao carregar tarefas:', err);
        this.carregarDadosLocal();
      }
    });
  }

  carregarDadosLocal(): void {
    const tarefasSalvas = localStorage.getItem('hairplanner-tarefas');
    if (tarefasSalvas) {
      const tarefasParsed = JSON.parse(tarefasSalvas);
      this.tarefas = tarefasParsed.map((t: any) => ({
        ...t,
        data: new Date(t.data)
      }));
    }
    
    this.atualizarTarefaHoje();
    this.atualizarSequencia();
  }

  salvarDadosLocal(): void {
    localStorage.setItem('hairplanner-tarefas', JSON.stringify(this.tarefas));
  }

  carregarSequencia(): void {
    const sequencia = localStorage.getItem('hairplanner-sequencia');
    if (sequencia) {
      this.sequenciaDias = parseInt(sequencia);
    } else {
      this.sequenciaDias = this.calcularSequenciaAtual();
    }
  }

  // ============ CALENDÁRIO ============
  getMeses(): string[] {
    return ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  }

  get mesAtual(): string {
    const meses = this.getMeses();
    return `${meses[this.mes]} ${this.ano}`;
  }

  get diasCalendario(): DiaCalendario[] {
    const primeiroDia = new Date(this.ano, this.mes, 1);
    const ultimoDia = new Date(this.ano, this.mes + 1, 0);
    const diasVazios = primeiroDia.getDay();
    const totalDias = ultimoDia.getDate();
    
    const dias: DiaCalendario[] = [];
    
    // Dias vazios
    for (let i = 0; i < diasVazios; i++) {
      dias.push({ dia: 0, data: new Date(), tarefas: [], hoje: false, temTarefa: false, vazio: true });
    }
    
    // Dias do mês
    const hoje = new Date();
    const mesmoMes = hoje.getMonth() === this.mes && hoje.getFullYear() === this.ano;
    
    for (let dia = 1; dia <= totalDias; dia++) {
      const data = new Date(this.ano, this.mes, dia);
      const tarefasDoDia = this.tarefas.filter(t => {
        const dataTarefa = new Date(t.data);
        return dataTarefa.getDate() === dia &&
               dataTarefa.getMonth() === this.mes &&
               dataTarefa.getFullYear() === this.ano;
      });
      
      dias.push({
        dia: dia,
        data: data,
        tarefas: tarefasDoDia,
        hoje: mesmoMes && dia === hoje.getDate(),
        temTarefa: tarefasDoDia.length > 0,
        vazio: false
      });
    }
    
    return dias;
  }

  mesAnterior(): void {
    this.mes--;
    if (this.mes < 0) {
      this.mes = 11;
      this.ano--;
    }
  }

  mesProximo(): void {
    this.mes++;
    if (this.mes > 11) {
      this.mes = 0;
      this.ano++;
    }
  }

  irParaHoje(): void {
    const hoje = new Date();
    this.mes = hoje.getMonth();
    this.ano = hoje.getFullYear();
    this.atualizarTarefaHoje();
  }

  getClassesDia(diaInfo: DiaCalendario): string {
    const classes = ['dia-calendario'];
    if (diaInfo.vazio) {
      classes.push('vazio');
    } else {
      if (diaInfo.hoje) {
        classes.push('dia-hoje');
      }
      if (diaInfo.temTarefa) {
        classes.push('dia-com-sessao');
      }
    }
    return classes.join(' ');
  }

  // ============ MANIPULAÇÃO DE TAREFAS ============
  abrirModalTarefa(dia: number): void {
    const data = new Date(this.ano, this.mes, dia);
    this.dataSelecionadaModal = data;
    this.tipoTarefaSelecionado = TipoTarefa.HIDRATACAO;
    this.tarefaEditando = null;
    this.modalAberto = true;
  }

  abrirModalEdicaoTarefa(tarefa: Tarefa, event: MouseEvent): void {
    event.stopPropagation();
    this.tarefaEditando = tarefa;
    this.dataSelecionadaModal = new Date(tarefa.data);
    this.tipoTarefaSelecionado = tarefa.tipo;
    this.modalEdicaoAberto = true;
  }

  selecionarTipoTarefa(tipo: TipoTarefa): void {
    this.tipoTarefaSelecionado = tipo;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.modalEdicaoAberto = false;
    this.tarefaEditando = null;
  }

  salvarTarefa(): void {
    const novaTarefa: Tarefa = {
      data: new Date(this.dataSelecionadaModal),
      tipo: this.tipoTarefaSelecionado,
      descricao: this.getDescricaoPorTipo(this.tipoTarefaSelecionado),
      status: StatusTarefa.PENDENTE,
      pontos: this.getPontosPorTipo(this.tipoTarefaSelecionado),
      idUsuario: this.idUsuario,
      confirmada: false
    };

    this.tarefaService.criarTarefa(novaTarefa).subscribe({
      next: (tarefaCriada) => {
        this.tarefas.push(tarefaCriada);
        this.salvarDadosLocal();
        this.atualizarTarefaHoje();
        this.fecharModal();
        alert('Atividade adicionada com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao criar tarefa:', err);
        // Fallback para localStorage
        novaTarefa.id = Date.now();
        this.tarefas.push(novaTarefa);
        this.salvarDadosLocal();
        this.atualizarTarefaHoje();
        this.fecharModal();
        alert('Atividade adicionada localmente!');
      }
    });
  }

  atualizarTarefa(): void {
    if (!this.tarefaEditando) return;

    const tarefaAtualizada: Tarefa = {
      ...this.tarefaEditando,
      data: new Date(this.dataSelecionadaModal),
      tipo: this.tipoTarefaSelecionado,
      descricao: this.getDescricaoPorTipo(this.tipoTarefaSelecionado),
      pontos: this.getPontosPorTipo(this.tipoTarefaSelecionado)
    };

    if (tarefaAtualizada.id) {
      this.tarefaService.atualizarTarefa(tarefaAtualizada.id, tarefaAtualizada).subscribe({
        next: (tarefaAtualizada) => {
          const index = this.tarefas.findIndex(t => t.id === tarefaAtualizada.id);
          if (index !== -1) {
            this.tarefas[index] = tarefaAtualizada;
          }
          this.salvarDadosLocal();
          this.atualizarTarefaHoje();
          this.fecharModal();
          alert('Atividade atualizada com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao atualizar tarefa:', err);
          const index = this.tarefas.findIndex(t => t.id === this.tarefaEditando?.id);
          if (index !== -1) {
            this.tarefas[index] = tarefaAtualizada;
          }
          this.salvarDadosLocal();
          this.atualizarTarefaHoje();
          this.fecharModal();
          alert('Atividade atualizada localmente!');
        }
      });
    }
  }

  removerTarefa(tarefa: Tarefa, event: MouseEvent): void {
    event.stopPropagation();
    
    if (confirm('Tem certeza que deseja remover esta atividade?')) {
      if (tarefa.id) {
        this.tarefaService.excluirTarefa(tarefa.id).subscribe({
          next: () => {
            this.tarefas = this.tarefas.filter(t => t.id !== tarefa.id);
            this.salvarDadosLocal();
            this.atualizarTarefaHoje();
            alert('Atividade removida com sucesso!');
          },
          error: (err) => {
            console.error('Erro ao remover tarefa:', err);
            this.tarefas = this.tarefas.filter(t => t.id !== tarefa.id);
            this.salvarDadosLocal();
            this.atualizarTarefaHoje();
            alert('Atividade removida localmente!');
          }
        });
      } else {
        this.tarefas = this.tarefas.filter(t => t !== tarefa);
        this.salvarDadosLocal();
        this.atualizarTarefaHoje();
        alert('Atividade removida!');
      }
    }
  }

  // ============ ATIVIDADE DO DIA ============
  atualizarTarefaHoje(): void {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    this.tarefaHoje = this.tarefas.find(t => {
      const dataTarefa = new Date(t.data);
      dataTarefa.setHours(0, 0, 0, 0);
      return dataTarefa.getTime() === hoje.getTime() && 
             t.status === StatusTarefa.PENDENTE;
    }) || null;
  }

  confirmarAtividade(): void {
    if (this.tarefaHoje) {
      const hoje = new Date();
      const tarefaAtualizada: Tarefa = {
        ...this.tarefaHoje,
        status: StatusTarefa.CONCLUIDA,
        confirmada: true,
        dataConfirmacao: hoje
      };

      if (this.tarefaHoje.id) {
        this.tarefaService.atualizarTarefa(this.tarefaHoje.id, tarefaAtualizada).subscribe({
          next: (tarefaAtualizada) => {
            const index = this.tarefas.findIndex(t => t.id === tarefaAtualizada.id);
            if (index !== -1) {
              this.tarefas[index] = tarefaAtualizada;
            }
            this.atualizarSequencia();
            this.salvarDadosLocal();
            alert('Atividade confirmada com sucesso!');
          },
          error: (err) => {
            console.error('Erro ao confirmar atividade:', err);
            const index = this.tarefas.findIndex(t => t.id === this.tarefaHoje?.id);
            if (index !== -1) {
              this.tarefas[index] = tarefaAtualizada;
            }
            this.atualizarSequencia();
            this.salvarDadosLocal();
            alert('Atividade confirmada localmente!');
          }
        });
      }
    }
  }

  // ============ SEQUÊNCIA DE DIAS ============
  atualizarSequencia(): void {
    const sequencia = this.calcularSequenciaAtual();
    this.sequenciaDias = sequencia;
    localStorage.setItem('hairplanner-sequencia', sequencia.toString());
    
    // Atualizar usuário (gamificação)
    this.atualizarGamificacao(sequencia);
  }

  calcularSequenciaAtual(): number {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    let dias = 0;
    let dataVerificacao = new Date(hoje);
    
    while (true) {
      const temTarefaConfirmada = this.tarefas.some(t => {
        const dataTarefa = new Date(t.data);
        dataTarefa.setHours(0, 0, 0, 0);
        return dataTarefa.getTime() === dataVerificacao.getTime() && 
               t.status === StatusTarefa.CONCLUIDA && 
               t.confirmada;
      });
      
      if (!temTarefaConfirmada) break;
      
      dias++;
      dataVerificacao.setDate(dataVerificacao.getDate() - 1);
      
      if (dias >= 365) break;
    }
    
    return dias;
  }

  atualizarGamificacao(sequencia: number): void {
    if (sequencia > 0 && sequencia % 7 === 0) {
      alert(`🎉 Parabéns! Você completou ${sequencia} dias consecutivos!`);
    }
  }

  // ============ UTILITÁRIOS ============
  formatarData(data: Date): string {
    const opcoes: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return data.toLocaleDateString('pt-BR', opcoes);
  }

  get dataHojeFormatada(): string {
    return this.formatarData(new Date());
  }

  traduzirTipoTarefa(tipo: TipoTarefa): string {
    switch(tipo) {
      case TipoTarefa.HIDRATACAO: return 'Hidratação';
      case TipoTarefa.NUTRICAO: return 'Nutrição';
      case TipoTarefa.RECONSTRUCAO: return 'Reconstrução';
      default: return 'Desconhecido';
    }
  }

  getDescricaoPorTipo(tipo: TipoTarefa): string {
    switch(tipo) {
      case TipoTarefa.HIDRATACAO: return 'Sessão de hidratação capilar';
      case TipoTarefa.NUTRICAO: return 'Sessão de nutrição capilar';
      case TipoTarefa.RECONSTRUCAO: return 'Sessão de reconstrução capilar';
      default: return 'Sessão capilar';
    }
  }

  getPontosPorTipo(tipo: TipoTarefa): number {
    switch(tipo) {
      case TipoTarefa.HIDRATACAO: return 10;
      case TipoTarefa.NUTRICAO: return 15;
      case TipoTarefa.RECONSTRUCAO: return 20;
      default: return 5;
    }
  }

  getClasseTipoSessao(tipo: TipoTarefa): string {
    switch(tipo) {
      case TipoTarefa.HIDRATACAO: return 'sessao-hidratacao';
      case TipoTarefa.NUTRICAO: return 'sessao-nutricao';
      case TipoTarefa.RECONSTRUCAO: return 'sessao-reconstrucao';
      default: return '';
    }
  }

  getIconeTipo(tipo: TipoTarefa): string {
    switch(tipo) {
      case TipoTarefa.HIDRATACAO: return 'tint';
      case TipoTarefa.NUTRICAO: return 'seedling';
      case TipoTarefa.RECONSTRUCAO: return 'shield-alt';
      default: return 'question';
    }
  }

  getProgressoOffset(): string {
    const circunferencia = 2 * Math.PI * 36;
    const offset = circunferencia - (this.progressoPorcentagem / 100) * circunferencia;
    return offset.toString();
  }

  getStatusTarefa(tarefa: Tarefa): string {
    if (tarefa.status === StatusTarefa.CONCLUIDA && tarefa.confirmada) {
      return '✓ Confirmada';
    } else if (tarefa.status === StatusTarefa.CONCLUIDA) {
      return 'Concluída';
    } else if (tarefa.status === StatusTarefa.CANCELADA) {
      return 'Cancelada';
    } else {
      return 'Pendente';
    }
  }
}
