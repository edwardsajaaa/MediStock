import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Supplier A', value: 45 },
  { name: 'Supplier B', value: 25 },
  { name: 'Supplier C', value: 15 },
  { name: 'Supplier D', value: 15 },
];

const COLORS = ['#256e5f', '#f59e0b', '#94a3b8', '#e2e8f0'];

const SupplierDonutChart = () => {
  return (
    <div className="h-full w-full flex items-center justify-center relative" style={{ minHeight: '250px' }}>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, '']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Percentage overlays can be complex to position perfectly responsive, 
          so we rely on tooltip for details in this minimal implementation */}
    </div>
  );
};

export default SupplierDonutChart;
