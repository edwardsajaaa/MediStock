import React from 'react';
import { User, Users, Package, UserCircle } from 'lucide-react';

const ProgressBar = ({ label, percentage, count, icon, color }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100" style={{ color }}>
          {icon}
        </div>
        <span className="text-sm font-medium text-main">{label}</span>
      </div>
      <div className="text-sm font-semibold">
        {count} <span className="text-muted font-normal">• {percentage}%</span>
      </div>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div className="h-2 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
    </div>
  </div>
);

const SessionRoleChart = () => {
  return (
    <div className="flex flex-col h-full" style={{ minHeight: '300px' }}>
      <p className="text-xs text-muted mb-4">Showing Data for Top Session</p>
      <div className="flex-1 flex flex-col justify-center">
        <ProgressBar label="Apoteker" percentage={80} count="634" icon={<User size={16} />} color="#256e5f" />
        <ProgressBar label="Asisten Apoteker" percentage={45} count="599" icon={<Users size={16} />} color="#256e5f" />
        <ProgressBar label="Petugas Gudang" percentage={35} count="582" icon={<Package size={16} />} color="#256e5f" />
        <ProgressBar label="Admin" percentage={20} count="453" icon={<UserCircle size={16} />} color="#256e5f" />
      </div>
    </div>
  );
};

export default SessionRoleChart;
