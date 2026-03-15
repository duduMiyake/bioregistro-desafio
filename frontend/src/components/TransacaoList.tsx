import { useState, useEffect, FormEvent } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import {
    listarTransacoes,
    criarTransacao,
    atualizarTransacao,
    deletarTransacao,
    listarCategorias
} from '../services/api'
import { TransacaoDTO, CategoriaDTO, TransacaoFormData, TipoTransacao } from '../types'

const FORM_INITIAL_STATE: TransacaoFormData = {
    descricao: '',
    valor: '',
    tipo: TipoTransacao.DESPESA,
    data: '',
    categoriaId: ''
}

function TransacaoList() {
    const [transacoes, setTransacoes] = useState<TransacaoDTO[]>([])
    const [categorias, setCategorias] = useState<CategoriaDTO[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [editando, setEditando] = useState<TransacaoDTO | null>(null)
    const [filtroCategoria, setFiltroCategoria] = useState<string>('')
    const [filtroDataInicio, setFiltroDataInicio] = useState<string>('')
    const [filtroDataFim, setFiltroDataFim] = useState<string>('')
    const [paginaAtual, setPaginaAtual] = useState<number>(0)
    const [itensPorPagina, setItensPorPagina] = useState<number>(10)

    const [form, setForm] = useState<TransacaoFormData>(FORM_INITIAL_STATE)

    useEffect(() => {
        carregarDados()
    }, [])

    useEffect(() => {
        setPaginaAtual(0)
    }, [filtroCategoria, filtroDataInicio, filtroDataFim, itensPorPagina])

    const carregarDados = async (): Promise<void> => {
        try {
            setLoading(true)
            const [transacoesRes, categoriasRes] = await Promise.all([
                listarTransacoes(),
                listarCategorias()
            ])
            setTransacoes(transacoesRes.data)
            setCategorias(categoriasRes.data)
        } catch (error) {
            console.error('Erro ao carregar dados:', error)
            toast.error('Erro ao carregar transações')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()

        try {
            const dados = {
                descricao: form.descricao,
                valor: parseFloat(form.valor),
                tipo: form.tipo,
                data: form.data,
                categoriaId: form.categoriaId ? parseInt(form.categoriaId) : null
            }

            if (editando) {
                await atualizarTransacao(editando.id!, dados)
                toast.success('Transação atualizada!')
            } else {
                const response = await criarTransacao(dados)
                transacoes.push(response.data)
                setTransacoes(transacoes)
            }

            fecharModal()
            carregarDados()
        } catch (error: unknown) {
            console.error('Erro ao salvar:', error)
            const axiosError = error as { response?: { data?: { erro?: string } } }
            toast.error(axiosError.response?.data?.erro || 'Erro ao salvar transação')
        }
    }

    const handleEditar = (transacao: TransacaoDTO): void => {
        setEditando(transacao)
        setForm({
            descricao: transacao.descricao,
            valor: transacao.valor.toString(),
            tipo: transacao.tipo,
            data: transacao.data,
            categoriaId: transacao.categoriaId?.toString() || ''
        })
        setShowModal(true)
    }

    const handleDeletar = async (id: number): Promise<void> => {
        if (!window.confirm('Deseja realmente excluir esta transação?')) return

        try {
            await deletarTransacao(id)
            toast.success('Transação excluída!')
            carregarDados()
        } catch (error) {
            console.error('Erro ao deletar:', error)
            toast.error('Erro ao excluir transação')
        }
    }

    const fecharModal = (): void => {
        setShowModal(false)
        setEditando(null)
        setForm(FORM_INITIAL_STATE)
    }

    const formatarMoeda = (valor: number): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0)
    }

    const transacoesFiltradas: TransacaoDTO[] = transacoes.filter(t => {
        if (filtroCategoria && t.categoriaId?.toString() !== filtroCategoria) return false
        if (filtroDataInicio && t.data < filtroDataInicio) return false
        if (filtroDataFim && t.data > filtroDataFim) return false
        return true
    })

    const totalPaginas = Math.ceil(transacoesFiltradas.length / itensPorPagina)

    useEffect(() => {
        if (totalPaginas > 0 && paginaAtual > totalPaginas - 1) {
            setPaginaAtual(totalPaginas - 1)
        }
    }, [paginaAtual, totalPaginas])

    const indiceInicial = paginaAtual * itensPorPagina
    const indiceFinal = indiceInicial + itensPorPagina

    const transacoesPaginadas = transacoesFiltradas.slice(indiceInicial, indiceFinal)

    const totalElementos = transacoesFiltradas.length
    const inicioAtual = totalElementos === 0 ? 0 : indiceInicial + 1
    const fimAtual = Math.min(indiceFinal, totalElementos)

    const limparFiltros = (): void => {
        setFiltroCategoria('')
        setFiltroDataInicio('')
        setFiltroDataFim('')
    }

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                Carregando transações...
            </div>
        )
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Transações</h2>
                    <p className="subtitle">{transacoes.length} transações registradas</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <FiPlus /> Nova Transação
                </button>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="form-group">
                    <label>Categoria</label>
                    <select
                        className="form-control"
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                    >
                        <option value="">Todas</option>
                        {categorias.map(c => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Data Início</label>
                    <input
                        type="date"
                        className="form-control"
                        value={filtroDataInicio}
                        onChange={(e) => setFiltroDataInicio(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Data Fim</label>
                    <input
                        type="date"
                        className="form-control"
                        value={filtroDataFim}
                        onChange={(e) => setFiltroDataFim(e.target.value)}
                    />
                </div>
                {(filtroCategoria || filtroDataInicio || filtroDataFim) && (
                    <button className="btn btn-secondary btn-sm" onClick={limparFiltros} style={{ marginBottom: '2px' }}>
                        <FiX /> Limpar
                    </button>
                )}
            </div>

            {/* Table */}
            {transacoesFiltradas.length > 0 ? (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th>Valor</th>
                                <th>Tipo</th>
                                <th>Data</th>
                                <th>Categoria</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transacoesPaginadas.map((t) => (
                                <tr key={t.id}>
                                    <td>{t.descricao}</td>
                                    <td style={{ fontWeight: 600 }}>
                                        {formatarMoeda(t.valor)}
                                    </td>
                                    <td>
                                        <span className={`badge ${t.tipo === 'RECEITA' ? 'badge-receita' : 'badge-despesa'}`}>
                                            {t.tipo}
                                        </span>
                                    </td>
                                    <td>{new Date(t.data).toLocaleDateString('pt-BR')}</td>
                                    <td>
                                        <span className="badge badge-categoria">
                                            {t.categoriaNome || 'Sem categoria'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions">
                                            <button className="btn btn-secondary btn-sm" onClick={() => handleEditar(t)}>
                                                <FiEdit2 />
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeletar(t.id!)}>
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">💸</div>
                    <h3>Nenhuma transação encontrada</h3>
                    <p>Adicione sua primeira transação clicando no botão acima</p>
                </div>
            )}

            {transacoesFiltradas.length > 0 && (
                <div className="pagination">
                    <div className="pagination-left">
                        <div className="pagination-page-size">
                            <label htmlFor="itensPorPagina">Itens por página</label>
                            <select
                                id="itensPorPagina"
                                className="form-control pagination-select"
                                value={itensPorPagina}
                                onChange={(e) => setItensPorPagina(Number(e.target.value))}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        <div className="pagination-info">
                            Mostrando {inicioAtual} a {fimAtual} de {totalElementos} transações
                        </div>
                    </div>

                    <div className="pagination-controls">
                        <button
                            className="pagination-btn"
                            onClick={() => setPaginaAtual(0)}
                            disabled={paginaAtual === 0}
                        >
                            «
                        </button>

                        <button
                            className="pagination-btn"
                            onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 0))}
                            disabled={paginaAtual === 0}
                        >
                            ‹
                        </button>

                        {Array.from({ length: totalPaginas }, (_, index) => (
                            <button
                                key={index}
                                className={`pagination-btn ${paginaAtual === index ? 'active' : ''}`}
                                onClick={() => setPaginaAtual(index)}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            className="pagination-btn"
                            onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas - 1))}
                            disabled={paginaAtual >= totalPaginas - 1}
                        >
                            ›
                        </button>

                        <button
                            className="pagination-btn"
                            onClick={() => setPaginaAtual(totalPaginas - 1)}
                            disabled={paginaAtual >= totalPaginas - 1 || totalPaginas === 0}
                        >
                            »
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && fecharModal()}>
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{editando ? 'Editar Transação' : 'Nova Transação'}</h3>
                            <button className="modal-close" onClick={fecharModal}><FiX /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Descrição *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ex: Supermercado, Salário..."
                                    value={form.descricao}
                                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                                    required
                                    minLength={3}
                                />
                            </div>

                            <div className="form-group">
                                <label>Valor *</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0.01"
                                    value={form.valor}
                                    onChange={(e) => setForm({ ...form, valor: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Tipo *</label>
                                <select
                                    className="form-control"
                                    value={form.tipo}
                                    onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoTransacao })}
                                    required
                                >
                                    <option value={TipoTransacao.DESPESA}>Despesa</option>
                                    <option value={TipoTransacao.RECEITA}>Receita</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Data *</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={form.data}
                                    onChange={(e) => setForm({ ...form, data: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Categoria</label>
                                <select
                                    className="form-control"
                                    value={form.categoriaId}
                                    onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categorias.map(c => (
                                        <option key={c.id} value={c.id}>{c.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={fecharModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editando ? 'Atualizar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TransacaoList
