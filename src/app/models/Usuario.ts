
import { Questionario } from "./Questionario";

export class Usuario {
    
    private _nome: string;
    private _email: string;
    private _dataDeNasc: Date;
    private _cep: string;
    private _fone: string;

    private _questionario?: Questionario;

    constructor (nome:string, daNascimento:Date, email:string, cep:string, telefone:string, questionario?: Questionario) {
        this._nome = nome;
        this._email = email;
        this._dataDeNasc = daNascimento;
        this._cep = cep;
        this._fone = telefone;

        if (questionario){
            this._questionario = questionario;
        }
    }



    // GETTERS
    get getNome():string{
        return this._nome;
    }
    get getEmail():string{
        return this._email;
    }
    get getNascimento():Date{
        return this._dataDeNasc;
    }
    get getCep():string{
        return this._cep;
    }
    get getFone():string{
        return this._fone;
    }
    get getQuestionario():Questionario | undefined{
        return this._questionario;
    }



    //SETTERS
    set setNome(valor: string) {
        this._nome = valor;
    }
    set setEmail(valor: string) {
        this._nome = valor;
    }
    set setNascimento(valor: Date) {
        this._dataDeNasc = valor;
    }
    set setCep(valor: string) {
        this._email = valor;
    }
    set setFone(valor: string) {
        this._fone = valor;
    }


}