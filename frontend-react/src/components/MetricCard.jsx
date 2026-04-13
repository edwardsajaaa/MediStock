import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './MetricCard.css';

const MetricCard = ({ title, value, change, isPositive, comparisonText, type }) => {
  return (
    <div className={`metric-card ${type === 'danger' ? 'danger-border' : ''}`}>
      <div className="metric-title">{title}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-footer">
        <span className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
        <span className="metric-comparison">{comparisonText}</span>
      </div>
    </div>
  );
};

export default MetricCard;
