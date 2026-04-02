import React from 'react';
import { AlertTriangle } from 'lucide-react';

const SmartAlertsGauge = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center pt-6 pb-2" style={{ minHeight: '250px' }}>
      
      {/* Custom CSS Gauge Implementation */}
      <div className="relative flex items-end justify-center" style={{ width: '200px', height: '100px', overflow: 'hidden' }}>
        {/* Background Arc */}
        <div className="absolute top-0 w-full h-[200px] rounded-full border-[15px] border-slate-100" style={{ boxSizing: 'border-box' }}></div>
        
        {/* Foreground Arc (Green) */}
        <div className="absolute top-0 w-full h-[200px] rounded-full border-[15px] border-[#256e5f]" style={{ 
          clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', /* Half circle */
          transform: 'rotate(0deg)', /* Rotate for progress */
          boxSizing: 'border-box'
        }}></div>
        
        {/* Center content */}
        <div className="absolute bottom-4 flex flex-col items-center">
           <div className="bg-slate-50 p-2 rounded-full mb-1">
             <AlertTriangle size={18} color="#94a3b8" />
           </div>
           <span className="text-3xl font-bold text-main">210</span>
           <span className="text-xs text-muted">Total Peringatan</span>
        </div>
      </div>
      
      <div className="w-full flex justify-between mt-8 px-4 text-center">
        <div>
          <div className="text-xl font-bold">109</div>
          <div className="text-xs text-muted">Peringatan Stok Rendah</div>
        </div>
        <div>
          <div className="text-xl font-bold">101</div>
          <div className="text-xs text-muted">Hampir Kadaluarsa</div>
        </div>
      </div>
    </div>
  );
};

export default SmartAlertsGauge;
