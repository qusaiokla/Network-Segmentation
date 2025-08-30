import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const MonitoringControls = ({ onTimeRangeChange, onDepartmentFilter, onRefreshIntervalChange }) => {
  const [timeRange, setTimeRange] = useState('1h');
  const [selectedDepartments, setSelectedDepartments] = useState(['all']);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [customTimeRange, setCustomTimeRange] = useState({ start: '', end: '' });
  const [showCustomRange, setShowCustomRange] = useState(false);

  const timeRanges = [
    { value: '15m', label: '15 Minutes' },
    { value: '1h', label: '1 Hour' },
    { value: '6h', label: '6 Hours' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const departments = [
    { id: 'all', name: 'All Departments', count: 247 },
    { id: 'hr', name: 'Human Resources', count: 45 },
    { id: 'it', name: 'Information Technology', count: 89 },
    { id: 'finance', name: 'Finance', count: 67 },
    { id: 'sales', name: 'Sales', count: 34 },
    { id: 'marketing', name: 'Marketing', count: 23 }
  ];

  const refreshIntervals = [
    { value: 5, label: '5 seconds' },
    { value: 10, label: '10 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 300, label: '5 minutes' }
  ];

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    if (value === 'custom') {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
      onTimeRangeChange?.(value);
    }
  };

  const handleDepartmentToggle = (deptId) => {
    if (deptId === 'all') {
      setSelectedDepartments(['all']);
    } else {
      const newSelection = selectedDepartments?.includes('all') 
        ? [deptId]
        : selectedDepartments?.includes(deptId)
          ? selectedDepartments?.filter(id => id !== deptId)
          : [...selectedDepartments?.filter(id => id !== 'all'), deptId];
      
      setSelectedDepartments(newSelection?.length === 0 ? ['all'] : newSelection);
    }
    onDepartmentFilter?.(selectedDepartments);
  };

  const handleRefreshIntervalChange = (interval) => {
    setRefreshInterval(interval);
    onRefreshIntervalChange?.(interval);
  };

  const handleCustomRangeApply = () => {
    if (customTimeRange?.start && customTimeRange?.end) {
      onTimeRangeChange?.({
        type: 'custom',
        start: customTimeRange?.start,
        end: customTimeRange?.end
      });
      setShowCustomRange(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon name="Settings" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Monitoring Controls</h3>
      </div>
      {/* Time Range Selection */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
          <Icon name="Clock" size={16} />
          <span>Time Range</span>
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {timeRanges?.map((range) => (
            <label
              key={range?.value}
              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                timeRange === range?.value
                  ? 'border-primary bg-primary/5 text-primary' :'border-border hover:bg-muted/50'
              }`}
            >
              <input
                type="radio"
                name="timeRange"
                value={range?.value}
                checked={timeRange === range?.value}
                onChange={(e) => handleTimeRangeChange(e?.target?.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                timeRange === range?.value ? 'border-primary' : 'border-muted-foreground'
              }`}>
                {timeRange === range?.value && (
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                )}
              </div>
              <span className="text-sm font-medium">{range?.label}</span>
            </label>
          ))}
        </div>

        {/* Custom Time Range */}
        {showCustomRange && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
            <h5 className="text-sm font-medium text-foreground">Custom Date Range</h5>
            <div className="grid grid-cols-1 gap-3">
              <Input
                label="Start Date & Time"
                type="datetime-local"
                value={customTimeRange?.start}
                onChange={(e) => setCustomTimeRange(prev => ({ ...prev, start: e?.target?.value }))}
              />
              <Input
                label="End Date & Time"
                type="datetime-local"
                value={customTimeRange?.end}
                onChange={(e) => setCustomTimeRange(prev => ({ ...prev, end: e?.target?.value }))}
              />
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleCustomRangeApply}
                  iconName="Check"
                >
                  Apply Range
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomRange(false)}
                  iconName="X"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Department Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
          <Icon name="Building" size={16} />
          <span>Department Filters</span>
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {departments?.map((dept) => (
            <div key={dept?.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
              <Checkbox
                checked={selectedDepartments?.includes(dept?.id)}
                onChange={() => handleDepartmentToggle(dept?.id)}
                label={
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm">{dept?.name}</span>
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                      {dept?.count}
                    </span>
                  </div>
                }
              />
            </div>
          ))}
        </div>
      </div>
      {/* Refresh Settings */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
          <Icon name="RefreshCw" size={16} />
          <span>Refresh Settings</span>
        </h4>
        
        <Checkbox
          checked={isAutoRefresh}
          onChange={(e) => setIsAutoRefresh(e?.target?.checked)}
          label="Enable Auto-refresh"
        />

        {isAutoRefresh && (
          <div className="ml-6 space-y-2">
            <label className="text-sm text-muted-foreground">Refresh Interval</label>
            <select
              value={refreshInterval}
              onChange={(e) => handleRefreshIntervalChange(Number(e?.target?.value))}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground"
            >
              {refreshIntervals?.map((interval) => (
                <option key={interval?.value} value={interval?.value}>
                  {interval?.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {/* Alert Configuration */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground flex items-center space-x-2">
          <Icon name="Bell" size={16} />
          <span>Alert Configuration</span>
        </h4>
        <div className="space-y-2">
          <Checkbox
            checked
            label="Critical alerts"
          />
          <Checkbox
            checked
            label="Warning alerts"
          />
          <Checkbox
           
            label="Info alerts"
          />
          <Checkbox
            checked
            label="Policy violations"
          />
        </div>
      </div>
      {/* Quick Actions */}
      <div className="pt-4 border-t border-border">
        <div className="flex flex-col space-y-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            fullWidth
          >
            Export Current View
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            fullWidth
          >
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MonitoringControls;