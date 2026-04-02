import React, { useState, useEffect } from 'react';
import { Plus, Search, Archive } from 'lucide-react';
import { fetchItems, createItem } from '../api';

const Items = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: 'Obat Bebas', sku: '', min_stock: 0, base_price: 0, sell_price: 0
  });

  const loadItems = async () => {
    try {
      const data = await fetchItems();
      setItems(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Parse int/float
      const data = {
        ...formData,
        min_stock: parseInt(formData.min_stock),
        base_price: parseFloat(formData.base_price),
        sell_price: parseFloat(formData.sell_price),
      };
      await createItem(data);
      setShowForm(false);
      loadItems();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Master Data</h1>
          <p className="text-muted">Kelola data obat dan alat kesehatan</p>
        </div>
        <button className="btn btn-primary gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
          {showForm ? 'Batal Tambah' : 'Tambah Baru'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6" style={{ animation: 'fadeIn 0.2s ease-in' }}>
          <h2 className="text-lg font-semibold mb-4">Tambah Data Baru</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nama Item</label>
              <input required type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Kategori</label>
              <select className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="Obat Bebas">Obat Bebas</option>
                <option value="Obat Resep">Obat Resep</option>
                <option value="Alkes">Alat Kesehatan</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">SKU / Kode unik</label>
              <input required type="text" className="input" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Min Stock (Alert)</label>
              <input type="number" className="input" value={formData.min_stock} onChange={e => setFormData({...formData, min_stock: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Harga Beli Dasar</label>
              <input type="number" className="input" value={formData.base_price} onChange={e => setFormData({...formData, base_price: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Harga Jual</label>
              <input type="number" className="input" value={formData.sell_price} onChange={e => setFormData({...formData, sell_price: e.target.value})} />
            </div>
            <div className="col-span-2 flex justify-end mt-4">
              <button type="submit" className="btn btn-primary">Simpan Item</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2" style={{transform: 'translateY(-50%)', color: 'var(--text-light)'}} size={18} />
            <input type="text" placeholder="Cari item..." className="input" style={{paddingLeft: '2.5rem', width: '300px'}} />
          </div>
        </div>
        
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead style={{borderBottom: '1px solid var(--border-color)', textAlign: 'left'}}>
            <tr>
              <th className="py-2 text-sm text-muted font-semibold">SKU</th>
              <th className="py-2 text-sm text-muted font-semibold">Nama Item</th>
              <th className="py-2 text-sm text-muted font-semibold">Kategori</th>
              <th className="py-2 text-sm text-muted font-semibold text-right">Stok Aktif</th>
              <th className="py-2 text-sm text-muted font-semibold text-right">Harga Jual</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                <td className="py-3 font-medium">{item.sku}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div style={{background: 'var(--bg-color)', padding: '0.5rem', borderRadius: '0.25rem'}}>
                      <Archive size={16} className="text-primary" />
                    </div>
                    <span className="font-semibold">{item.name}</span>
                  </div>
                </td>
                <td className="py-3">
                  <span className={`badge ${item.category === 'Alkes' ? 'badge-primary' : (item.category === 'Obat Resep' ? 'badge-danger' : 'badge-success')}`}
                        style={{backgroundColor: item.category === 'Obat Resep' ? '#fee2e2' : item.category === 'Alkes' ? '#e0f2fe' : '', color: item.category === 'Obat Resep' ? '#991b1b' : item.category === 'Alkes' ? '#0369a1' : ''}}>
                    {item.category}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <span className={`font-semibold ${item.total_stock <= item.min_stock && item.total_stock > 0 ? 'text-primary' : item.total_stock === 0 ? 'text-danger' : ''}`} style={{color: item.total_stock === 0 ? 'red': ''}}>
                    {item.total_stock}
                  </span>
                </td>
                <td className="py-3 text-right font-medium text-primary">Rp {item.sell_price.toLocaleString()}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-muted">Belum ada data barang</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Items;
