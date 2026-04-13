import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mar 2023', masuk: 12000, keluar: 8000 },
  { name: 'Jun 2023', masuk: 8000, keluar: 6000 },
  { name: 'Sep 2023', masuk: 10000, keluar: 11000 },
  { name: 'Dec 2023', masuk: 13000, keluar: 9000 },
  { name: 'Mar 2024', masuk: 9000, keluar: 12000 },
  { name: 'Jun 2024', masuk: 14000, keluar: 10000 },
  { name: 'Sep 2024', masuk: 16000, keluar: 13000 },
  { name: 'Dec 2024', masuk: 18500, keluar: 13200 },
];

const StockTrendChart = () => {
  return (
    <div className="h-full w-full" style={{ minHeight: '300px' }}>
      <div className="flex gap-4 mb-4 text-sm font-medium">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#256e5f]"></div>
          <span className="text-muted">Stok Masuk (Nilai)</span>
          <span className="font-bold text-main">$18,500.00 • 58%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
          <span className="text-muted">Stok Keluar (Nilai)</span>
          <span className="font-bold text-main">$13,200.00 • 42%</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(value) => `$${value/1000}K`} dx={-10} />
          <Tooltip 
            formatter={(value) => [`$${value}`, '']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Line type="monotone" dataKey="masuk" stroke="#256e5f" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="keluar" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockTrendChart;
