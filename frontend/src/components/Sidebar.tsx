import { FiHome, FiDollarSign, FiTag, FiTrendingUp } from 'react-icons/fi'

type Page = 'dashboard' | 'transacoes' | 'categorias'

interface SidebarProps {
    currentPage: Page
    onNavigate: (page: Page) => void
    isOpen: boolean
}

interface MenuItem {
    id: Page
    label: string
    icon: React.ReactNode
}

function Sidebar({ currentPage, onNavigate, isOpen }: SidebarProps) {
    const menuItems: MenuItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
        { id: 'transacoes', label: 'Transações', icon: <FiDollarSign /> },
        { id: 'categorias', label: 'Categorias', icon: <FiTag /> },
    ]

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
            <div className="sidebar-logo">
                <div className="logo-icon">
                    <FiTrendingUp />
                </div>
                <h1>FinTrack</h1>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar
