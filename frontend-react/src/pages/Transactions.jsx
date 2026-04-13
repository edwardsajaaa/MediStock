import React, { useState, useEffect } from 'react';
import { fetchItems, createTransaction } from '../api';
import { ArrowDownRight, ArrowUpRight, Plus, Trash2 } from 'lucide-react';

const Transactions = () => {
  const [items, setItems] = useState([]);
  const [type, setType] = useState('OUT');
  const [notes, setNotes] = useState('');
  const [cart, setCart] = useState([]);
  
  // temporary form for adding to cart
  const [selectedItem, setSelectedItem] = useState('');
  const [qty, setQty] = useState('');
  const [batchNum, setBatchNum] = useState('');
  const [expiry, setExpiry] = useState('');

  useEffect(() => {
    fetchItems().then(data => setItems(data || []));
  }, []);

  const addToCart = () => {
    if(!selectedItem || !qty) return;
    const item = items.find(i => i.id === parseInt(selectedItem));
    
    // For OUT, price is sell_price, for IN price is base_price (can be overridden)
    const price = type === 'OUT' ? item.sell_price : item.base_price;
    
    setCart([...cart, {
      item_id: item.id,
      name: item.name,
      qty: parseInt(qty),
      price: price,
      batch_number: batchNum,
      expiry_date: expiry
    }]);
    
    setSelectedItem('');
    setQty('');
    setBatchNum('');
    setExpiry('');
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    
    let totalAmount = 0;
    cart.forEach(c => totalAmount += (c.qty * c.price));

    try {
      await createTransaction({
        type: type,
        total_amount: totalAmount,
        notes: notes,
        items: cart,
      });
      alert('Transaksi berhasil disimpan!');
      setCart([]);
      setNotes('');
      // refresh items stock?
    } catch (e) {
      alert(e.message);
    }
  };

  const totalCart = cart.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Transaksi</h1>
          <p className="text-muted">Input penerimaan gudang atau pengeluaran / penjualan</p>
        </div>
        <div className="bg-white rounded-lg p-1 border shadow-sm" style={{display: 'flex', gap: '4px', borderColor: 'var(--border-color)'}}>
          <button 
            className={`px-4 py-2 font-semibold text-sm rounded ${type === 'IN' ? 'bg-primary text-white' : 'bg-transparent text-muted hover:bg-gray-50'}`} 
            style={{backgroundColor: type === 'IN' ? 'var(--primary-color)' : '', color: type === 'IN' ? 'white' : 'var(--text-muted)'}}
            onClick={() => {setType('IN'); setCart([]);}}>
            Barang Masuk (Inbound)
          </button>
          <button 
            className={`px-4 py-2 font-semibold text-sm rounded ${type === 'OUT' ? 'bg-danger text-white' : 'bg-transparent text-muted hover:bg-gray-50'}`}
            style={{backgroundColor: type === 'OUT' ? '#ef4444' : '', color: type === 'OUT' ? 'white' : 'var(--text-muted)'}}
            onClick={() => {setType('OUT'); setCart([]);}}>
            Barang Keluar (Outbound)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Form Add */}
        <div className="card col-span-1">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-2" style={{borderColor: 'var(--border-color)'}}>
            {type === 'IN' ? <ArrowDownRight className="text-primary"/> : <ArrowUpRight style={{color: '#ef4444'}}/>}
            {type === 'IN' ? 'Form Penerimaan (IN)' : 'Form Pengeluaran (OUT)'}
          </h2>
          
          <div className="flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Pilih Barang</label>
              <select className="input" value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
                <option value="">-- Pilih --</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {item.sku} ({type === 'OUT' ? `Stok: ${item.total_stock}` : ''})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Jumlah (Qty)</label>
              <input type="number" className="input" value={qty} onChange={e => setQty(e.target.value)} />
            </div>

            {type === 'IN' && (
              <>
                <div>
                  <label className="text-sm font-medium mb-1 block">Nomor Batch Baru</label>
                  <input type="text" className="input" placeholder="Wajib untuk barang masuk" value={batchNum} onChange={e => setBatchNum(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tanggal Kadaluarsa</label>
                  <input type="date" className="input" placeholder="YYYY-MM-DD" value={expiry} onChange={e => setExpiry(e.target.value)} />
                </div>
              </>
            )}

            <button className="btn btn-outline w-full mt-4 flex items-center justify-center gap-2" onClick={addToCart}>
              <Plus size={16}/> Tambahkan ke Daftar
            </button>
          </div>
        </div>

        {/* Cart */}
        <div className="card col-span-2 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-4 border-b pb-2" style={{borderColor: 'var(--border-color)'}}>
              Daftar Barang {type === 'OUT' ? '(Keranjang Keluar)' : '(Daftar Masuk)'}
            </h2>
            
            <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '1rem'}}>
              <thead style={{borderBottom: '1px solid var(--border-color)', textAlign: 'left'}}>
                <tr>
                  <th className="py-2 text-sm text-muted">Item</th>
                  <th className="py-2 text-sm text-muted">Qty</th>
                  {type === 'IN' && <th className="py-2 text-sm text-muted">Batch & Expiry</th>}
                  <th className="py-2 text-sm text-muted text-right">Harga</th>
                  <th className="py-2 text-sm text-muted text-right">Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((c, idx) => (
                  <tr key={idx} style={{borderBottom: '1px solid var(--border-color)'}}>
                    <td className="py-3 font-medium">{c.name}</td>
                    <td className="py-3 font-medium bg-gray-50 text-center rounded">{c.qty}</td>
                    {type === 'IN' && (
                      <td className="py-3 text-sm text-muted">
                        <div>{c.batch_number}</div>
                        <div style={{fontSize: '0.7rem'}}>{c.expiry_date}</div>
                      </td>
                    )}
                    <td className="py-3 text-right">Rp {c.price.toLocaleString()}</td>
                    <td className="py-3 text-right font-medium text-primary">Rp {(c.qty * c.price).toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => removeFromCart(idx)} style={{color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer'}}>
                        <Trash2 size={16}/>
                      </button>
                    </td>
                  </tr>
                ))}
                {cart.length === 0 && (
                  <tr>
                    <td colSpan={type === 'IN' ? 6 : 5} className="py-8 text-center text-muted">
                      Belum ada barang di daftar
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="mt-4">
              <label className="text-sm font-medium mb-1 block">Catatan Transaksi</label>
              <input type="text" className="input" placeholder="Cth: Resep dr. Andi, atau PO Ke Supplier PT Phapros" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t flex justify-between items-center" style={{borderColor: 'var(--border-color)'}}>
            <div>
              <p className="text-sm text-muted mb-1">Total Nilai Transaksi</p>
              <h3 className="text-2xl font-bold" style={{color: type === 'IN' ? 'var(--text-main)' : '#047857'}}>
                Rp {totalCart.toLocaleString()}
              </h3>
            </div>
            <button className={`btn px-6 py-3 font-bold text-white rounded`} 
                    style={{backgroundColor: cart.length > 0 ? (type === 'IN' ? 'var(--primary-color)' : '#10b981') : 'var(--text-muted)'}} 
                    onClick={handleSubmit} 
                    disabled={cart.length === 0}>
              Proses Transaksi {type}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
