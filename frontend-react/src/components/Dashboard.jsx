import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';
import ChartWidget from './ChartWidget';
import StockTrendChart from './StockTrendChart';
import SessionRoleChart from './SessionRoleChart';
import CategoryRadarChart from './CategoryRadarChart';
import SupplierDonutChart from './SupplierDonutChart';
import { fetchDashboardStats } from '../api';
import './Dashboard.css';
import { AlertCircle, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardStats().then(data => setStats(data)).catch(console.error);
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="text-2xl font-bold">Dashboard Overview Farmasi</h1>
        <div className="header-actions">
          <button className="btn btn-outline hover:bg-gray-50 flex items-center gap-2">Data Refresh {stats ? '✔' : '...'}</button>
          <button className="btn btn-primary shadow hover:-translate-y-1 transition-transform">Laporan Bulanan</button>
        </div>
      </div>
      
      <div className="dashboard-content mt-6">
        <div className="kpi-grid" style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <MetricCard 
            title="Total Jenis Barang" 
            value={stats ? stats.metrics.total_items : "..."} 
            change="" 
            isPositive={true} 
            comparisonText="Katalog aktif obat & alkes" 
          />
          <MetricCard 
            title="Sistem Peringatan (Kritis/Low)" 
            value={stats ? stats.metrics.low_stock_count : "..."} 
            change="Action Needed" 
            isPositive={false} 
            comparisonText="Segera lakukan proses restok" 
            type="danger"
          />
          <MetricCard 
            title="Siaga Kadaluarsa (Expiry)" 
            value={stats ? stats.metrics.expiring_count : "..."} 
            change="Next 3 Months" 
            isPositive={false} 
            comparisonText="Barang butuh perlakuan khusus" 
            type="warning"
          />
          <MetricCard 
            title="Total Mutasi Hari Ini" 
            value={stats ? stats.metrics.today_transactions : "..."} 
            change={<span style={{color: 'var(--success-text)'}}>Live</span>} 
            isPositive={true} 
            comparisonText="Akumulasi IN & OUT" 
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Smart Alerts Sections */}
          <div className="card shadow-md border-0 ring-1 ring-gray-100" style={{background: 'linear-gradient(to bottom right, #fff, #fef2f2)'}}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-danger">
              <AlertCircle size={20} /> Low Stock Alerts
            </h2>
            {stats && stats.alerts.low_stock.length > 0 ? (
              <ul style={{listStyle: 'none'}}>
                {stats.alerts.low_stock.map((al, idx) => (
                  <li key={idx} className="flex justify-between items-center py-2 border-b border-red-100" style={{borderColor: '#fee2e2'}}>
                    <span className="font-semibold text-gray-800">{al.item_name}</span>
                    <span className="badge badge-danger">Sisa: {al.current_qty} (Min: {al.min_stock})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">Semua stok barang dalam batas aman.</p>
            )}
          </div>

          <div className="card shadow-md border-0 ring-1 ring-warning-100" style={{background: 'linear-gradient(to bottom right, #fff, #fffbeb)'}}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{color: '#d97706'}}>
              <AlertTriangle size={20} /> Expiry Alerts (FEFO)
            </h2>
            {stats && stats.alerts.expiring.length > 0 ? (
              <ul style={{listStyle: 'none'}}>
                {stats.alerts.expiring.map((al, idx) => (
                  <li key={idx} className="flex justify-between items-center py-2 border-b" style={{borderColor: '#fef3c7'}}>
                    <div>
                      <div className="font-semibold text-gray-800">{al.item_name}</div>
                      <div className="text-xs text-muted">Batch: {al.batch_number} (Qty: {al.quantity})</div>
                    </div>
                    <span className="text-sm font-bold" style={{color: '#d97706'}}>Exp: {al.expiry_date}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">Tidak ada barang yang mendekati batas kadaluarsa.</p>
            )}
          </div>
        </div>

        {/* Existing Charts Grid untuk Visual */}
        <div className="charts-grid-top">
          <ChartWidget title="Tren Nilai Stok Masuk & Keluar">
            <StockTrendChart />
          </ChartWidget>
          <ChartWidget title="Distribusi Kategori Produk">
            <SessionRoleChart />
          </ChartWidget>
        </div>

        <div className="charts-grid-bottom mt-6">
          <ChartWidget title="Analisis Radar Penjualan">
            <CategoryRadarChart />
          </ChartWidget>
          <ChartWidget title="Kontribusi Stok dari Supplier Utama">
            <SupplierDonutChart />
          </ChartWidget>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
