import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators  } from '@angular/forms';
import { Curvatura } from '../../models/Enums';
import { Questionario } from '../../models/Questionario';
import { FormularioService } from '../../servicos/formulario-service';
import { UsuarioService } from '../../servicos/usuario-service';
import { ActivatedRoute, Router } from '@angular/router';

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
  fs: FormularioService = inject(FormularioService);
  fsUser: UsuarioService = inject(UsuarioService);
  curvaturas = Object.values(Curvatura).filter(value => typeof value === 'string'); //obter apenas as strings da enum, sem os indices
  escala = [1, 2, 3, 4, 5];




  constructor (private roteador: Router){
    

    this.formNameFormulario = this.fb.group({

      // CAMPOS DO FORMULARIO
      Curvatura: ['', Validators.required],
      NivelRessecamento: ['', Validators.required],
      QtdLavagens: ['', Validators.required],
      EscalaCuidado: ['', Validators.required]


    })
  }





  //chama o serviço para enviar o questionário
  enviarQuestionario() {
    
    const questionario: Questionario = this.formNameFormulario.value;


    this.fs.adicionarQuestionario(questionario).subscribe({
      next: (questionario) => {
        console.log('Questionário registrado com sucesso!', questionario);
      },
      error: (error) => {
        console.error('Erro ao enviar questionário:', error);
      }
    });
    
    this.navegarParaDashboard();

  }


  navegarParaDashboard() {
    this.roteador.navigate(['/dashboard']);
  }


}
