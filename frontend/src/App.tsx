import { useState } from 'react'
import { FiMenu } from 'react-icons/fi'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import TransacaoList from './components/TransacaoList'
import CategoriaList from './components/CategoriaList'

type Page = 'dashboard' | 'transacoes' | 'categorias'

function App() {
    const [currentPage, setCurrentPage] = useState<Page>('dashboard')
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

    const handleNavigate = (page: Page) => {
        setCurrentPage(page)
        setIsSidebarOpen(false)
    }

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
            <Sidebar
                currentPage={currentPage}
                onNavigate={handleNavigate}
                isOpen={isSidebarOpen}
            />
            <main className="main-content">
                <button
                    type="button"
                    className="mobile-menu-btn"
                    onClick={() => setIsSidebarOpen((prev) => !prev)}
                >
                    <FiMenu />
                    <span>Menu</span>
                </button>
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
