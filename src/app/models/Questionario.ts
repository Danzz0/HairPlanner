import { Curvatura } from "./Enums";


export class Questionario {
    private _curvatura: Curvatura;
    private _ressecamento: number; // 1-5
    private _lavagens: number; // 1-5
    private _cuidado: number // 1-5


    constructor(curvatura: Curvatura, ressecamento:number, lavagens: number, cuidado: number){
        this._curvatura = curvatura;
        this._ressecamento = ressecamento;
        this._lavagens = lavagens;
        this._cuidado = cuidado;
    }
}

