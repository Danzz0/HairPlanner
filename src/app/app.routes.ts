import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./componentes/home/home').then(m => m.Home)
  },
  {
    path: 'login',
    loadComponent: () => import('./componentes/login/login').then(m => m.Login)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./componentes/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: '**',
    redirectTo: ''
  }
];