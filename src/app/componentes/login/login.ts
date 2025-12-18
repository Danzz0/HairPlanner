import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../models/Usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {

  formNameLogin: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  modoCadastro = false;
  private usuario: Usuario = {} as Usuario;


  constructor (private roteador: Router) {
    this.formNameLogin = this.fb.group({

      // CAMPOS DO FORMULARIO
      email: ['', Validators.required],
      senha: ['', Validators.required]
    })
  }






  fazerLogin() {
    const email = this.formNameLogin.value.email;
    const senha = this.formNameLogin.value.senha;
    console.log('Login:', email, senha);


    // lógica de autenticação aqui

    // Se o login for bem-sucedido, navegue para o dashboard
    //this.roteador.navigate(['/dashboard']);
  }


  navegarParaCadastro() {
    this.roteador.navigate(['/cadastro']);
  }

}
