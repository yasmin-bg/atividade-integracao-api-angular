export interface Produto {
  id: number;
  nome: string;
  preco: number;
}

export interface ApiResponse<T> {
  sucesso: boolean;
  dados: T;
  mensagem: string | null;
}