import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import TransacaoList from './components/TransacaoList'
import CategoriaList from './components/CategoriaList'

type Page = 'dashboard' | 'transacoes' | 'categorias'

function App() {
    const [currentPage, setCurrentPage] = useState<Page>('dashboard')

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />
            case 'transacoes':
                return <TransacaoList />
            case 'categorias':
                return <CategoriaList />
            default:
                return <Dashboard />
        }
    }

    return (
        <div className="app-container">
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
            <main className="main-content">
                {renderPage()}
            </main>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="dark"
            />
        </div>
    )
}

export default App
