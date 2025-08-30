import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ValidationPanel = ({ isVisible, onClose, elements, onFixIssue }) => {
  const [validationResults, setValidationResults] = useState([]);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      runValidation();
    }
  }, [isVisible, elements]);

  const runValidation = async () => {
    setIsValidating(true);
    
    // Simulate validation process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const results = [];
    
    // Check for IP range conflicts
    const vlans = elements?.filter(el => el?.type === 'vlan' && el?.ipRange);
    for (let i = 0; i < vlans?.length; i++) {
      for (let j = i + 1; j < vlans?.length; j++) {
        if (vlans?.[i]?.ipRange === vlans?.[j]?.ipRange) {
          results?.push({
            id: `ip-conflict-${i}-${j}`,
            type: 'error',
            severity: 'high',
            title: 'IP Range Conflict',
            description: `VLANs "${vlans?.[i]?.name}" and "${vlans?.[j]?.name}" have overlapping IP ranges`,
            elements: [vlans?.[i]?.id, vlans?.[j]?.id],
            suggestion: 'Assign unique IP ranges to each VLAN',
            autoFixable: false
          });
        }
      }
    }
    
    // Check for isolated elements
    const isolatedElements = elements?.filter(el => !el?.connections || el?.connections?.length === 0);
    isolatedElements?.forEach(element => {
      if (element?.type !== 'host') {
        results?.push({
          id: `isolated-${element?.id}`,
          type: 'warning',
          severity: 'medium',
          title: 'Isolated Network Element',
          description: `"${element?.name}" is not connected to any other network elements`,
          elements: [element?.id],
          suggestion: 'Connect this element to establish network connectivity',
          autoFixable: false
        });
      }
    });
    
    // Check for missing security configurations
    const unsecuredElements = elements?.filter(el => 
      (el?.type === 'vlan' || el?.type === 'subnet') && 
      (!el?.firewallEnabled && !el?.aclEnabled)
    );
    unsecuredElements?.forEach(element => {
      results?.push({
        id: `security-${element?.id}`,
        type: 'warning',
        severity: 'medium',
        title: 'Missing Security Configuration',
        description: `"${element?.name}" has no firewall or ACL protection enabled`,
        elements: [element?.id],
        suggestion: 'Enable firewall or ACL protection for better security',
        autoFixable: true
      });
    });
    
    // Check for department assignment
    const unassignedElements = elements?.filter(el => !el?.department);
    unassignedElements?.forEach(element => {
      results?.push({
        id: `department-${element?.id}`,
        type: 'info',
        severity: 'low',
        title: 'Missing Department Assignment',
        description: `"${element?.name}" is not assigned to any department`,
        elements: [element?.id],
        suggestion: 'Assign this element to a department for better organization',
        autoFixable: true
      });
    });
    
    // Add some positive validations
    if (results?.length === 0) {
      results?.push({
        id: 'validation-success',
        type: 'success',
        severity: 'info',
        title: 'Validation Passed',
        description: 'All network elements are properly configured with no conflicts detected',
        elements: [],
        suggestion: 'Your network topology is ready for deployment',
        autoFixable: false
      });
    }
    
    setValidationResults(results);
    setIsValidating(false);
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'error': return 'XCircle';
      case 'warning': return 'AlertTriangle';
      case 'info': return 'Info';
      case 'success': return 'CheckCircle';
      default: return 'Circle';
    }
  };

  const getColorForType = (type) => {
    switch (type) {
      case 'error': return 'text-error';
      case 'warning': return 'text-warning';
      case 'info': return 'text-accent';
      case 'success': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      high: 'bg-error text-error-foreground',
      medium: 'bg-warning text-warning-foreground',
      low: 'bg-accent text-accent-foreground',
      info: 'bg-success text-success-foreground'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors?.[severity] || colors?.info}`}>
        {severity?.toUpperCase()}
      </span>
    );
  };

  const handleAutoFix = (issue) => {
    if (issue?.autoFixable) {
      onFixIssue(issue);
      // Remove the fixed issue from results
      setValidationResults(prev => prev?.filter(result => result?.id !== issue?.id));
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[1200] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-floating w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Design Validation</h2>
              <p className="text-sm text-muted-foreground">
                Network topology analysis and recommendations
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
          >
            Close
          </Button>
        </div>

        {/* Validation Status */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Validated {elements?.length} network elements
              </div>
              {isValidating && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-primary">Validating...</span>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={runValidation}
              loading={isValidating}
              iconName="RefreshCw"
              iconPosition="left"
            >
              Re-validate
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {isValidating ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Analyzing network topology...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {validationResults?.map((result) => (
                <div
                  key={result?.id}
                  className="bg-muted/30 border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors duration-150"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Icon 
                        name={getIconForType(result?.type)} 
                        size={20} 
                        className={`${getColorForType(result?.type)} flex-shrink-0 mt-0.5`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-sm font-medium text-foreground">
                            {result?.title}
                          </h3>
                          {getSeverityBadge(result?.severity)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {result?.description}
                        </p>
                        <p className="text-xs text-accent">
                          💡 {result?.suggestion}
                        </p>
                        {result?.elements?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {result?.elements?.map((elementId) => (
                              <span
                                key={elementId}
                                className="px-2 py-1 text-xs bg-background border border-border rounded font-mono"
                              >
                                {elementId}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {result?.autoFixable && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAutoFix(result)}
                        iconName="Wrench"
                        iconPosition="left"
                        className="ml-4 flex-shrink-0"
                      >
                        Auto Fix
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="p-6 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="XCircle" size={16} className="text-error" />
                <span className="text-muted-foreground">
                  Errors: {validationResults?.filter(r => r?.type === 'error')?.length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-muted-foreground">
                  Warnings: {validationResults?.filter(r => r?.type === 'warning')?.length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Info" size={16} className="text-accent" />
                <span className="text-muted-foreground">
                  Info: {validationResults?.filter(r => r?.type === 'info')?.length}
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Last validated: {new Date()?.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationPanel;