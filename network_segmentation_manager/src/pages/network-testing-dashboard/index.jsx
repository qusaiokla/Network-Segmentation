import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import TestControlPanel from './components/TestControlPanel';
import TestResultsPanel from './components/TestResultsPanel';
import NetworkDiagram from './components/NetworkDiagram';
import TestHistoryPanel from './components/TestHistoryPanel';

const NetworkTestingDashboard = () => {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [activeView, setActiveView] = useState('results'); // 'results' or 'history'

  // Mock test results data
  const mockTestResults = [
    {
      id: 1,
      source: 'hr-ws-001',
      destination: 'hr-ws-002',
      type: 'ping',
      status: 'success',
      duration: 234,
      timestamp: new Date(Date.now() - 300000)?.toISOString(),
      details: '4 packets transmitted, 4 received, 0% packet loss'
    },
    {
      id: 2,
      source: 'it-srv-001',
      destination: 'fin-ws-001',
      type: 'traceroute',
      status: 'warning',
      duration: 1250,
      timestamp: new Date(Date.now() - 600000)?.toISOString(),
      details: 'Route found but high latency detected on hop 2'
    },
    {
      id: 3,
      source: 'fin-srv-001',
      destination: 'dmz-web-001',
      type: 'port-scan',
      status: 'failed',
      duration: 5000,
      timestamp: new Date(Date.now() - 900000)?.toISOString(),
      details: 'Connection timeout - firewall may be blocking traffic'
    },
    {
      id: 4,
      source: 'core-gw-001',
      destination: 'it-ws-001',
      type: 'ping',
      status: 'success',
      duration: 12,
      timestamp: new Date(Date.now() - 1200000)?.toISOString(),
      details: '4 packets transmitted, 4 received, 0% packet loss'
    },
    {
      id: 5,
      source: 'hr-ws-002',
      destination: 'fin-srv-001',
      type: 'bandwidth',
      status: 'success',
      duration: 3500,
      timestamp: new Date(Date.now() - 1800000)?.toISOString(),
      details: 'Throughput: 95.2 Mbps, Latency: 12ms'
    }
  ];

  useEffect(() => {
    setTestResults(mockTestResults);
  }, []);

  const handleRunTest = (testConfig) => {
    if (testConfig?.batchTests) {
      // Handle batch testing
      setIsTestRunning(true);
      setCurrentTest({ type: 'batch', ...testConfig });
      
      // Simulate batch test execution
      setTimeout(() => {
        const batchResults = testConfig?.batchTests?.map((test, index) => ({
          id: Date.now() + index,
          ...test,
          status: Math.random() > 0.2 ? 'success' : Math.random() > 0.5 ? 'warning' : 'failed',
          duration: Math.floor(Math.random() * 2000) + 100,
          details: `Batch test ${index + 1} completed`
        }));
        
        setTestResults(prev => [...batchResults, ...prev]);
        setIsTestRunning(false);
        setCurrentTest(null);
      }, 5000);
    } else {
      // Handle single test
      setIsTestRunning(true);
      setCurrentTest(testConfig);
      
      // Simulate test execution
      setTimeout(() => {
        const newResult = {
          id: Date.now(),
          ...testConfig,
          status: Math.random() > 0.15 ? 'success' : Math.random() > 0.5 ? 'warning' : 'failed',
          duration: Math.floor(Math.random() * 1500) + 50,
          details: generateTestDetails(testConfig?.type, testConfig?.source, testConfig?.destination)
        };
        
        setTestResults(prev => [newResult, ...prev]);
        setIsTestRunning(false);
        setCurrentTest(null);
      }, 3000);
    }
  };

  const generateTestDetails = (type, source, destination) => {
    switch (type) {
      case 'ping':
        return '4 packets transmitted, 4 received, 0% packet loss';
      case 'traceroute':
        return `Route to ${destination} found via 3 hops`;
      case 'port-scan':
        return 'Ports 22, 80, 443 open; 3389 filtered';
      case 'bandwidth':
        return `Throughput: ${(Math.random() * 100 + 50)?.toFixed(1)} Mbps`;
      case 'packet-capture':
        return `Captured ${Math.floor(Math.random() * 500 + 100)} packets`;
      case 'dns-lookup':
        return 'DNS resolution successful in 45ms';
      default:
        return 'Test completed successfully';
    }
  };

  const handleRerunTest = (testConfig) => {
    handleRunTest(testConfig);
  };

  const handleClearHistory = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      <main className="pt-32">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <QuickActionToolbar context="testing" />
          
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Network Testing Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time connectivity verification and network segmentation validation through integrated testing tools
            </p>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[calc(100vh-280px)]">
            {/* Test Control Panel - Top Section */}
            <div className="xl:col-span-12 h-64">
              <TestControlPanel
                onRunTest={handleRunTest}
                isTestRunning={isTestRunning}
                testResults={testResults}
              />
            </div>

            {/* Left Side - Test Results */}
            <div className="xl:col-span-6 min-h-0">
              <div className="flex flex-col h-full">
                {/* View Toggle */}
                <div className="flex items-center space-x-2 mb-4">
                  <button
                    onClick={() => setActiveView('results')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                      activeView === 'results' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Live Results
                  </button>
                  <button
                    onClick={() => setActiveView('history')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                      activeView === 'history' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Test History
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-h-0">
                  {activeView === 'results' ? (
                    <TestResultsPanel
                      testResults={testResults}
                      isTestRunning={isTestRunning}
                      currentTest={currentTest}
                    />
                  ) : (
                    <TestHistoryPanel
                      testResults={testResults}
                      onRerunTest={handleRerunTest}
                      onClearHistory={handleClearHistory}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Network Diagram */}
            <div className="xl:col-span-6 min-h-0">
              <NetworkDiagram
                currentTest={currentTest}
                testResults={testResults}
              />
            </div>
          </div>

          {/* Mobile Layout Adjustments */}
          <div className="xl:hidden mt-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>System Ready</span>
                </div>
                <span>•</span>
                <span>{testResults?.length} tests completed</span>
                <span>•</span>
                <span>
                  {testResults?.length > 0 
                    ? `${((testResults?.filter(r => r?.status === 'success')?.length / testResults?.length) * 100)?.toFixed(1)}% success rate`
                    : 'No tests yet'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NetworkTestingDashboard;