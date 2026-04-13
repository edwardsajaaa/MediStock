import React, { useState, useEffect } from 'react';
import { fetchLedger } from '../api';
import { Clock, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const Ledger = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchLedger().then(data => setTransactions(data || []));
  }, []);

  return (
    <div className="flex-col gap-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Kartu Stok (Ledger)</h1>
        <p className="text-muted">Riwayat mutasi keluar masuk barang</p>
      </div>

      <div className="card">
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead style={{borderBottom: '1px solid var(--border-color)', textAlign: 'left'}}>
            <tr>
              <th className="py-2 text-sm text-muted">Arah</th>
              <th className="py-2 text-sm text-muted">Waktu</th>
              <th className="py-2 text-sm text-muted">Detail Barang Mutasi</th>
              <th className="py-2 text-sm text-muted text-right">Nilai Mutasi</th>
              <th className="py-2 text-sm text-muted">Catatan</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(trx => (
              <tr key={trx.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div style={{background: trx.type === 'IN' ? '#ecfdf5' : '#fef2f2', padding: '0.5rem', borderRadius: '0.25rem'}}>
                      {trx.type === 'IN' ? <ArrowDownRight size={18} color="#10b981" /> : <ArrowUpRight size={18} color="#ef4444" />}
                    </div>
                    <span className="font-bold" style={{color: trx.type === 'IN' ? '#10b981' : '#ef4444'}}>{trx.type}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Clock size={14} className="text-muted" />
                    <span>{new Date(trx.date).toLocaleString()}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="text-sm">
                    {trx.items && trx.items.map((item, idxx) => (
                      <div key={idxx} style={{borderBottom: idxx < trx.items.length - 1 ? '1px dashed #e2e8f0' : 'none', padding: '2px 0'}}>
                        <span className="font-semibold">{item.qty}x</span> {item.item?.name} 
                        <span className="text-muted text-xs ml-2">(Batch: {item.batch?.batch_number})</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-4 text-right font-medium text-main">Rp {trx.total_amount.toLocaleString()}</td>
                <td className="py-4 text-sm text-muted italic">{trx.notes || '-'}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-muted">Belum ada riwayat mutasi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ledger;
