
import { Questionario } from "./Questionario";

export class Usuario {
    
    private _nome: string;
    private _dataDeNasc: Date;
    private _email: string;
    private _cep: string;
    private _fone: string;

    private _questionario: Questionario;

    constructor (nome:string, daNascimento:Date, email:string, cep:string, telefone:string, questionario: Questionario) {
        this._nome = nome;
        this._dataDeNasc = daNascimento;
        this._email = email;
        this._cep = cep;
        this._fone = telefone;
        this._questionario = questionario
    }



    // GETTERS
    get getNome():string{
        return this._nome;
    }
    get getNascimento():Date{
        return this._dataDeNasc;
    }
    get getEmail():string{
        return this._email;
    }
    get getCep():string{
        return this._cep;
    }
    get getFone():string{
        return this._fone;
    }
    get getQuestionario():Questionario{
        return this._questionario;
    }



    //SETTERS
    set setNome(valor: string) {
        this._nome = valor;
    }
    set setNascimento(valor: Date) {
        this._dataDeNasc = valor;
    }
    set setEmail(valor: string) {
        this._nome = valor;
    }
    set setCep(valor: string) {
        this._email = valor;
    }
    set setFone(valor: string) {
        this._fone = valor;
    }


}