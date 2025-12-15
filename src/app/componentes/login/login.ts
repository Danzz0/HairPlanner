import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div style="padding: 40px; text-align: center;">
      <h1>Login</h1>
      <p>Página de login em desenvolvimento.</p>
      <button (click)="voltarParaHome()" style="padding: 10px 20px; margin-top: 20px;">
        Voltar para Home
      </button>
    </div>
  `
})
export class Login {
  constructor(private roteador: Router) {}

  voltarParaHome() {
    this.roteador.navigate(['/']);
  }
}