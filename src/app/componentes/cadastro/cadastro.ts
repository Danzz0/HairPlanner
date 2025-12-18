import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../models/Usuario';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicos/usuario-service';


@Component({
  selector: 'app-cadastro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {


  formNameCadastro: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  fs: UsuarioService = inject(UsuarioService);
  loading: boolean = false;




  constructor(private roteador: Router) {
    this.formNameCadastro = this.fb.group({

      // CAMPOS DO FORMULARIO
      NoUsuario: ['', Validators.required],
      Email: ['', Validators.required],
      DaNascimento: ['', Validators.required],
      Cep: ['', Validators.required],
      Telefone: ['', Validators.required],
      Senha: ['', Validators.required],

    });

  }



  fazerCadastro() {
    console.log('Cadastro:', this.formNameCadastro.value);

    this.loading = true;
    const usuario: Usuario = this.formNameCadastro.value;

    // envia os dados para o banco
    this.fs.criarUsuario(usuario).subscribe({
      next: (usuario) => {
        console.log('Usuário cadastrado com sucesso:', usuario);
        this.loading = false;
      },
      error: (error) => {
        console.error('erro ao cadastrar usuário', error);
        this.loading = false;
      }
    });


    // após isso, vai para dashboard
    this.navegarParaFormulario();
  }





  navegarParaLogin() {
    this.roteador.navigate(['/login']);
  }


  navegarParaDashboard() {
    this.roteador.navigate(['/dashboard']);
  }


  navegarParaFormulario() {
    this.roteador.navigate(['/formulario']);
  }



}