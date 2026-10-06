import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto, ApiResponse } from '../models/produto.model';

@Injectable({ providedIn: 'root' })
export class ProdutosService {
  private apiUrl = 'http://localhost:5027/api/Produtos';
  constructor(private http: HttpClient) {}

  listarTodos(): Observable<ApiResponse<Produto[]>> {
    return this.http.get<ApiResponse<Produto[]>>(this.apiUrl);
  }
  buscarPorId(id: number): Observable<ApiResponse<Produto>> {
    return this.http.get<ApiResponse<Produto>>(`${this.apiUrl}/${id}`);
  }
  criar(p: { nome: string; preco: number }): Observable<ApiResponse<Produto>> {
    return this.http.post<ApiResponse<Produto>>(this.apiUrl, p);
  }
  atualizar(id: number, p: { nome: string; preco: number }): Observable<ApiResponse<Produto>> {
    return this.http.put<ApiResponse<Produto>>(`${this.apiUrl}/${id}`, p);
  }
  remover(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }
}