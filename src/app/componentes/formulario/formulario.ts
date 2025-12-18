import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators  } from '@angular/forms';
import { Curvatura } from '../../models/Enums';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css',
})



export class Formulario {

  formNameFormulario: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  
  
  curvaturas = Object.values(Curvatura).filter(value => typeof value === 'string'); //obter apenas as strings da enum, sem os indices
  escala = [1, 2, 3, 4, 5];



  constructor (){
    

    this.formNameFormulario = this.fb.group({

      // CAMPOS DO FORMULARIO
      curvatura: ['', Validators.required],
      ressecamento: ['', Validators.required],
      qtdLavagens: ['', Validators.required],
      cuidados: ['', Validators.required]


    })
  }




  enviar() {
    const curvatura = this.formNameFormulario.value.curvatura;
    const ressecamento = this.formNameFormulario.value.ressecamento;
    const qtdLavagens = this.formNameFormulario.value.qtdLavagens;
    const cuidados = this.formNameFormulario.value.cuidados;



    //enviar para o banco de dados
  }




}
