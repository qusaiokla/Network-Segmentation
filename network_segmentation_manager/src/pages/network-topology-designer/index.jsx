import React, { useState, useCallback } from 'react';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';

import ComponentPalette from './components/ComponentPalette';
import CanvasToolbar from './components/CanvasToolbar';
import DesignCanvas from './components/DesignCanvas';
import PropertiesPanel from './components/PropertiesPanel';
import ValidationPanel from './components/ValidationPanel';

const NetworkTopologyDesigner = () => {
  // Canvas state
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isGridEnabled, setIsGridEnabled] = useState(true);
  const [isSnapEnabled, setIsSnapEnabled] = useState(true);
  const [isPaletteCollapsed, setIsPaletteCollapsed] = useState(false);
  
  // Element management
  const [selectedElement, setSelectedElement] = useState(null);
  const [canvasElements, setCanvasElements] = useState([]);
  
  // History management
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // UI state
  const [isValidationVisible, setIsValidationVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  // Canvas controls
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 25, 25));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(100);
  }, []);

  const handleToggleGrid = useCallback(() => {
    setIsGridEnabled(prev => !prev);
  }, []);

  const handleToggleSnap = useCallback(() => {
    setIsSnapEnabled(prev => !prev);
  }, []);

  // History management
  const addToHistory = useCallback((elements) => {
    const newHistory = history?.slice(0, historyIndex + 1);
    newHistory?.push(JSON.parse(JSON.stringify(elements)));
    setHistory(newHistory);
    setHistoryIndex(newHistory?.length - 1);
  }, [history, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setCanvasElements(history?.[historyIndex - 1]);
      setSelectedElement(null);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history?.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setCanvasElements(history?.[historyIndex + 1]);
      setSelectedElement(null);
    }
  }, [history, historyIndex]);

  // Element management
  const handleElementAdd = useCallback((element) => {
    const newElements = [...canvasElements, element];
    setCanvasElements(newElements);
    addToHistory(newElements);
    setSelectedElement(element);
  }, [canvasElements, addToHistory]);

  const handleElementSelect = useCallback((element) => {
    setSelectedElement(element);
  }, []);

  const handleElementUpdate = useCallback((updatedElement) => {
    const newElements = canvasElements?.map(el => 
      el?.id === updatedElement?.id ? updatedElement : el
    );
    setCanvasElements(newElements);
    addToHistory(newElements);
    setSelectedElement(updatedElement);
  }, [canvasElements, addToHistory]);

  const handleElementDelete = useCallback((elementId) => {
    const newElements = canvasElements?.filter(el => el?.id !== elementId);
    setCanvasElements(newElements);
    addToHistory(newElements);
    setSelectedElement(null);
  }, [canvasElements, addToHistory]);

  const handleElementMove = useCallback((element) => {
    const newElements = canvasElements?.map(el => 
      el?.id === element?.id ? element : el
    );
    setCanvasElements(newElements);
    addToHistory(newElements);
  }, [canvasElements, addToHistory]);

  // Action handlers
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    console.log('Configuration saved:', canvasElements);
  };

  const handleValidate = async () => {
    setIsValidating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsValidating(false);
    setIsValidationVisible(true);
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsDeploying(false);
    console.log('Deployed to test environment:', canvasElements);
  };

  const handleFixIssue = (issue) => {
    // Auto-fix logic based on issue type
    if (issue?.id?.startsWith('security-')) {
      const elementId = issue?.elements?.[0];
      const element = canvasElements?.find(el => el?.id === elementId);
      if (element) {
        const updatedElement = {
          ...element,
          firewallEnabled: true,
          aclEnabled: true
        };
        handleElementUpdate(updatedElement);
      }
    } else if (issue?.id?.startsWith('department-')) {
      const elementId = issue?.elements?.[0];
      const element = canvasElements?.find(el => el?.id === elementId);
      if (element) {
        const updatedElement = {
          ...element,
          department: 'IT' // Default assignment
        };
        handleElementUpdate(updatedElement);
      }
    }
  };

  const handleDragStart = (component) => {
    console.log('Dragging component:', component);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <CanvasToolbar
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSave={handleSave}
          onValidate={handleValidate}
          onDeploy={handleDeploy}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history?.length - 1}
          isGridEnabled={isGridEnabled}
          onToggleGrid={handleToggleGrid}
          isSnapEnabled={isSnapEnabled}
          onToggleSnap={handleToggleSnap}
          isSaving={isSaving}
          isValidating={isValidating}
          isDeploying={isDeploying}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <ComponentPalette
            onDragStart={handleDragStart}
            isCollapsed={isPaletteCollapsed}
            onToggleCollapse={() => setIsPaletteCollapsed(!isPaletteCollapsed)}
          />
          
          <DesignCanvas
            zoomLevel={zoomLevel}
            isGridEnabled={isGridEnabled}
            isSnapEnabled={isSnapEnabled}
            onElementSelect={handleElementSelect}
            selectedElement={selectedElement}
            onElementMove={handleElementMove}
            onElementAdd={handleElementAdd}
          />
          
          <PropertiesPanel
            selectedElement={selectedElement}
            onElementUpdate={handleElementUpdate}
            onElementDelete={handleElementDelete}
          />
        </div>
      </div>
      <ValidationPanel
        isVisible={isValidationVisible}
        onClose={() => setIsValidationVisible(false)}
        elements={canvasElements}
        onFixIssue={handleFixIssue}
      />
      {/* Mobile responsive message */}
      <div className="md:hidden fixed inset-0 bg-background z-[1300] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Desktop Required</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Network Topology Designer requires a desktop or tablet device for optimal experience. 
            Please access this tool from a larger screen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NetworkTopologyDesigner;