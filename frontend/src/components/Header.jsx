import React from 'react';
import { Search, Download, Rocket, Settings } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search anything here..." 
          className="search-input"
        />
      </div>
      
      <div className="header-actions">
        <button className="icon-btn">
          <Download size={20} />
        </button>
        <button className="icon-btn">
          <Rocket size={20} />
        </button>
        <button className="icon-btn">
          <Settings size={20} />
        </button>
        
        <div className="user-profile">
          <div className="avatar">
            <img src="https://ui-avatars.com/api/?name=User&background=f97316&color=fff" alt="User Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
