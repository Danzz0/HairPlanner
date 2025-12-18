import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/usuario';
  private http = inject(HttpClient);


  criarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  obterUsuarioPorId(idUsuario: number): Observable<Usuario> {
    const url = `${this.apiUrl}/${idUsuario}`;
    return this.http.get<Usuario>(url);
  }  

/*
  atualizarUsuario(idUsuario: number): Observable<Usuario> {
    const url = `${this.apiUrl}/${idUsuario}`;
    return this.http.put<Usuario>(url);
  }
*/


  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

/*
  obterIdUsuario(): Observable<number> {
    const url = `${this.apiUrl}/final_id`;
    return this.http.get<number>(url);
  }
*/

}

