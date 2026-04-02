import React from 'react';
import './ChartWidget.css';
import { MoreHorizontal, Download } from 'lucide-react';

const ChartWidget = ({ title, children, showActions = true, subtitle }) => {
  return (
    <div className="chart-widget card">
      <div className="chart-header flex justify-between items-center mb-4">
        <div>
          <h3 className="chart-title text-base font-semibold">{title}</h3>
          {subtitle && <p className="chart-subtitle text-xs text-muted mt-1">{subtitle}</p>}
        </div>
        {showActions && (
          <div className="chart-actions flex gap-2">
            <button className="icon-btn-small"><Download size={16} /></button>
            <button className="icon-btn-small"><MoreHorizontal size={16} /></button>
          </div>
        )}
      </div>
      <div className="chart-body">
        {children}
      </div>
    </div>
  );
};

export default ChartWidget;
