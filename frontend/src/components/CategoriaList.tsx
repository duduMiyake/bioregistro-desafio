import { useState, useEffect, FormEvent } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { listarCategorias, criarCategoria, atualizarCategoria, deletarCategoria } from '../services/api'
import { CategoriaDTO } from '../types'

interface CategoriaFormData {
    nome: string
    descricao: string
}

const FORM_INITIAL_STATE: CategoriaFormData = {
    nome: '',
    descricao: ''
}

function CategoriaList() {
    const [categorias, setCategorias] = useState<CategoriaDTO[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [editando, setEditando] = useState<CategoriaDTO | null>(null)
    const [form, setForm] = useState<CategoriaFormData>(FORM_INITIAL_STATE)

    useEffect(() => {
        carregarCategorias()
    }, [])

    const carregarCategorias = async (): Promise<void> => {
        try {
            setLoading(true)
            const response = await listarCategorias()
            setCategorias(response.data)
        } catch (error) {
            console.error('Erro ao carregar categorias:', error)
            toast.error('Erro ao carregar categorias')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()

        try {
            if (editando) {
                await atualizarCategoria(editando.id!, form)
                toast.success('Categoria atualizada!')
            } else {
                await criarCategoria(form)
                toast.success('Categoria criada!')
            }
            fecharModal()
            carregarCategorias()
        } catch (error: unknown) {
            console.error('Erro ao salvar:', error)
            const axiosError = error as { response?: { data?: { erro?: string } } }
            toast.error(axiosError.response?.data?.erro || 'Erro ao salvar categoria')
        }
    }

    const handleEditar = (categoria: CategoriaDTO): void => {
        setEditando(categoria)
        setForm({ nome: categoria.nome, descricao: categoria.descricao || '' })
        setShowModal(true)
    }

    const handleDeletar = async (id: number): Promise<void> => {
        if (!window.confirm('Deseja realmente excluir esta categoria?')) return

        try {
            await deletarCategoria(id)
            toast.success('Categoria excluída!')
            carregarCategorias()
        } catch (error) {
            console.error('Erro ao deletar:', error)
            toast.error('Erro ao excluir categoria. Verifique se não há transações vinculadas.')
        }
    }

    const fecharModal = (): void => {
        setShowModal(false)
        setEditando(null)
        setForm(FORM_INITIAL_STATE)
    }

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                Carregando categorias...
            </div>
        )
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Categorias</h2>
                    <p className="subtitle">{categorias.length} categorias cadastradas</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <FiPlus /> Nova Categoria
                </button>
            </div>

            {categorias.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {categorias.map((cat) => (
                        <div key={cat.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{cat.nome}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        {cat.descricao || 'Sem descrição'}
                                    </p>
                                </div>
                                <div className="actions">
                                    <button className="btn btn-secondary btn-sm" onClick={() => handleEditar(cat)}>
                                        <FiEdit2 />
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeletar(cat.id!)}>
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">🏷️</div>
                    <h3>Nenhuma categoria encontrada</h3>
                    <p>Crie sua primeira categoria clicando no botão acima</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && fecharModal()}>
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{editando ? 'Editar Categoria' : 'Nova Categoria'}</h3>
                            <button className="modal-close" onClick={fecharModal}><FiX /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nome *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ex: Alimentação, Transporte..."
                                    value={form.nome}
                                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                    required
                                    minLength={2}
                                />
                            </div>

                            <div className="form-group">
                                <label>Descrição</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Descrição opcional da categoria"
                                    value={form.descricao}
                                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                                />
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

export default CategoriaList
