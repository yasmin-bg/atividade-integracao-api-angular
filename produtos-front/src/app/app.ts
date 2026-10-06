import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProdutosService } from './services/produtos.service';
import { Produto } from './models/produto.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  template: `
    <h1>Produtos</h1>
    @if (erro) { <p style="color:red">{{ erro }}</p> }

    <h3>Buscar por ID</h3>
    <input type="number" [(ngModel)]="idBusca" placeholder="ID" />
    <button (click)="buscar()">Buscar</button>
    @if (encontrado) {
      <p>Encontrado: #{{ encontrado.id }} - {{ encontrado.nome }} - {{ encontrado.preco | currency:'BRL' }}</p>
    }

    <h3>Novo produto</h3>
    <input [(ngModel)]="novo.nome" placeholder="Nome" />
    <input type="number" step="0.01" [(ngModel)]="novo.preco" placeholder="Preço" />
    <button (click)="adicionar()">Adicionar</button>

    <h3>Todos os produtos</h3>
    <table border="1" cellpadding="6">
      <tr><th>ID</th><th>Nome</th><th>Preço</th><th>Ações</th></tr>
      @for (p of produtos; track p.id) {
        <tr>
          <td>{{ p.id }}</td>
          @if (editandoId === p.id) {
            <td><input [(ngModel)]="edicao.nome" /></td>
            <td><input type="number" step="0.01" [(ngModel)]="edicao.preco" /></td>
            <td>
              <button (click)="salvar(p.id)">Salvar</button>
              <button (click)="editandoId = null">Cancelar</button>
            </td>
          } @else {
            <td>{{ p.nome }}</td>
            <td>{{ p.preco | currency:'BRL' }}</td>
            <td>
              <button (click)="editar(p)">Editar</button>
              <button (click)="remover(p.id)">Remover</button>
            </td>
          }
        </tr>
      }
    </table>
  `
})
export class App implements OnInit {   // <- mantenha o nome original da sua classe
  produtos: Produto[] = [];
  idBusca: number | null = null;
  encontrado: Produto | null = null;
  novo = { nome: '', preco: 0 };
  editandoId: number | null = null;
  edicao = { nome: '', preco: 0 };
  erro = '';

  constructor(private service: ProdutosService) {}

  ngOnInit() { this.carregar(); }

  private falha = (e: any) => (this.erro = e.error?.mensagem ?? 'Erro ao chamar a API');

  carregar() {
    this.service.listarTodos().subscribe({
      next: r => { this.produtos = r.dados; this.erro = ''; },
      error: this.falha
    });
  }

  buscar() {
    if (this.idBusca == null) return;
    this.service.buscarPorId(this.idBusca).subscribe({
      next: r => { this.encontrado = r.dados; this.erro = ''; },
      error: e => { this.encontrado = null; this.falha(e); }
    });
  }

  adicionar() {
    this.service.criar(this.novo).subscribe({
      next: () => { this.novo = { nome: '', preco: 0 }; this.erro = ''; this.carregar(); },
      error: this.falha
    });
  }

  editar(p: Produto) {
    this.editandoId = p.id;
    this.edicao = { nome: p.nome, preco: p.preco };
  }

  salvar(id: number) {
    this.service.atualizar(id, this.edicao).subscribe({
      next: () => { this.editandoId = null; this.erro = ''; this.carregar(); },
      error: this.falha
    });
  }

  remover(id: number) {
    this.service.remover(id).subscribe({
      next: () => { this.erro = ''; this.carregar(); },
      error: this.falha
    });
  }
}