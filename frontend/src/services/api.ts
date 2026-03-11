import axios, { AxiosResponse } from 'axios';
import { TransacaoDTO, CategoriaDTO, ResumoFinanceiroDTO } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// === Transações ===

export const listarTransacoes = (): Promise<AxiosResponse<TransacaoDTO[]>> => {
    return api.get('/transacao');
};

export const buscarTransacao = (id: number): Promise<AxiosResponse<TransacaoDTO>> => {
    return api.get(`/transacao/${id}`);
};

export const criarTransacao = (transacao: Omit<TransacaoDTO, 'id' | 'categoriaNome'>): Promise<AxiosResponse<TransacaoDTO>> => {
    return api.post('/transacao', transacao);
};

export const atualizarTransacao = (id: number, transacao: Omit<TransacaoDTO, 'id' | 'categoriaNome'>): Promise<AxiosResponse<TransacaoDTO>> => {
    return api.put(`/transacao/${id}`, transacao);
};

export const deletarTransacao = (id: number): Promise<AxiosResponse<void>> => {
    return api.delete(`/transacao/${id}`);
};

export const listarTransacoesPorPeriodo = (dataInicio: string, dataFim: string): Promise<AxiosResponse<TransacaoDTO[]>> => {
    return api.get(`/transacao/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`);
};

export const listarTransacoesPorCategoria = (categoriaId: number): Promise<AxiosResponse<TransacaoDTO[]>> => {
    return api.get(`/transacao/categoria/${categoriaId}`);
};

export const obterResumoFinanceiro = (): Promise<AxiosResponse<ResumoFinanceiroDTO>> => {
    return api.get('/transacao/resumo');
};

// === Categorias ===

export const listarCategorias = (): Promise<AxiosResponse<CategoriaDTO[]>> => {
    return api.get('/categorias');
};

export const criarCategoria = (categoria: Omit<CategoriaDTO, 'id'>): Promise<AxiosResponse<CategoriaDTO>> => {
    return api.post('/categorias', categoria);
};

export const atualizarCategoria = (id: number, categoria: Omit<CategoriaDTO, 'id'>): Promise<AxiosResponse<CategoriaDTO>> => {
    return api.put(`/categorias/${id}`, categoria);
};

export const deletarCategoria = (id: number): Promise<AxiosResponse<void>> => {
    return api.delete(`/categorias/${id}`);
};

export default api;
