import React, { useState, useRef, useCallback } from 'react';
import Icon from '../../../components/AppIcon';

const DesignCanvas = ({ 
  zoomLevel, 
  isGridEnabled, 
  isSnapEnabled, 
  onElementSelect,
  selectedElement,
  onElementMove,
  onElementAdd
}) => {
  const [canvasElements, setCanvasElements] = useState([
    {
      id: 'vlan-1',
      type: 'vlan',
      name: 'HR VLAN',
      icon: 'Square',
      color: 'bg-blue-500',
      position: { x: 200, y: 150 },
      size: { width: 120, height: 80 },
      department: 'HR',
      ipRange: '192.168.10.0/24',
      connections: ['switch-1']
    },
    {
      id: 'vlan-2',
      type: 'vlan',
      name: 'IT VLAN',
      icon: 'Square',
      color: 'bg-green-500',
      position: { x: 400, y: 150 },
      size: { width: 120, height: 80 },
      department: 'IT',
      ipRange: '192.168.20.0/24',
      connections: ['switch-1']
    },
    {
      id: 'switch-1',
      type: 'switch',
      name: 'Core Switch',
      icon: 'GitBranch',
      color: 'bg-orange-500',
      position: { x: 300, y: 300 },
      size: { width: 100, height: 60 },
      connections: ['vlan-1', 'vlan-2', 'router-1']
    },
    {
      id: 'router-1',
      type: 'router',
      name: 'Main Router',
      icon: 'Router',
      color: 'bg-purple-500',
      position: { x: 300, y: 450 },
      size: { width: 100, height: 60 },
      connections: ['switch-1']
    }
  ]);

  const [draggedElement, setDraggedElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const snapToGrid = useCallback((value) => {
    if (!isSnapEnabled) return value;
    const gridSize = 20;
    return Math.round(value / gridSize) * gridSize;
  }, [isSnapEnabled]);

  const handleDrop = (e) => {
    e?.preventDefault();
    const rect = canvasRef?.current?.getBoundingClientRect();
    const x = snapToGrid((e?.clientX - rect?.left) / (zoomLevel / 100));
    const y = snapToGrid((e?.clientY - rect?.top) / (zoomLevel / 100));

    try {
      const componentData = JSON.parse(e?.dataTransfer?.getData('application/json'));
      const newElement = {
        id: `${componentData?.id}-${Date.now()}`,
        type: componentData?.id,
        name: `New ${componentData?.name}`,
        icon: componentData?.icon,
        color: componentData?.color,
        position: { x, y },
        size: { width: 100, height: 60 },
        connections: []
      };

      setCanvasElements(prev => [...prev, newElement]);
      onElementAdd(newElement);
    } catch (error) {
      console.error('Error parsing dropped component:', error);
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
  };

  const handleElementMouseDown = (e, element) => {
    e?.stopPropagation();
    const rect = canvasRef?.current?.getBoundingClientRect();
    const x = (e?.clientX - rect?.left) / (zoomLevel / 100);
    const y = (e?.clientY - rect?.top) / (zoomLevel / 100);
    
    setDraggedElement(element);
    setDragOffset({
      x: x - element?.position?.x,
      y: y - element?.position?.y
    });
    onElementSelect(element);
  };

  const handleMouseMove = (e) => {
    if (!draggedElement) return;

    const rect = canvasRef?.current?.getBoundingClientRect();
    const x = snapToGrid((e?.clientX - rect?.left) / (zoomLevel / 100) - dragOffset?.x);
    const y = snapToGrid((e?.clientY - rect?.top) / (zoomLevel / 100) - dragOffset?.y);

    setCanvasElements(prev => 
      prev?.map(el => 
        el?.id === draggedElement?.id 
          ? { ...el, position: { x, y } }
          : el
      )
    );
  };

  const handleMouseUp = () => {
    if (draggedElement) {
      onElementMove(draggedElement);
      setDraggedElement(null);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const renderConnections = () => {
    const connections = [];
    canvasElements?.forEach(element => {
      element?.connections?.forEach(connectionId => {
        const targetElement = canvasElements?.find(el => el?.id === connectionId);
        if (targetElement) {
          const startX = element?.position?.x + element?.size?.width / 2;
          const startY = element?.position?.y + element?.size?.height / 2;
          const endX = targetElement?.position?.x + targetElement?.size?.width / 2;
          const endY = targetElement?.position?.y + targetElement?.size?.height / 2;

          connections?.push(
            <line
              key={`${element?.id}-${connectionId}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="rgb(148 163 184)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          );
        }
      });
    });
    return connections;
  };

  const renderGridPattern = () => {
    if (!isGridEnabled) return null;

    const gridSize = 20;
    const canvasWidth = 2000;
    const canvasHeight = 1500;

    return (
      <defs>
        <pattern
          id="grid"
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke="rgb(226 232 240)"
            strokeWidth="0.5"
            opacity="0.5"
          />
        </pattern>
      </defs>
    );
  };

  return (
    <div className="flex-1 bg-background overflow-hidden relative">
      <div
        ref={canvasRef}
        className="w-full h-full overflow-auto cursor-crosshair"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: '0 0' }}
      >
        <svg
          width="2000"
          height="1500"
          className="absolute inset-0"
          style={{ minWidth: '2000px', minHeight: '1500px' }}
        >
          {renderGridPattern()}
          {isGridEnabled && (
            <rect
              width="100%"
              height="100%"
              fill="url(#grid)"
            />
          )}
          
          {/* Render connections */}
          <g className="connections">
            {renderConnections()}
          </g>
        </svg>

        {/* Render elements */}
        <div className="absolute inset-0" style={{ minWidth: '2000px', minHeight: '1500px' }}>
          {canvasElements?.map((element) => (
            <div
              key={element?.id}
              className={`absolute cursor-move select-none transition-shadow duration-150 ${
                selectedElement?.id === element?.id 
                  ? 'ring-2 ring-primary ring-offset-2' :'hover:shadow-lg'
              }`}
              style={{
                left: element?.position?.x,
                top: element?.position?.y,
                width: element?.size?.width,
                height: element?.size?.height
              }}
              onMouseDown={(e) => handleElementMouseDown(e, element)}
            >
              <div className={`w-full h-full ${element?.color} rounded-lg flex flex-col items-center justify-center text-white shadow-md border-2 border-white/20`}>
                <Icon name={element?.icon} size={24} color="white" />
                <span className="text-xs font-medium mt-1 text-center px-1 truncate">
                  {element?.name}
                </span>
              </div>
              
              {/* Department indicator */}
              {element?.department && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-background border border-border rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-foreground">
                    {element?.department?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Canvas instructions overlay */}
        {canvasElements?.length === 4 && (
          <div className="absolute top-10 left-10 bg-card border border-border rounded-lg p-4 shadow-lg max-w-sm">
            <div className="flex items-start space-x-3">
              <Icon name="Lightbulb" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-foreground mb-1">Getting Started</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Drag components from the left palette onto this canvas. Click on elements to configure their properties in the right panel.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Canvas info overlay */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span>Elements: {canvasElements?.length}</span>
          <span>Zoom: {zoomLevel}%</span>
          <span>Grid: {isGridEnabled ? 'On' : 'Off'}</span>
        </div>
      </div>
    </div>
  );
};

export default DesignCanvas;