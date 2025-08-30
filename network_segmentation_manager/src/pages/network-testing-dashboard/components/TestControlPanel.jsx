import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const TestControlPanel = ({ onRunTest, isTestRunning, testResults }) => {
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [testType, setTestType] = useState('ping');
  const [batchMode, setBatchMode] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState({
    timeout: 5,
    count: 4,
    interval: 1,
    packetSize: 64
  });

  const hostOptions = [
    { value: 'hr-ws-001', label: 'HR-WS-001 (192.168.10.10)', description: 'HR Department Workstation' },
    { value: 'hr-ws-002', label: 'HR-WS-002 (192.168.10.11)', description: 'HR Department Workstation' },
    { value: 'it-srv-001', label: 'IT-SRV-001 (192.168.20.10)', description: 'IT Department Server' },
    { value: 'it-ws-001', label: 'IT-WS-001 (192.168.20.20)', description: 'IT Department Workstation' },
    { value: 'fin-ws-001', label: 'FIN-WS-001 (192.168.30.10)', description: 'Finance Department Workstation' },
    { value: 'fin-srv-001', label: 'FIN-SRV-001 (192.168.30.20)', description: 'Finance Department Server' },
    { value: 'dmz-web-001', label: 'DMZ-WEB-001 (10.0.1.10)', description: 'DMZ Web Server' },
    { value: 'core-gw-001', label: 'CORE-GW-001 (10.0.0.1)', description: 'Core Gateway Router' }
  ];

  const testTypeOptions = [
    { value: 'ping', label: 'Ping Test', description: 'Basic ICMP connectivity test' },
    { value: 'traceroute', label: 'Traceroute', description: 'Network path discovery' },
    { value: 'port-scan', label: 'Port Scan', description: 'TCP/UDP port connectivity' },
    { value: 'bandwidth', label: 'Bandwidth Test', description: 'Network throughput measurement' },
    { value: 'packet-capture', label: 'Packet Capture', description: 'Network traffic analysis' },
    { value: 'dns-lookup', label: 'DNS Lookup', description: 'Domain name resolution test' }
  ];

  const handleRunTest = () => {
    if (!selectedSource || !selectedDestination) {
      return;
    }

    const testConfig = {
      source: selectedSource,
      destination: selectedDestination,
      type: testType,
      batchMode,
      options: advancedOptions,
      timestamp: new Date()?.toISOString()
    };

    onRunTest(testConfig);
  };

  const handleBatchTest = () => {
    const batchTests = hostOptions?.map(source => 
      hostOptions?.filter(dest => dest?.value !== source?.value)?.map(dest => ({
        source: source?.value,
        destination: dest?.value,
        type: testType,
        batchMode: true,
        options: advancedOptions,
        timestamp: new Date()?.toISOString()
      }))
    )?.flat();

    onRunTest({ batchTests });
  };

  const getTestIcon = (type) => {
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

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="TestTube" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Test Control Panel</h2>
            <p className="text-sm text-muted-foreground">Configure and execute network connectivity tests</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isTestRunning ? 'bg-warning animate-pulse' : 'bg-success'}`}></div>
            <span className="text-xs text-muted-foreground font-mono">
              {isTestRunning ? 'Testing...' : 'Ready'}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date()?.toLocaleTimeString()}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Selection */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Source Host</label>
            <Select
              placeholder="Select source host"
              options={hostOptions}
              value={selectedSource}
              onChange={setSelectedSource}
              searchable
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Destination Host</label>
            <Select
              placeholder="Select destination host"
              options={hostOptions?.filter(host => host?.value !== selectedSource)}
              value={selectedDestination}
              onChange={setSelectedDestination}
              searchable
              className="w-full"
            />
          </div>
        </div>

        {/* Test Configuration */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Test Type</label>
            <Select
              options={testTypeOptions}
              value={testType}
              onChange={setTestType}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Checkbox
              label="Batch Mode"
              description="Test all host combinations"
              checked={batchMode}
              onChange={(e) => setBatchMode(e?.target?.checked)}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Timeout (s)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={advancedOptions?.timeout}
                  onChange={(e) => setAdvancedOptions(prev => ({ ...prev, timeout: parseInt(e?.target?.value) }))}
                  className="w-full px-2 py-1 text-sm border border-border rounded bg-input"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Count</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={advancedOptions?.count}
                  onChange={(e) => setAdvancedOptions(prev => ({ ...prev, count: parseInt(e?.target?.value) }))}
                  className="w-full px-2 py-1 text-sm border border-border rounded bg-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="space-y-3">
            <Button
              variant="default"
              fullWidth
              loading={isTestRunning}
              onClick={handleRunTest}
              disabled={!selectedSource || !selectedDestination}
              iconName={getTestIcon(testType)}
              iconPosition="left"
            >
              {isTestRunning ? 'Running Test...' : 'Run Test'}
            </Button>

            <Button
              variant="outline"
              fullWidth
              onClick={handleBatchTest}
              disabled={isTestRunning}
              iconName="Layers"
              iconPosition="left"
            >
              Run Batch Test
            </Button>

            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setSelectedSource('');
                setSelectedDestination('');
                setTestType('ping');
                setBatchMode(false);
              }}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tests Today</span>
              <span className="font-mono text-foreground">247</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Success Rate</span>
              <span className="font-mono text-success">94.2%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avg Response</span>
              <span className="font-mono text-foreground">12ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestControlPanel;