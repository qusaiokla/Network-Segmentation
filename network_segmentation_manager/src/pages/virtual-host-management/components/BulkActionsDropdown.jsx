import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsDropdown = ({ selectedHosts, onBulkAction, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const bulkActions = [
    {
      id: 'start',
      label: 'Start Selected Hosts',
      icon: 'Play',
      color: 'text-success',
      description: 'Start all selected virtual hosts'
    },
    {
      id: 'stop',
      label: 'Stop Selected Hosts',
      icon: 'Square',
      color: 'text-warning',
      description: 'Stop all selected virtual hosts'
    },
    {
      id: 'restart',
      label: 'Restart Selected Hosts',
      icon: 'RotateCcw',
      color: 'text-accent',
      description: 'Restart all selected virtual hosts'
    },
    {
      id: 'separator1',
      type: 'separator'
    },
    {
      id: 'configure',
      label: 'Bulk Configure',
      icon: 'Settings',
      color: 'text-foreground',
      description: 'Apply configuration to selected hosts'
    },
    {
      id: 'export',
      label: 'Export Configuration',
      icon: 'Download',
      color: 'text-foreground',
      description: 'Export host configurations'
    },
    {
      id: 'separator2',
      type: 'separator'
    },
    {
      id: 'delete',
      label: 'Delete Selected Hosts',
      icon: 'Trash2',
      color: 'text-destructive',
      description: 'Permanently delete selected hosts',
      requiresConfirmation: true
    }
  ];

  const handleActionClick = async (action) => {
    if (action?.requiresConfirmation) {
      const confirmed = window.confirm(
        `Are you sure you want to ${action?.label?.toLowerCase()}? This action cannot be undone.`
      );
      if (!confirmed) return;
    }

    setIsProcessing(true);
    setIsOpen(false);

    try {
      await onBulkAction(action?.id, selectedHosts);
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionSummary = () => {
    const count = selectedHosts?.length;
    if (count === 0) return 'No hosts selected';
    if (count === 1) return '1 host selected';
    return `${count} hosts selected`;
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        iconName="ChevronDown"
        iconPosition="right"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || selectedHosts?.length === 0 || isProcessing}
        loading={isProcessing}
      >
        Bulk Actions
      </Button>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[1000]" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 mt-2 w-72 bg-popover border border-border rounded-lg shadow-floating z-[1100] animate-fade-in">
            {/* Header */}
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckSquare" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-popover-foreground">
                    Bulk Actions
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {getActionSummary()}
              </div>
            </div>

            {/* Actions List */}
            <div className="py-2">
              {bulkActions?.map((action) => {
                if (action?.type === 'separator') {
                  return (<div key={action?.id} className="my-1 h-px bg-border mx-2" />);
                }

                return (
                  <button
                    key={action?.id}
                    onClick={() => handleActionClick(action)}
                    disabled={selectedHosts?.length === 0}
                    className={`
                      w-full flex items-start space-x-3 px-3 py-2 text-left transition-colors duration-150
                      hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed
                      ${action?.color}
                    `}
                  >
                    <Icon name={action?.icon} size={16} className="mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{action?.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {action?.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border bg-muted/20">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Actions will affect {selectedHosts?.length} host{selectedHosts?.length !== 1 ? 's' : ''}</span>
                <div className="flex items-center space-x-1">
                  <Icon name="Info" size={12} />
                  <span>Some actions require confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BulkActionsDropdown;