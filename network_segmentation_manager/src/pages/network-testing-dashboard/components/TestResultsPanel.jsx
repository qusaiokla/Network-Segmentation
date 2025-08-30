import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TestResultsPanel = ({ testResults, isTestRunning, currentTest }) => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const outputRef = useRef(null);

  useEffect(() => {
    if (autoScroll && outputRef?.current) {
      outputRef.current.scrollTop = outputRef?.current?.scrollHeight;
    }
  }, [testResults, autoScroll]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return 'CheckCircle';
      case 'failed': return 'XCircle';
      case 'warning': return 'AlertTriangle';
      case 'running': return 'Loader';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'failed': return 'text-error';
      case 'warning': return 'text-warning';
      case 'running': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const mockTestOutput = `PING 192.168.10.11 (192.168.10.11) 56(84) bytes of data.
64 bytes from 192.168.10.11: icmp_seq=1 ttl=64 time=0.234 ms
64 bytes from 192.168.10.11: icmp_seq=2 ttl=64 time=0.189 ms
64 bytes from 192.168.10.11: icmp_seq=3 ttl=64 time=0.201 ms
64 bytes from 192.168.10.11: icmp_seq=4 ttl=64 time=0.198 ms

--- 192.168.10.11 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3002ms
rtt min/avg/max/mdev = 0.189/0.205/0.234/0.018 ms`;

  const mockTracerouteOutput = `traceroute to 192.168.30.10 (192.168.30.10), 30 hops max, 60 byte packets
 1  10.0.0.1 (10.0.0.1)  0.234 ms  0.189 ms  0.201 ms
 2  192.168.1.1 (192.168.1.1)  1.234 ms  1.189 ms  1.201 ms
 3  192.168.30.10 (192.168.30.10)  2.234 ms  2.189 ms  2.201 ms`;

  const getCurrentOutput = () => {
    if (!currentTest) return '';
    
    switch (currentTest?.type) {
      case 'ping':
        return mockTestOutput;
      case 'traceroute':
        return mockTracerouteOutput;
      case 'port-scan':
        return `Starting Nmap scan on 192.168.10.11
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3389/tcp closed ms-wbt-server

Nmap done: 1 IP address scanned in 2.34 seconds`;
      default:
        return 'Test output will appear here...';
    }
  };

  const exportResults = () => {
    const data = testResults?.map(result => ({
      timestamp: result?.timestamp,
      source: result?.source,
      destination: result?.destination,
      type: result?.type,
      status: result?.status,
      duration: result?.duration,
      details: result?.details
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `network-test-results-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    a?.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Terminal" size={20} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Test Results</h3>
            <p className="text-sm text-muted-foreground">Real-time test output and analysis</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoScroll(!autoScroll)}
            iconName={autoScroll ? 'ScrollText' : 'Scroll'}
            iconPosition="left"
          >
            Auto-scroll
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportResults}
            disabled={testResults?.length === 0}
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>
      {/* Live Output Terminal */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Live Output</span>
            <div className="flex items-center space-x-2">
              {isTestRunning && (
                <div className="flex items-center space-x-1">
                  <Icon name="Loader" size={14} className="text-accent animate-spin" />
                  <span className="text-xs text-accent">Running...</span>
                </div>
              )}
              <span className="text-xs text-muted-foreground font-mono">
                {formatTimestamp(new Date())}
              </span>
            </div>
          </div>
          
          <div 
            ref={outputRef}
            className="bg-slate-900 text-green-400 font-mono text-sm p-4 rounded-lg h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
          >
            <pre className="whitespace-pre-wrap">
              {isTestRunning || currentTest ? getCurrentOutput() : 'Ready to run tests. Select source and destination hosts above.'}
            </pre>
          </div>
        </div>

        {/* Test History */}
        <div className="flex-1 p-4 min-h-0">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-foreground">Recent Tests</h4>
            <span className="text-xs text-muted-foreground">
              {testResults?.length} tests completed
            </span>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {testResults?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="TestTube" size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No test results yet</p>
                <p className="text-xs">Run your first test to see results here</p>
              </div>
            ) : (
              testResults?.slice(-10)?.reverse()?.map((result, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedResult(result)}
                  className={`p-3 border border-border rounded-lg cursor-pointer transition-colors duration-150 hover:bg-muted ${
                    selectedResult === result ? 'bg-muted border-primary' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={getStatusIcon(result?.status)} 
                        size={16} 
                        className={`${getStatusColor(result?.status)} ${result?.status === 'running' ? 'animate-spin' : ''}`}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {result?.type?.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(result?.timestamp)}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      {result?.duration}ms
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <span className="font-mono">{result?.source}</span>
                    <Icon name="ArrowRight" size={12} className="inline mx-1" />
                    <span className="font-mono">{result?.destination}</span>
                  </div>
                  
                  {result?.details && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {result?.details}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultsPanel;