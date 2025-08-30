import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CanvasToolbar = ({ 
  zoomLevel, 
  onZoomIn, 
  onZoomOut, 
  onResetZoom,
  onUndo,
  onRedo,
  onSave,
  onValidate,
  onDeploy,
  canUndo,
  canRedo,
  isGridEnabled,
  onToggleGrid,
  isSnapEnabled,
  onToggleSnap,
  isSaving,
  isValidating,
  isDeploying
}) => {
  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Canvas Controls */}
        <div className="flex items-center space-x-4">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
            <button
              onClick={onZoomOut}
              disabled={zoomLevel <= 25}
              className="p-2 hover:bg-background rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom out"
            >
              <Icon name="ZoomOut" size={16} className="text-muted-foreground" />
            </button>
            <span className="text-sm font-mono text-foreground min-w-[60px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={onZoomIn}
              disabled={zoomLevel >= 200}
              className="p-2 hover:bg-background rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom in"
            >
              <Icon name="ZoomIn" size={16} className="text-muted-foreground" />
            </button>
            <div className="w-px h-6 bg-border"></div>
            <button
              onClick={onResetZoom}
              className="p-2 hover:bg-background rounded-md transition-colors duration-150"
              title="Reset zoom"
            >
              <Icon name="RotateCcw" size={16} className="text-muted-foreground" />
            </button>
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2 hover:bg-background rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Icon name="Undo" size={16} className="text-muted-foreground" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2 hover:bg-background rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Icon name="Redo" size={16} className="text-muted-foreground" />
            </button>
          </div>

          {/* Grid and Snap Controls */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <button
              onClick={onToggleGrid}
              className={`p-2 rounded-md transition-colors duration-150 ${
                isGridEnabled 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-background text-muted-foreground'
              }`}
              title="Toggle grid"
            >
              <Icon name="Grid3x3" size={16} />
            </button>
            <button
              onClick={onToggleSnap}
              className={`p-2 rounded-md transition-colors duration-150 ${
                isSnapEnabled 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-background text-muted-foreground'
              }`}
              title="Toggle snap to grid"
            >
              <Icon name="Magnet" size={16} />
            </button>
          </div>
        </div>

        {/* Right Side - Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            loading={isSaving}
            iconName="Save"
            iconPosition="left"
          >
            Save Configuration
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={onValidate}
            loading={isValidating}
            iconName="CheckCircle"
            iconPosition="left"
          >
            Validate Design
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={onDeploy}
            loading={isDeploying}
            iconName="Play"
            iconPosition="left"
          >
            Deploy to Test
          </Button>
        </div>
      </div>
      {/* Status Bar */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Layers" size={12} />
            <span>Canvas: {zoomLevel}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Grid3x3" size={12} />
            <span>Grid: {isGridEnabled ? 'On' : 'Off'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Magnet" size={12} />
            <span>Snap: {isSnapEnabled ? 'On' : 'Off'}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Icon name="Clock" size={12} />
          <span>Last saved: {new Date()?.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CanvasToolbar;