import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PizzeriaApiService {
  private apiUrl = 'http://127.0.0.1:5000/api/pizzeria/';

  constructor(private http: HttpClient) {}

  public getPedidos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  public registrarPedido(datos: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, datos);
  }

  public modificarPedido(id: number, datos: any): Observable<any> {
    return this.http.put<any>(this.apiUrl + id, datos);
  }

  public eliminarPedido(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + id);
  }
}