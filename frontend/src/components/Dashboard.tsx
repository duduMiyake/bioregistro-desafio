import { useState, useEffect } from 'react'
import { FiArrowUpCircle, FiArrowDownCircle, FiActivity } from 'react-icons/fi'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { obterResumoFinanceiro, listarTransacoes } from '../services/api'
import { ResumoFinanceiroDTO, TransacaoDTO } from '../types'

const COLORS: string[] = ['#00b894', '#ff6b6b', '#6c5ce7', '#fdcb6e', '#00cec9', '#e17055']

interface DadoGraficoPizza {
    name: string
    value: number
}

interface DadoGraficoBarras {
    mes: string
    receitas: number
    despesas: number
}

function Dashboard() {
    const [resumo, setResumo] = useState<ResumoFinanceiroDTO | null>(null)
    const [transacoes, setTransacoes] = useState<TransacaoDTO[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        carregarDados()
    }, [])

    const carregarDados = async (): Promise<void> => {
        try {
            setLoading(true)
            const [resumoRes, transacoesRes] = await Promise.all([
                obterResumoFinanceiro(),
                listarTransacoes()
            ])
            setResumo(resumoRes.data)
            setTransacoes(transacoesRes.data)
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatarMoeda = (valor: number | undefined): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0)
    }

    const getDadosGraficoPizza = (): DadoGraficoPizza[] => {
        if (!transacoes.length) return []

        const porCategoria = transacoes
            .filter(t => t.tipo === 'DESPESA')
            .reduce<Record<string, number>>((acc, t) => {
                const cat = t.categoriaNome || 'Sem categoria'
                acc[cat] = (acc[cat] || 0) + t.valor
                return acc
            }, {})

        return Object.entries(porCategoria).map(([name, value]) => ({ name, value }))
    }

    const getDadosGraficoBarras = (): DadoGraficoBarras[] => {
        if (!transacoes.length) return []

        const porMes = transacoes.reduce<Record<string, DadoGraficoBarras>>((acc, t) => {
            const mes = t.data?.substring(0, 7) || 'N/A'
            if (!acc[mes]) acc[mes] = { mes, receitas: 0, despesas: 0 }
            if (t.tipo === 'RECEITA') {
                acc[mes].receitas += t.valor
            } else {
                acc[mes].despesas += t.valor
            }
            return acc
        }, {})

        return Object.values(porMes).sort((a, b) => a.mes.localeCompare(b.mes))
    }

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                Carregando dashboard...
            </div>
        )
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Dashboard</h2>
                    <p className="subtitle">Visão geral das suas finanças</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="summary-card receitas">
                    <span className="card-icon"><FiArrowUpCircle /></span>
                    <div className="card-label">Receitas</div>
                    <div className="card-value">{formatarMoeda(resumo?.totalReceitas)}</div>
                </div>

                <div className="summary-card despesas">
                    <span className="card-icon"><FiArrowDownCircle /></span>
                    <div className="card-label">Despesas</div>
                    <div className="card-value">{formatarMoeda(resumo?.totalDespesas)}</div>
                </div>

                <div className="summary-card saldo">
                    <span className="card-icon"><FiActivity /></span>
                    <div className="card-label">Saldo</div>
                    <div className="card-value">{formatarMoeda(resumo?.saldo)}</div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <div className="chart-container">
                    <h3>Despesas por Categoria</h3>
                    {getDadosGraficoPizza().length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={getDadosGraficoPizza()}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }: { name: string; percent: number }) =>
                                        `${name} (${(percent * 100).toFixed(0)}%)`
                                    }
                                >
                                    {getDadosGraficoPizza().map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatarMoeda(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-state">
                            <p>Sem dados de despesas</p>
                        </div>
                    )}
                </div>

                <div className="chart-container">
                    <h3>Receitas vs Despesas por Mês</h3>
                    {getDadosGraficoBarras().length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={getDadosGraficoBarras()}>
                                <XAxis dataKey="mes" stroke="#9898b8" />
                                <YAxis stroke="#9898b8" />
                                <Tooltip formatter={(value: number) => formatarMoeda(value)} />
                                <Bar dataKey="receitas" fill="#00b894" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="despesas" fill="#ff6b6b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-state">
                            <p>Sem dados de transações</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="chart-container" style={{ marginTop: '0' }}>
                <h3>Últimas Transações</h3>
                {transacoes.length > 0 ? (
                    <div className="table-container" style={{ border: 'none' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Descrição</th>
                                    <th>Valor</th>
                                    <th>Tipo</th>
                                    <th>Data</th>
                                    <th>Categoria</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transacoes.slice(0, 5).map((t) => (
                                    <tr key={t.id}>
                                        <td>{t.descricao}</td>
                                        <td>{formatarMoeda(t.valor)}</td>
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📊</div>
                        <h3>Sem transações</h3>
                        <p>Adicione sua primeira transação para visualizar o dashboard</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
