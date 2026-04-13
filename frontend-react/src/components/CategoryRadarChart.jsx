import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const data = [
  { subject: 'Obat Resep', A: 2728, fullMark: 3000 },
  { subject: 'Obat Bebas', A: 2409, fullMark: 3000 },
  { subject: 'Alat Kesehatan', A: 3028, fullMark: 3000 },
  { subject: 'Kosmetik Medik', A: 800, fullMark: 3000 },
  { subject: 'Suplemen', A: 1833, fullMark: 3000 },
  { subject: 'Vaksin', A: 1833, fullMark: 3000 },
];

const CategoryRadarChart = () => {
  return (
    <div className="h-full w-full flex items-center justify-center p-2" style={{ minHeight: '250px' }}>
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
          <Radar name="Kategori" dataKey="A" stroke="#256e5f" fill="#256e5f" fillOpacity={0.2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryRadarChart;
