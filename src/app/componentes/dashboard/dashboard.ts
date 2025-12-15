import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div style="padding: 40px; text-align: center;">
      <h1>Dashboard</h1>
      <p>Página do dashboard em desenvolvimento.</p>
      <button (click)="voltarParaLogin()" style="padding: 10px 20px; margin-top: 20px;">
        Voltar para Login
      </button>
    </div>
  `
})
export class Dashboard {
  constructor(private roteador: Router) {}

  voltarParaLogin() {
    this.roteador.navigate(['/login']);
  }
}