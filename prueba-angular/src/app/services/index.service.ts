import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  uri: String = environment.base_url;
  token: String = environment.token;

  public httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*'
    })
  };

  options: any = null

  constructor(
    private http: HttpClient
  ) {
    this.options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
        'Content-Type': 'application/json'
      })
    }
  }

  /* 
    Funciones HTTPClient
    Peticion GET para traer todos los usuarios
    Versión 0.1
    Autor: Victor Vivas
  */
  getUsers() : Observable<any>{
    return this.http.get<any>(this.uri+'/users', this.options);
  }
  
  /* 
    Funciones HTTPClient
    Peticion GET para traer un usuario por medio de un parametro el cual es el id
    Versión 0.1
    Autor: Victor Vivas
  */
  getUser(id: number) : Observable<any>{
    return this.http.get<any>(this.uri+'/users/' + id, this.options);
  }

  /* 
    Funciones HTTPClient
    Peticion POST para registrar datos
    Versión 0.1
    Autor: Victor Vivas
  */  
  postUser(user: User) : Observable<any>{
    return this.http.post<any>(this.uri+'/users', user, this.options);
  }

  /* 
    Funciones HTTPClient
    Peticion PUT para modificar datos de un registro
    Versión 0.1
    Autor: Victor Vivas
  */  
 putUser(user: User) : Observable<any>{
   return this.http.put<any>(this.uri+'/users/'+user.id, user, this.options);
  }
  
  /* 
    Funciones HTTPClient
    Peticion DELETE para eliminar registros
    Versión 0.1
    Autor: Victor Vivas
  */  
  delUser(id: number) : Observable<any>{
    return this.http.delete<any>(this.uri+'/users/'+id, this.options);
  }
}
