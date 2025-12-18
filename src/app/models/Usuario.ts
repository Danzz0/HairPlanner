import { Questionario } from "./Questionario";

export class Usuario {
    private _id?: number;
    private _nome: string;
    private _email: string;
    private _senha: string;
    private _dataDeNasc: Date;
    private _cep: string;
    private _fone: string;
    private _pontos: number;
    private _sequenciaAtual: number;
    private _nivel: number;
    private _questionario?: Questionario;

    constructor (
        nome: string, 
        dataNascimento: Date, 
        email: string, 
        senha: string,
        cep: string, 
        telefone: string, 
        pontos: number = 0,
        sequenciaAtual: number = 0,
        nivel: number = 1,
        questionario?: Questionario,
        id?: number
    ) {
        this._nome = nome;
        this._email = email;
        this._senha = senha;
        this._dataDeNasc = dataNascimento;
        this._cep = cep;
        this._fone = telefone;
        this._pontos = pontos;
        this._sequenciaAtual = sequenciaAtual;
        this._nivel = nivel;
        
        if (questionario) {
            this._questionario = questionario;
        }
        
        if (id) {
            this._id = id;
        }
    }

    // GETTERS
    get id(): number | undefined {
        return this._id;
    }

    get getNome(): string {
        return this._nome;
    }

    get getEmail(): string {
        return this._email;
    }

    get getSenha(): string {
        return this._senha;
    }

    get getNascimento(): Date {
        return this._dataDeNasc;
    }

    get getCep(): string {
        return this._cep;
    }

    get getFone(): string {
        return this._fone;
    }

    get getPontos(): number {
        return this._pontos;
    }

    get getSequenciaAtual(): number {
        return this._sequenciaAtual;
    }

    get getNivel(): number {
        return this._nivel;
    }

    get getQuestionario(): Questionario | undefined {
        return this._questionario;
    }

    // SETTERS
    set setNome(valor: string) {
        this._nome = valor;
    }

    set setEmail(valor: string) {
        this._email = valor;
    }

    set setSenha(valor: string) {
        this._senha = valor;
    }

    set setNascimento(valor: Date) {
        this._dataDeNasc = valor;
    }

    set setCep(valor: string) {
        this._cep = valor;
    }

    set setFone(valor: string) {
        this._fone = valor;
    }

    set setPontos(valor: number) {
        this._pontos = valor;
    }

    set setSequenciaAtual(valor: number) {
        this._sequenciaAtual = valor;
    }

    set setNivel(valor: number) {
        this._nivel = valor;
    }

    set setQuestionario(valor: Questionario | undefined) {
        this._questionario = valor;
    }

    // Métodos de gamificação
    adicionarPontos(pontos: number): void {
        this._pontos += pontos;
        this.verificarNivel();
        this.salvarDados();
    }

    incrementarSequencia(): void {
        this._sequenciaAtual++;
        this.salvarSequencia();
        
        // Bônus por sequência
        if (this._sequenciaAtual % 7 === 0) {
            this.adicionarPontos(50); // Bônus semanal
            console.log(`🎉 Bônus semanal! ${this._sequenciaAtual} dias consecutivos!`);
        }
    }

    resetarSequencia(): void {
        this._sequenciaAtual = 0;
        this.salvarSequencia();
    }

    private verificarNivel(): void {
        const nivelAnterior = this._nivel;
        this._nivel = Math.floor(this._pontos / 100) + 1;
        
        if (this._nivel > nivelAnterior) {
            console.log(`Parabéns! Você subiu para o nível ${this._nivel}!`);
        }
    }

    private salvarSequencia(): void {
        // Salvar no localStorage
        if (this._id) {
            localStorage.setItem(`usuario-${this._id}-sequencia`, this._sequenciaAtual.toString());
        }
        localStorage.setItem('usuario-sequencia-atual', this._sequenciaAtual.toString());
    }

    private salvarDados(): void {
        // Salvar dados do usuário no localStorage
        const usuarioData = {
            id: this._id,
            nome: this._nome,
            email: this._email,
            pontos: this._pontos,
            sequenciaAtual: this._sequenciaAtual,
            nivel: this._nivel
        };
        localStorage.setItem('usuario-dados', JSON.stringify(usuarioData));
    }

    // Método estático para carregar sequência
    static carregarSequencia(): number {
        const sequencia = localStorage.getItem('usuario-sequencia-atual');
        return sequencia ? parseInt(sequencia) : 0;
    }

    // Método estático para salvar sequência
    static salvarSequenciaGlobal(sequencia: number): void {
        localStorage.setItem('usuario-sequencia-atual', sequencia.toString());
    }
}
