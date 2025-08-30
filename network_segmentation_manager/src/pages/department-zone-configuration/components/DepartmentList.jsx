import React from 'react';
import Icon from '../../../components/AppIcon';

const DepartmentList = ({ 
  departments, 
  selectedDepartment, 
  onDepartmentSelect 
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      case 'inactive': return 'Circle';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      case 'inactive': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Building2" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Departments</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Select department to configure
        </p>
      </div>
      <div className="p-2 space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
        {departments?.map((department) => (
          <button
            key={department?.id}
            onClick={() => onDepartmentSelect(department)}
            className={`
              w-full p-4 rounded-lg text-left transition-all duration-150 hover:bg-muted/50
              ${selectedDepartment?.id === department?.id 
                ? 'bg-primary/10 border border-primary/20 shadow-sm' 
                : 'hover:bg-muted'
              }
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div 
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${department?.color}`}
                >
                  <Icon name={department?.icon} size={20} color="white" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{department?.name}</h3>
                  <p className="text-sm text-muted-foreground">{department?.description}</p>
                </div>
              </div>
              <Icon 
                name={getStatusIcon(department?.status)} 
                size={16} 
                className={getStatusColor(department?.status)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">VLAN:</span>
                <span className="ml-1 font-mono text-foreground">{department?.vlan}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Hosts:</span>
                <span className="ml-1 font-mono text-foreground">{department?.hostCount}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Subnet:</span>
                <span className="ml-1 font-mono text-foreground">{department?.subnet}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className={`ml-1 font-medium capitalize ${getStatusColor(department?.status)}`}>
                  {department?.status}
                </span>
              </div>
            </div>

            {department?.lastModified && (
              <div className="mt-2 pt-2 border-t border-border">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Icon name="Clock" size={12} />
                  <span>Modified: {department?.lastModified}</span>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{departments?.length} departments</span>
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={12} />
            <span>Segmentation Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentList;