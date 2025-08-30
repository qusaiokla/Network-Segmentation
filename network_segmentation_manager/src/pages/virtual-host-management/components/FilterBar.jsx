import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  totalHosts, 
  filteredCount 
}) => {
  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'IT', label: 'IT Department' },
    { value: 'HR', label: 'HR Department' },
    { value: 'Finance', label: 'Finance Department' },
    { value: 'Marketing', label: 'Marketing Department' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'running', label: 'Running' },
    { value: 'stopped', label: 'Stopped' },
    { value: 'starting', label: 'Starting' },
    { value: 'error', label: 'Error' }
  ];

  const ipRangeOptions = [
    { value: '', label: 'All IP Ranges' },
    { value: '192.168.1.0/24', label: '192.168.1.0/24 (IT)' },
    { value: '192.168.2.0/24', label: '192.168.2.0/24 (HR)' },
    { value: '192.168.3.0/24', label: '192.168.3.0/24 (Finance)' },
    { value: '192.168.4.0/24', label: '192.168.4.0/24 (Marketing)' }
  ];

  const hasActiveFilters = filters?.search || filters?.department || filters?.status || filters?.ipRange;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 lg:max-w-xs">
          <Input
            type="search"
            placeholder="Search hostnames..."
            value={filters?.search}
            onChange={(e) => onFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Department Filter */}
        <div className="lg:w-48">
          <Select
            options={departmentOptions}
            value={filters?.department}
            onChange={(value) => onFilterChange('department', value)}
            placeholder="Filter by department"
          />
        </div>

        {/* Status Filter */}
        <div className="lg:w-40">
          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => onFilterChange('status', value)}
            placeholder="Filter by status"
          />
        </div>

        {/* IP Range Filter */}
        <div className="lg:w-52">
          <Select
            options={ipRangeOptions}
            value={filters?.ipRange}
            onChange={(value) => onFilterChange('ipRange', value)}
            placeholder="Filter by IP range"
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClearFilters}
            className="lg:w-auto"
          >
            Clear
          </Button>
        )}
      </div>
      {/* Filter Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Server" size={14} />
            <span>
              {filteredCount === totalHosts 
                ? `${totalHosts} hosts` 
                : `${filteredCount} of ${totalHosts} hosts`
              }
            </span>
          </div>
          {hasActiveFilters && (
            <div className="flex items-center space-x-1">
              <Icon name="Filter" size={14} />
              <span>Filtered</span>
            </div>
          )}
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filters?.search && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Search: "{filters?.search}"
                <button
                  onClick={() => onFilterChange('search', '')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.department && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Dept: {filters?.department}
                <button
                  onClick={() => onFilterChange('department', '')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.status && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Status: {filters?.status}
                <button
                  onClick={() => onFilterChange('status', '')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.ipRange && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                IP: {filters?.ipRange}
                <button
                  onClick={() => onFilterChange('ipRange', '')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;