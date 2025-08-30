import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCards = ({ hosts }) => {
  const stats = {
    total: hosts?.length,
    running: hosts?.filter(h => h?.status === 'running')?.length,
    stopped: hosts?.filter(h => h?.status === 'stopped')?.length,
    error: hosts?.filter(h => h?.status === 'error')?.length,
    totalResources: {
      cpu: hosts?.reduce((sum, h) => sum + (h?.resourceAllocation?.cpu || 0), 0),
      memory: hosts?.reduce((sum, h) => sum + (h?.resourceAllocation?.memory || 0), 0),
      disk: hosts?.reduce((sum, h) => sum + (h?.resourceAllocation?.disk || 0), 0)
    },
    usedResources: {
      cpu: hosts?.reduce((sum, h) => sum + ((h?.resourceUsage?.cpu || 0) * (h?.resourceAllocation?.cpu || 0) / 100), 0),
      memory: hosts?.reduce((sum, h) => sum + ((h?.resourceUsage?.memory || 0) * (h?.resourceAllocation?.memory || 0) / 100), 0),
      disk: hosts?.reduce((sum, h) => sum + ((h?.resourceUsage?.disk || 0) * (h?.resourceAllocation?.disk || 0) / 100), 0)
    }
  };

  const cards = [
    {
      title: 'Total Hosts',
      value: stats?.total,
      icon: 'Server',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+2 this week',
      changeType: 'positive'
    },
    {
      title: 'Running',
      value: stats?.running,
      icon: 'Play',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: `${Math.round((stats?.running / stats?.total) * 100) || 0}% uptime`,
      changeType: 'neutral'
    },
    {
      title: 'Stopped',
      value: stats?.stopped,
      icon: 'Square',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: stats?.stopped > 0 ? 'Needs attention' : 'All running',
      changeType: stats?.stopped > 0 ? 'negative' : 'positive'
    },
    {
      title: 'CPU Usage',
      value: `${Math.round((stats?.usedResources?.cpu / stats?.totalResources?.cpu) * 100) || 0}%`,
      icon: 'Cpu',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: `${stats?.usedResources?.cpu?.toFixed(1)}/${stats?.totalResources?.cpu} cores`,
      changeType: 'neutral'
    },
    {
      title: 'Memory Usage',
      value: `${Math.round((stats?.usedResources?.memory / stats?.totalResources?.memory) * 100) || 0}%`,
      icon: 'MemoryStick',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: `${stats?.usedResources?.memory?.toFixed(1)}/${stats?.totalResources?.memory} GB`,
      changeType: 'neutral'
    },
    {
      title: 'Storage Usage',
      value: `${Math.round((stats?.usedResources?.disk / stats?.totalResources?.disk) * 100) || 0}%`,
      icon: 'HardDrive',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: `${stats?.usedResources?.disk?.toFixed(1)}/${stats?.totalResources?.disk} GB`,
      changeType: 'neutral'
    }
  ];

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {cards?.map((card, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 ${card?.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={card?.icon} size={20} className={card?.color} />
            </div>
            {stats?.error > 0 && card?.title === 'Total Hosts' && (
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" title={`${stats?.error} hosts with errors`} />
            )}
          </div>
          
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">{card?.value}</div>
            <div className="text-xs font-medium text-muted-foreground">{card?.title}</div>
            <div className={`text-xs ${getChangeColor(card?.changeType)}`}>
              {card?.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;