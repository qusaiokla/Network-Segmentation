import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const [isCreatingSegmentation, setIsCreatingSegmentation] = useState(false);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleCreateSegmentation = async () => {
    setIsCreatingSegmentation(true);
    // Simulate segmentation creation
    setTimeout(() => {
      setIsCreatingSegmentation(false);
      // Navigate to topology designer or show success
    }, 2000);
  };

  const handleRunNetworkTest = async () => {
    setIsRunningTest(true);
    // Simulate network test execution
    setTimeout(() => {
      setIsRunningTest(false);
      // Navigate to testing dashboard or show results
    }, 3000);
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false);
      // Trigger download or show success
    }, 2500);
  };

  const quickActions = [
    {
      id: 'create-segmentation',
      title: 'Create New Segmentation',
      description: 'Design and implement new network segmentation policies',
      icon: 'Plus',
      variant: 'default',
      loading: isCreatingSegmentation,
      onClick: handleCreateSegmentation,
      shortcut: 'Ctrl+N'
    },
    {
      id: 'run-test',
      title: 'Run Network Test',
      description: 'Execute comprehensive connectivity and security tests',
      icon: 'Play',
      variant: 'outline',
      loading: isRunningTest,
      onClick: handleRunNetworkTest,
      shortcut: 'Ctrl+T'
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create detailed network status and compliance report',
      icon: 'FileText',
      variant: 'secondary',
      loading: isGeneratingReport,
      onClick: handleGenerateReport,
      shortcut: 'Ctrl+R'
    }
  ];

  const additionalActions = [
    {
      id: 'backup-config',
      title: 'Backup Configuration',
      icon: 'Download',
      onClick: () => console.log('Backup configuration')
    },
    {
      id: 'import-config',
      title: 'Import Configuration',
      icon: 'Upload',
      onClick: () => console.log('Import configuration')
    },
    {
      id: 'emergency-reset',
      title: 'Emergency Reset',
      icon: 'RotateCcw',
      variant: 'destructive',
      onClick: () => console.log('Emergency reset')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Primary Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Zap" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions?.map((action) => (
            <div
              key={action?.id}
              className="group p-4 border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={action?.onClick}
            >
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                  <Icon name={action?.icon} size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                    {action?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action?.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Button
                  variant={action?.variant}
                  size="sm"
                  loading={action?.loading}
                  iconName={action?.icon}
                  iconPosition="left"
                  onClick={(e) => {
                    e?.stopPropagation();
                    action?.onClick();
                  }}
                  className="w-full"
                >
                  {action?.loading ? 'Processing...' : 'Execute'}
                </Button>
              </div>
              
              {action?.shortcut && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Shortcut: <kbd className="px-1 py-0.5 bg-muted rounded text-xs font-mono">{action?.shortcut}</kbd>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Additional Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-foreground">Additional Actions</h3>
          <span className="text-xs text-muted-foreground">System Management</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {additionalActions?.map((action) => (
            <Button
              key={action?.id}
              variant={action?.variant || 'ghost'}
              size="sm"
              iconName={action?.icon}
              iconPosition="left"
              onClick={action?.onClick}
              className="justify-start"
            >
              {action?.title}
            </Button>
          ))}
        </div>
      </div>
      {/* System Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-foreground">System Status</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">All Systems Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="w-8 h-8 bg-success/10 text-success rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name="Server" size={16} />
            </div>
            <p className="text-muted-foreground">Core Services</p>
            <p className="font-medium text-success">Online</p>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 bg-success/10 text-success rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name="Database" size={16} />
            </div>
            <p className="text-muted-foreground">Database</p>
            <p className="font-medium text-success">Healthy</p>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 bg-warning/10 text-warning rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name="Wifi" size={16} />
            </div>
            <p className="text-muted-foreground">Network</p>
            <p className="font-medium text-warning">Monitoring</p>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 bg-success/10 text-success rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name="Shield" size={16} />
            </div>
            <p className="text-muted-foreground">Security</p>
            <p className="font-medium text-success">Protected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;