export enum TipoTransacao {
    RECEITA = 'RECEITA',
    DESPESA = 'DESPESA',
}

export interface CategoriaDTO {
    id?: number;
    nome: string;
    descricao?: string;
}

export interface TransacaoDTO {
    id?: number;
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    data: string;
    categoriaId?: number | null;
    categoriaNome?: string | null;
}

export interface ResumoFinanceiroDTO {
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
    quantidadeTransacoes: number;
}

export interface TransacaoFormData {
    descricao: string;
    valor: string;
    tipo: TipoTransacao;
    data: string;
    categoriaId: string;
}

export interface ApiError {
    erro: string;
    status: number;
}
