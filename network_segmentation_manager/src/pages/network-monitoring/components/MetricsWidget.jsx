import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const MetricsWidget = ({ title, value, unit, trend, icon, color, data, isLoading }) => {
  const getTrendIcon = () => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
            <Icon name={icon} size={20} color="white" />
          </div>
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
        </div>
        {isLoading && (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>
      <div className="mb-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-foreground">
            {isLoading ? '--' : value}
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        <div className="flex items-center space-x-1 mt-1">
          <Icon name={getTrendIcon()} size={14} className={getTrendColor()} />
          <span className={`text-xs font-medium ${getTrendColor()}`}>
            {Math.abs(trend)}% from last hour
          </span>
        </div>
      </div>
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color?.includes('bg-primary') ? 'var(--color-primary)' : 
                     color?.includes('bg-success') ? 'var(--color-success)' :
                     color?.includes('bg-warning') ? 'var(--color-warning)' : 'var(--color-accent)'}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsWidget;