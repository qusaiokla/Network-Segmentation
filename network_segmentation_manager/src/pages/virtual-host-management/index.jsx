import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import StatsCards from './components/StatsCards';
import FilterBar from './components/FilterBar';
import HostTable from './components/HostTable';
import CreateHostModal from './components/CreateHostModal';
import BulkActionsDropdown from './components/BulkActionsDropdown';
import HostDetailPanel from './components/HostDetailPanel';

const VirtualHostManagement = () => {
  const [hosts, setHosts] = useState([]);
  const [selectedHosts, setSelectedHosts] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    status: '',
    ipRange: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'hostname',
    direction: 'asc'
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for virtual hosts
  const mockHosts = [
    {
      id: 1,
      hostname: 'web-server-01',
      department: 'IT',
      ipAddress: '192.168.1.100',
      subnet: '192.168.1.0/24',
      namespace: 'ns-web-01',
      status: 'running',
      resourceUsage: { cpu: 45, memory: 62, disk: 35 },
      resourceAllocation: { cpu: 4, memory: 8, disk: 100 },
      lastActivity: new Date(Date.now() - 300000),
      description: 'Primary web server for IT applications',
      createdAt: new Date(Date.now() - 86400000 * 7),
      startTime: new Date(Date.now() - 86400000 * 2)
    },
    {
      id: 2,
      hostname: 'hr-portal-01',
      department: 'HR',
      ipAddress: '192.168.2.50',
      subnet: '192.168.2.0/24',
      namespace: 'ns-hr-01',
      status: 'running',
      resourceUsage: { cpu: 23, memory: 41, disk: 28 },
      resourceAllocation: { cpu: 2, memory: 4, disk: 50 },
      lastActivity: new Date(Date.now() - 600000),
      description: 'HR portal and employee management system',
      createdAt: new Date(Date.now() - 86400000 * 14),
      startTime: new Date(Date.now() - 86400000 * 5)
    },
    {
      id: 3,
      hostname: 'finance-db-01',
      department: 'Finance',
      ipAddress: '192.168.3.25',
      subnet: '192.168.3.0/24',
      namespace: 'ns-fin-db-01',
      status: 'stopped',
      resourceUsage: { cpu: 0, memory: 0, disk: 45 },
      resourceAllocation: { cpu: 8, memory: 16, disk: 200 },
      lastActivity: new Date(Date.now() - 1800000),
      description: 'Financial database server with encrypted storage',
      createdAt: new Date(Date.now() - 86400000 * 21)
    },
    {
      id: 4,
      hostname: 'marketing-cms-01',
      department: 'Marketing',
      ipAddress: '192.168.4.75',
      subnet: '192.168.4.0/24',
      namespace: 'ns-mkt-cms-01',
      status: 'starting',
      resourceUsage: { cpu: 15, memory: 25, disk: 18 },
      resourceAllocation: { cpu: 2, memory: 4, disk: 50 },
      lastActivity: new Date(Date.now() - 120000),
      description: 'Content management system for marketing campaigns',
      createdAt: new Date(Date.now() - 86400000 * 3)
    },
    {
      id: 5,
      hostname: 'it-backup-01',
      department: 'IT',
      ipAddress: '192.168.1.200',
      subnet: '192.168.1.0/24',
      namespace: 'ns-backup-01',
      status: 'running',
      resourceUsage: { cpu: 12, memory: 35, disk: 78 },
      resourceAllocation: { cpu: 4, memory: 8, disk: 500 },
      lastActivity: new Date(Date.now() - 900000),
      description: 'Automated backup and disaster recovery system',
      createdAt: new Date(Date.now() - 86400000 * 30),
      startTime: new Date(Date.now() - 86400000 * 1)
    },
    {
      id: 6,
      hostname: 'hr-analytics-01',
      department: 'HR',
      ipAddress: '192.168.2.100',
      subnet: '192.168.2.0/24',
      namespace: 'ns-hr-analytics-01',
      status: 'error',
      resourceUsage: { cpu: 0, memory: 0, disk: 22 },
      resourceAllocation: { cpu: 2, memory: 4, disk: 100 },
      lastActivity: new Date(Date.now() - 3600000),
      description: 'HR analytics and reporting platform',
      createdAt: new Date(Date.now() - 86400000 * 10)
    },
    {
      id: 7,
      hostname: 'finance-api-01',
      department: 'Finance',
      ipAddress: '192.168.3.150',
      subnet: '192.168.3.0/24',
      namespace: 'ns-fin-api-01',
      status: 'running',
      resourceUsage: { cpu: 38, memory: 55, disk: 42 },
      resourceAllocation: { cpu: 4, memory: 8, disk: 100 },
      lastActivity: new Date(Date.now() - 180000),
      description: 'Financial services API gateway',
      createdAt: new Date(Date.now() - 86400000 * 5),
      startTime: new Date(Date.now() - 86400000 * 4)
    },
    {
      id: 8,
      hostname: 'marketing-analytics-01',
      department: 'Marketing',
      ipAddress: '192.168.4.125',
      subnet: '192.168.4.0/24',
      namespace: 'ns-mkt-analytics-01',
      status: 'running',
      resourceUsage: { cpu: 28, memory: 48, disk: 33 },
      resourceAllocation: { cpu: 2, memory: 4, disk: 100 },
      lastActivity: new Date(Date.now() - 450000),
      description: 'Marketing campaign analytics and tracking',
      createdAt: new Date(Date.now() - 86400000 * 8),
      startTime: new Date(Date.now() - 86400000 * 6)
    },
    {
      id: 9,
      hostname: 'it-monitoring-01',
      department: 'IT',
      ipAddress: '192.168.1.250',
      subnet: '192.168.1.0/24',
      namespace: 'ns-monitoring-01',
      status: 'running',
      resourceUsage: { cpu: 52, memory: 68, disk: 55 },
      resourceAllocation: { cpu: 4, memory: 8, disk: 200 },
      lastActivity: new Date(Date.now() - 60000),
      description: 'Network monitoring and alerting system',
      createdAt: new Date(Date.now() - 86400000 * 15),
      startTime: new Date(Date.now() - 86400000 * 12)
    },
    {
      id: 10,
      hostname: 'finance-reporting-01',
      department: 'Finance',
      ipAddress: '192.168.3.175',
      subnet: '192.168.3.0/24',
      namespace: 'ns-fin-report-01',
      status: 'stopped',
      resourceUsage: { cpu: 0, memory: 0, disk: 38 },
      resourceAllocation: { cpu: 2, memory: 4, disk: 100 },
      lastActivity: new Date(Date.now() - 7200000),
      description: 'Financial reporting and compliance system',
      createdAt: new Date(Date.now() - 86400000 * 12)
    },
    {
      id: 11,
      hostname: 'hr-training-01',
      department: 'HR',
      ipAddress: '192.168.2.175',
      subnet: '192.168.2.0/24',
      namespace: 'ns-hr-training-01',
      status: 'running',
      resourceUsage: { cpu: 18, memory: 32, disk: 25 },
      resourceAllocation: { cpu: 2, memory: 4, disk: 50 },
      lastActivity: new Date(Date.now() - 720000),
      description: 'Employee training and development platform',
      createdAt: new Date(Date.now() - 86400000 * 6),
      startTime: new Date(Date.now() - 86400000 * 3)
    },
    {
      id: 12,
      hostname: 'marketing-email-01',
      department: 'Marketing',
      ipAddress: '192.168.4.200',
      subnet: '192.168.4.0/24',
      namespace: 'ns-mkt-email-01',
      status: 'running',
      resourceUsage: { cpu: 35, memory: 45, disk: 40 },
      resourceAllocation: { cpu: 4, memory: 8, disk: 100 },
      lastActivity: new Date(Date.now() - 240000),
      description: 'Email marketing automation platform',
      createdAt: new Date(Date.now() - 86400000 * 9),
      startTime: new Date(Date.now() - 86400000 * 7)
    }
  ];

  // Initialize hosts data
  useEffect(() => {
    const loadHosts = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHosts(mockHosts);
      setIsLoading(false);
    };

    loadHosts();
  }, []);

  // Filter and sort hosts
  const filteredAndSortedHosts = useMemo(() => {
    let filtered = hosts?.filter(host => {
      const matchesSearch = !filters?.search || 
        host?.hostname?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        host?.ipAddress?.includes(filters?.search) ||
        host?.namespace?.toLowerCase()?.includes(filters?.search?.toLowerCase());
      
      const matchesDepartment = !filters?.department || host?.department === filters?.department;
      const matchesStatus = !filters?.status || host?.status === filters?.status;
      const matchesIpRange = !filters?.ipRange || host?.subnet === filters?.ipRange;

      return matchesSearch && matchesDepartment && matchesStatus && matchesIpRange;
    });

    // Sort hosts
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (sortConfig?.key === 'lastActivity') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [hosts, filters, sortConfig]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      department: '',
      status: '',
      ipRange: ''
    });
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectHost = (hostId) => {
    setSelectedHosts(prev => 
      prev?.includes(hostId) 
        ? prev?.filter(id => id !== hostId)
        : [...prev, hostId]
    );
  };

  const handleSelectAll = () => {
    if (selectedHosts?.length === filteredAndSortedHosts?.length) {
      setSelectedHosts([]);
    } else {
      setSelectedHosts(filteredAndSortedHosts?.map(host => host?.id));
    }
  };

  const handleCreateHost = (newHost) => {
    setHosts(prev => [...prev, newHost]);
    // Simulate status change from starting to running
    setTimeout(() => {
      setHosts(prev => prev?.map(host => 
        host?.id === newHost?.id 
          ? { ...host, status: 'running', startTime: new Date() }
          : host
      ));
    }, 3000);
  };

  const handleUpdateHost = (updatedHost) => {
    setHosts(prev => prev?.map(host => 
      host?.id === updatedHost?.id ? updatedHost : host
    ));
  };

  const handleHostAction = async (action, host) => {
    switch (action) {
      case 'start':
        setHosts(prev => prev?.map(h => 
          h?.id === host?.id 
            ? { ...h, status: 'starting', lastActivity: new Date() }
            : h
        ));
        setTimeout(() => {
          setHosts(prev => prev?.map(h => 
            h?.id === host?.id 
              ? { ...h, status: 'running', startTime: new Date() }
              : h
          ));
        }, 2000);
        break;
      
      case 'stop':
        setHosts(prev => prev?.map(h => 
          h?.id === host?.id 
            ? { ...h, status: 'stopped', lastActivity: new Date(), startTime: null }
            : h
        ));
        break;
      
      case 'restart':
        setHosts(prev => prev?.map(h => 
          h?.id === host?.id 
            ? { ...h, status: 'starting', lastActivity: new Date() }
            : h
        ));
        setTimeout(() => {
          setHosts(prev => prev?.map(h => 
            h?.id === host?.id 
              ? { ...h, status: 'running', startTime: new Date() }
              : h
          ));
        }, 3000);
        break;
      
      case 'delete':
        const confirmed = window.confirm(`Are you sure you want to delete ${host?.hostname}? This action cannot be undone.`);
        if (confirmed) {
          setHosts(prev => prev?.filter(h => h?.id !== host?.id));
          setSelectedHosts(prev => prev?.filter(id => id !== host?.id));
        }
        break;
      
      case 'configure':
        setSelectedHost(host);
        setIsDetailPanelOpen(true);
        break;
      
      case 'console':
        console.log(`Opening console for ${host?.hostname}`);
        break;
    }
  };

  const handleBulkAction = async (action, hostIds) => {
    const hostsToUpdate = hosts?.filter(host => hostIds?.includes(host?.id));
    
    switch (action) {
      case 'start':
        setHosts(prev => prev?.map(host => 
          hostIds?.includes(host?.id) 
            ? { ...host, status: 'starting', lastActivity: new Date() }
            : host
        ));
        setTimeout(() => {
          setHosts(prev => prev?.map(host => 
            hostIds?.includes(host?.id) 
              ? { ...host, status: 'running', startTime: new Date() }
              : host
          ));
        }, 2000);
        break;
      
      case 'stop':
        setHosts(prev => prev?.map(host => 
          hostIds?.includes(host?.id) 
            ? { ...host, status: 'stopped', lastActivity: new Date(), startTime: null }
            : host
        ));
        break;
      
      case 'restart':
        setHosts(prev => prev?.map(host => 
          hostIds?.includes(host?.id) 
            ? { ...host, status: 'starting', lastActivity: new Date() }
            : host
        ));
        setTimeout(() => {
          setHosts(prev => prev?.map(host => 
            hostIds?.includes(host?.id) 
              ? { ...host, status: 'running', startTime: new Date() }
              : host
          ));
        }, 3000);
        break;
      
      case 'delete':
        setHosts(prev => prev?.filter(host => !hostIds?.includes(host?.id)));
        setSelectedHosts([]);
        break;
    }
  };

  const handleRowClick = (host) => {
    setSelectedHost(host);
    setIsDetailPanelOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <TabNavigation />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <Icon name="Loader" size={24} className="text-primary animate-spin" />
            <span className="text-lg text-muted-foreground">Loading virtual hosts...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-foreground mb-2">Virtual Host Management</h1>
              <p className="text-muted-foreground">
                Manage virtual hosts across network segments and monitor resource utilization
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <BulkActionsDropdown
                selectedHosts={selectedHosts}
                onBulkAction={handleBulkAction}
                disabled={selectedHosts?.length === 0}
              />
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Virtual Host
              </Button>
            </div>
          </div>

          <QuickActionToolbar context="hosts" />

          {/* Stats Cards */}
          <StatsCards hosts={hosts} />

          {/* Filter Bar */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            totalHosts={hosts?.length}
            filteredCount={filteredAndSortedHosts?.length}
          />

          {/* Host Table */}
          <HostTable
            hosts={filteredAndSortedHosts}
            selectedHosts={selectedHosts}
            onSelectHost={handleSelectHost}
            onSelectAll={handleSelectAll}
            onHostAction={handleHostAction}
            onRowClick={handleRowClick}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        </div>
      </main>
      {/* Modals */}
      <CreateHostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateHost={handleCreateHost}
      />
      <HostDetailPanel
        host={selectedHost}
        isOpen={isDetailPanelOpen}
        onClose={() => {
          setIsDetailPanelOpen(false);
          setSelectedHost(null);
        }}
        onUpdateHost={handleUpdateHost}
        onHostAction={handleHostAction}
      />
    </div>
  );
};

export default VirtualHostManagement;