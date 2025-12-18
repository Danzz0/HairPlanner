import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators  } from '@angular/forms';
import { Curvatura } from '../../models/Enums';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css',
})



export class Formulario {

  formNameFormulario: FormGroup;

  fb: FormBuilder = inject(FormBuilder);
  
  constructor (){
    this.formNameFormulario = this.fb.group({

      // CAMPOS DO FORMULARIO
      cruvatura: ['', Validators.required],
      ressecamento: ['', Validators.required],
      qtdLavagens: ['', Validators.required],
      cuidados: ['', Validators.required]


    })
  }
/*

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
  }*/
}
