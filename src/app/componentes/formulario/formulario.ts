import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css',
})
export class Formulario {
  curvaturas = ['Liso', 'Ondulado', 'Cacheado', 'Crespo'];
  escala = [1, 2, 3, 4, 5];

  form = {
    curvatura: '',
    ressecamento: 0,
    lavagens: 0,
    cuidado: 0,
  };

  selecionarCurvatura(valor: string) {
    this.form.curvatura = valor;
  }

  selecionarRessecamento(valor: number) {
    this.form.ressecamento = valor;
  }

  selecionarLavagens(valor: number) {
    this.form.lavagens = valor;
  }

  selecionarCuidado(valor: number) {
    this.form.cuidado = valor;
  }

  enviar() {
    console.log('Dados do formulário:', this.form);
  }
}
