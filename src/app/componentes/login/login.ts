import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  modoCadastro = false;

  login = {
    email: '',
    senha: '',
  };

  cadastro = {
    nome: '',
    email: '',
    senha: '',
  };

  alternarModo() {
    this.modoCadastro = !this.modoCadastro;
  }

  fazerLogin() {
    console.log('Login:', this.login);
  }

  fazerCadastro() {
    console.log('Cadastro:', this.cadastro);
  }
}
