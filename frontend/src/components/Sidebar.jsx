import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Receipt, 
  ScrollText, 
  Bell, 
  BarChart3, 
  PlaySquare, 
  MessageSquare, 
  Info,
  ChevronRight,
  ShieldPlus
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <ShieldPlus className="logo-icon" size={24} />
        <h2>MediStock</h2>
        <div className="menu-trigger">≡</div>
      </div>
      
      <div className="sidebar-scroll">
        <div className="menu-group">
          <div className="menu-label">MAIN MENU</div>
          <Link to="/" className={`menu-item ${location.pathname === '/' ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          
          <Link to="/items" className={`menu-item ${location.pathname === '/items' ? 'active' : ''}`}>
            <Database size={20} />
            <span>Master Data</span>
          </Link>
          
          <Link to="/transactions" className={`menu-item ${location.pathname === '/transactions' ? 'active' : ''}`}>
            <Receipt size={20} />
            <span>Transaksi</span>
          </Link>
          
          <Link to="/ledger" className={`menu-item ${location.pathname === '/ledger' ? 'active' : ''}`}>
            <ScrollText size={20} />
            <span>Kartu Stok Digital</span>
          </Link>
          
          <div className="menu-item has-submenu">
            <div className="submenu-title">
              <Bell size={20} />
              <span>Smart Alerts</span>
            </div>
            <ChevronRight size={16} className="chevron" />
          </div>
          
          <div className="menu-item has-submenu">
            <div className="submenu-title">
              <BarChart3 size={20} />
              <span>Reporting</span>
            </div>
            <ChevronRight size={16} className="chevron" />
          </div>
        </div>
        
        <div className="divider"></div>
        
        <div className="menu-group">
          <div className="menu-item toggle-item">
            <div className="flex items-center gap-3">
              <PlaySquare size={20} color="var(--text-muted)" />
              <span>Training Mode</span>
            </div>
            <div className="toggle-switch active"></div>
          </div>
          <a href="#" className="menu-item">
            <MessageSquare size={20} />
            <span>Feedback</span>
          </a>
          <a href="#" className="menu-item">
            <Info size={20} />
            <span>Aktivitas Log</span>
          </a>
        </div>
      </div>
      
      <div className="premium-banner">
        <div className="banner-icon-bg">
          <ScrollText size={16} color="var(--primary-color)" />
        </div>
        <p>Aktifkan pelacakan real-time untuk validasi stok yang lebih akurat dan pelaporan yang lebih baik.</p>
        <button className="btn-upgrade">Tingkatkan Sekarang</button>
      </div>
    </aside>
  );
};

export default Sidebar;
