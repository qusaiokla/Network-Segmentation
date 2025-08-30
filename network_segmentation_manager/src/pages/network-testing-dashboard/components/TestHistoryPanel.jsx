import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const TestHistoryPanel = ({ testResults, onRerunTest, onClearHistory }) => {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');

  const testTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'ping', label: 'Ping Tests' },
    { value: 'traceroute', label: 'Traceroute Tests' },
    { value: 'port-scan', label: 'Port Scan Tests' },
    { value: 'bandwidth', label: 'Bandwidth Tests' },
    { value: 'packet-capture', label: 'Packet Capture' },
    { value: 'dns-lookup', label: 'DNS Lookup Tests' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
    { value: 'warning', label: 'Warning' }
  ];

  const sortOptions = [
    { value: 'timestamp', label: 'Most Recent' },
    { value: 'duration', label: 'Duration' },
    { value: 'source', label: 'Source Host' },
    { value: 'destination', label: 'Destination Host' }
  ];

  const filteredResults = testResults?.filter(result => filterType === 'all' || result?.type === filterType)?.filter(result => filterStatus === 'all' || result?.status === filterStatus)?.sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'duration':
          return b?.duration - a?.duration;
        case 'source':
          return a?.source?.localeCompare(b?.source);
        case 'destination':
          return a?.destination?.localeCompare(b?.destination);
        default:
          return 0;
      }
    });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return 'CheckCircle';
      case 'failed': return 'XCircle';
      case 'warning': return 'AlertTriangle';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'failed': return 'text-error';
      case 'warning': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getTestTypeIcon = (type) => {
    switch (type) {
      case 'ping': return 'Wifi';
      case 'traceroute': return 'Route';
      case 'port-scan': return 'Shield';
      case 'bandwidth': return 'Gauge';
      case 'packet-capture': return 'Eye';
      case 'dns-lookup': return 'Globe';
      default: return 'TestTube';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date?.toLocaleDateString(),
      time: date?.toLocaleTimeString()
    };
  };

  const getSuccessRate = () => {
    if (filteredResults?.length === 0) return 0;
    const successCount = filteredResults?.filter(r => r?.status === 'success')?.length;
    return ((successCount / filteredResults?.length) * 100)?.toFixed(1);
  };

  const getAverageResponseTime = () => {
    if (filteredResults?.length === 0) return 0;
    const total = filteredResults?.reduce((sum, r) => sum + r?.duration, 0);
    return (total / filteredResults?.length)?.toFixed(1);
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="History" size={20} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Test History</h3>
            <p className="text-sm text-muted-foreground">
              {filteredResults?.length} of {testResults?.length} tests
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            disabled={testResults?.length === 0}
            iconName="Trash2"
            iconPosition="left"
          >
            Clear
          </Button>
        </div>
      </div>
      {/* Filters and Stats */}
      <div className="p-4 border-b border-border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Filter by Type"
            options={testTypeOptions}
            value={filterType}
            onChange={setFilterType}
            size="sm"
          />
          
          <Select
            label="Filter by Status"
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            size="sm"
          />
          
          <Select
            label="Sort by"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            size="sm"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-foreground">{getSuccessRate()}%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-foreground">{getAverageResponseTime()}ms</div>
            <div className="text-xs text-muted-foreground">Avg Response</div>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-foreground">{filteredResults?.length}</div>
            <div className="text-xs text-muted-foreground">Total Tests</div>
          </div>
        </div>
      </div>
      {/* Test History List */}
      <div className="flex-1 overflow-y-auto">
        {filteredResults?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Icon name="History" size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No test history</p>
            <p className="text-sm">Run some tests to see results here</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredResults?.map((result, index) => (
              <div
                key={index}
                className="bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted transition-colors duration-150"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={getTestTypeIcon(result?.type)} 
                        size={16} 
                        className="text-primary"
                      />
                      <span className="text-sm font-medium text-foreground uppercase">
                        {result?.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Icon 
                        name={getStatusIcon(result?.status)} 
                        size={16} 
                        className={getStatusColor(result?.status)}
                      />
                      <span className={`text-sm font-medium capitalize ${getStatusColor(result?.status)}`}>
                        {result?.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-muted-foreground font-mono">
                      {result?.duration}ms
                    </span>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => onRerunTest(result)}
                      iconName="RotateCcw"
                      iconPosition="left"
                    >
                      Rerun
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-muted-foreground">{result?.source}</span>
                    <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
                    <span className="font-mono text-muted-foreground">{result?.destination}</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {formatTimestamp(result?.timestamp)?.date} at {formatTimestamp(result?.timestamp)?.time}
                  </div>
                </div>
                
                {result?.details && (
                  <div className="mt-2 text-xs text-muted-foreground bg-background rounded p-2">
                    {result?.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestHistoryPanel;