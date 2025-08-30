import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionToolbar = ({ context = 'dashboard' }) => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isRunningTest, setIsRunningTest] = useState(false);

  const handleEmergencyTest = async () => {
    setIsRunningTest(true);
    // Simulate test execution
    setTimeout(() => {
      setIsRunningTest(false);
      // Show success notification or modal
    }, 3000);
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false);
      // Trigger download or show success
    }, 2000);
  };

  const handleCreateAlert = () => {
    // Open alert creation modal
    console.log('Opening alert creation modal');
  };

  const getDashboardActions = () => [
    {
      id: 'emergency-test',
      label: 'Emergency Test',
      icon: 'Zap',
      variant: 'destructive',
      loading: isRunningTest,
      onClick: handleEmergencyTest,
      tooltip: 'Run immediate connectivity test across all segments'
    },
    {
      id: 'generate-report',
      label: 'Generate Report',
      icon: 'FileText',
      variant: 'outline',
      loading: isGeneratingReport,
      onClick: handleGenerateReport,
      tooltip: 'Create comprehensive network status report'
    },
    {
      id: 'create-alert',
      label: 'Create Alert',
      icon: 'Bell',
      variant: 'secondary',
      onClick: handleCreateAlert,
      tooltip: 'Set up new monitoring alert rule'
    }
  ];

  const getTestingActions = () => [
    {
      id: 'run-full-test',
      label: 'Full Test Suite',
      icon: 'Play',
      variant: 'default',
      loading: isRunningTest,
      onClick: handleEmergencyTest,
      tooltip: 'Execute complete network validation suite'
    },
    {
      id: 'quick-ping',
      label: 'Quick Ping',
      icon: 'Wifi',
      variant: 'outline',
      onClick: () => console.log('Quick ping test'),
      tooltip: 'Run basic connectivity ping test'
    },
    {
      id: 'export-results',
      label: 'Export Results',
      icon: 'Download',
      variant: 'ghost',
      loading: isGeneratingReport,
      onClick: handleGenerateReport,
      tooltip: 'Export test results to CSV/PDF'
    }
  ];

  const actions = context === 'testing' ? getTestingActions() : getDashboardActions();

  if (!actions?.length) return null;

  return (
    <div className="sticky top-32 z-[800] mb-6">
      <div className="bg-card border border-border rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={16} className="text-primary" />
            <h3 className="text-sm font-medium text-foreground">Quick Actions</h3>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {new Date()?.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {actions?.map((action) => (
            <Button
              key={action?.id}
              variant={action?.variant}
              size="sm"
              loading={action?.loading}
              onClick={action?.onClick}
              iconName={action?.icon}
              iconPosition="left"
              className="flex-shrink-0"
              title={action?.tooltip}
            >
              {action?.label}
            </Button>
          ))}
        </div>

        {/* Status Indicators */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-muted-foreground">System Ready</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Activity" size={12} className="text-accent" />
                <span className="text-muted-foreground font-mono">247 Active</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} className="text-muted-foreground" />
              <span className="text-muted-foreground">Last test: 2m ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionToolbar;