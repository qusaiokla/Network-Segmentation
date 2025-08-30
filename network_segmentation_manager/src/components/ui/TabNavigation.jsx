import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const TabNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationTabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/network-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Network overview and system status',
      badge: null
    },
    {
      id: 'design',
      label: 'Design',
      path: '/network-topology-designer',
      icon: 'Network',
      tooltip: 'Network topology creation and planning',
      badge: null
    },
    {
      id: 'configure',
      label: 'Configure',
      path: '/department-zone-configuration',
      icon: 'Settings',
      tooltip: 'Department zones and policy management',
      badge: null
    },
    {
      id: 'hosts',
      label: 'Hosts',
      path: '/virtual-host-management',
      icon: 'Server',
      tooltip: 'Virtual host lifecycle management',
      badge: 12
    },
    {
      id: 'test',
      label: 'Test',
      path: '/network-testing-dashboard',
      icon: 'TestTube',
      tooltip: 'Connectivity verification and validation',
      badge: null
    },
    {
      id: 'monitor',
      label: 'Monitor',
      path: '/network-monitoring',
      icon: 'Activity',
      tooltip: 'Performance analysis and compliance tracking',
      badge: 3
    }
  ];

  // Set active tab based on current route
  useEffect(() => {
    const currentTab = navigationTabs?.find(tab => tab?.path === location?.pathname);
    if (currentTab) {
      setActiveTab(currentTab?.id);
      localStorage.setItem('activeNetworkTab', currentTab?.id);
    }
  }, [location?.pathname]);

  // Load saved active tab on mount
  useEffect(() => {
    const savedTab = localStorage.getItem('activeNetworkTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab?.id);
    setIsMobileMenuOpen(false);
    localStorage.setItem('activeNetworkTab', tab?.id);
    navigate(tab?.path);
  };

  const handleKeyDown = (event, tab) => {
    if (event?.key === 'Enter' || event?.key === ' ') {
      event?.preventDefault();
      handleTabClick(tab);
    } else if (event?.key === 'ArrowLeft' || event?.key === 'ArrowRight') {
      event?.preventDefault();
      const currentIndex = navigationTabs?.findIndex(t => t?.id === activeTab);
      const nextIndex = event?.key === 'ArrowRight' 
        ? (currentIndex + 1) % navigationTabs?.length
        : (currentIndex - 1 + navigationTabs?.length) % navigationTabs?.length;
      
      const nextTab = navigationTabs?.[nextIndex];
      handleTabClick(nextTab);
    }
  };

  return (
    <>
      {/* Desktop Tab Navigation */}
      <nav 
        className="hidden md:block sticky top-16 z-[900] bg-card border-b border-border"
        role="tablist"
        aria-label="Network management navigation"
      >
        <div className="flex items-center px-6">
          {navigationTabs?.map((tab, index) => (
            <button
              key={tab?.id}
              role="tab"
              aria-selected={activeTab === tab?.id}
              aria-controls={`tabpanel-${tab?.id}`}
              tabIndex={activeTab === tab?.id ? 0 : -1}
              title={tab?.tooltip}
              onClick={() => handleTabClick(tab)}
              onKeyDown={(e) => handleKeyDown(e, tab)}
              className={`
                relative flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-150 ease-out
                hover:text-primary hover:bg-muted/50
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                ${activeTab === tab?.id 
                  ? 'text-primary bg-muted border-b-2 border-primary' :'text-muted-foreground border-b-2 border-transparent'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
              {tab?.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs font-mono bg-accent text-accent-foreground rounded-full">
                  {tab?.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>
      {/* Mobile Navigation */}
      <nav className="md:hidden sticky top-16 z-[900] bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            {navigationTabs?.find(tab => tab?.id === activeTab) && (
              <>
                <Icon 
                  name={navigationTabs?.find(tab => tab?.id === activeTab)?.icon} 
                  size={20} 
                  className="text-primary"
                />
                <span className="text-sm font-medium text-foreground">
                  {navigationTabs?.find(tab => tab?.id === activeTab)?.label}
                </span>
              </>
            )}
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors duration-150"
            aria-label="Toggle navigation menu"
          >
            <Icon 
              name={isMobileMenuOpen ? 'X' : 'Menu'} 
              size={20} 
            />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-popover border-b border-border shadow-floating z-[1100] animate-fade-in">
            <div className="p-4 space-y-2">
              {navigationTabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => handleTabClick(tab)}
                  className={`
                    w-full flex items-center justify-between p-3 text-sm font-medium rounded-lg transition-colors duration-150
                    hover:bg-muted
                    ${activeTab === tab?.id 
                      ? 'bg-muted text-primary border border-primary/20' :'text-popover-foreground'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon name={tab?.icon} size={18} />
                    <div className="text-left">
                      <div>{tab?.label}</div>
                      <div className="text-xs text-muted-foreground">{tab?.tooltip}</div>
                    </div>
                  </div>
                  {tab?.badge && (
                    <span className="px-2 py-1 text-xs font-mono bg-accent text-accent-foreground rounded-full">
                      {tab?.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[1050] md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default TabNavigation;