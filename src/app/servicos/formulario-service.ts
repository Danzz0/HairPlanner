import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/Usuario';
import { Questionario } from '../models/Questionario';

@Injectable({
  providedIn: 'root',
})
export class FormularioService {
  private apiUrl = 'http://localhost:3000/usuario';
  private http = inject(HttpClient);

  adicionarQuestionario(questionario: Questionario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/questionario`, questionario);
  }

  
}
