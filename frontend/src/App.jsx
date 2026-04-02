import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

import Items from './pages/Items';
import Transactions from './pages/Transactions';
import Ledger from './pages/Ledger';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/items" element={<Items />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/ledger" element={<Ledger />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
