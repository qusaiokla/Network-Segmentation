import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [networkStatus, setNetworkStatus] = useState({
    status: 'healthy',
    activeConnections: 247,
    alerts: 3
  });

  // Simulate real-time network status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkStatus(prev => ({
        ...prev,
        activeConnections: prev?.activeConnections + Math.floor(Math.random() * 10) - 5,
        alerts: Math.max(0, prev?.alerts + Math.floor(Math.random() * 3) - 1)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'critical': return 'XCircle';
      default: return 'Circle';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Network" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground leading-none">
                Network Segmentation Manager
              </h1>
              <span className="text-xs text-muted-foreground font-mono">
                v2.4.1
              </span>
            </div>
          </div>
        </div>

        {/* Status and User Section */}
        <div className="flex items-center space-x-6">
          {/* Network Status Indicator */}
          <div className="hidden md:flex items-center space-x-4 px-4 py-2 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon 
                name={getStatusIcon(networkStatus?.status)} 
                size={16} 
                className={getStatusColor(networkStatus?.status)}
              />
              <span className="text-sm font-medium text-foreground capitalize">
                {networkStatus?.status}
              </span>
            </div>
            <div className="w-px h-4 bg-border"></div>
            <div className="flex items-center space-x-2">
              <Icon name="Activity" size={14} className="text-muted-foreground" />
              <span className="text-sm font-mono text-foreground">
                {networkStatus?.activeConnections}
              </span>
            </div>
            {networkStatus?.alerts > 0 && (
              <>
                <div className="w-px h-4 bg-border"></div>
                <div className="flex items-center space-x-2">
                  <Icon name="Bell" size={14} className="text-warning" />
                  <span className="text-sm font-mono text-warning">
                    {networkStatus?.alerts}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Mobile Status Indicator */}
          <div className="md:hidden flex items-center space-x-2">
            <Icon 
              name={getStatusIcon(networkStatus?.status)} 
              size={20} 
              className={getStatusColor(networkStatus?.status)}
            />
            {networkStatus?.alerts > 0 && (
              <div className="relative">
                <Icon name="Bell" size={20} className="text-warning" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-warning text-warning-foreground text-xs rounded-full flex items-center justify-center font-mono">
                  {networkStatus?.alerts}
                </span>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 px-3"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium text-foreground">Admin</span>
                <span className="text-xs text-muted-foreground">Network Admin</span>
              </div>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`text-muted-foreground transition-transform duration-150 ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-floating z-[1100] animate-fade-in">
                <div className="p-3 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} color="white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-popover-foreground">Administrator</p>
                      <p className="text-xs text-muted-foreground">admin@company.com</p>
                      <p className="text-xs text-muted-foreground font-mono">ID: NET-001</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-150"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Account Settings</span>
                  </button>
                  
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-150"
                  >
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                  
                  <div className="my-1 h-px bg-border"></div>
                  
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      // Handle logout
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-error hover:bg-muted rounded-md transition-colors duration-150"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-[1050]" 
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;