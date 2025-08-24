'use client';

import { useState } from 'react';
import { Plus, Settings, Trash2, Edit3, Lock, LogOut } from 'lucide-react';
import NewModeModal from './NewModeModal';
import PasswordModal from './PasswordModal';
import { useAuth } from '@/hooks/useAuth';
import type { ModeColors } from '@/types/colors';

interface ModeManagerProps {
  modes: Record<string, ModeColors>;
  onModeCreated: () => void;
  onModeDeleted: (modeName: string) => void;
  onModeRenamed: (oldName: string, newName: string) => void;
}

export default function ModeManager({ 
  modes, 
  onModeCreated, 
  onModeDeleted, 
  onModeRenamed 
}: ModeManagerProps) {
  const [showNewModeModal, setShowNewModeModal] = useState(false);
  const [showModesList, setShowModesList] = useState(false);
  const [editingMode, setEditingMode] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  
  const { 
    isAuthenticated, 
    showPasswordModal, 
    setShowPasswordModal, 
    validatePassword, 
    logout, 
    isLoading 
  } = useAuth();

  const handleCreateNewMode = async (modeName: string) => {
    try {
      const response = await fetch('/api/modes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modeName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create mode');
      }

      onModeCreated();
      setShowModesList(false);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteMode = async (modeName: string) => {
    if (!confirm(`Are you sure you want to delete the "${modeName}" mode? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/modes/${modeName}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete mode');
      }

      onModeDeleted(modeName);
    } catch (error) {
      console.error('Error deleting mode:', error);
      alert(`Failed to delete mode: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleStartRename = (modeName: string) => {
    setEditingMode(modeName);
    setNewName(modeName);
  };

  const handleSaveRename = async (oldName: string) => {
    if (!newName.trim() || newName.trim() === oldName) {
      setEditingMode(null);
      return;
    }

    try {
      const response = await fetch(`/api/modes/${oldName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newName: newName.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to rename mode');
      }

      onModeRenamed(oldName, newName.trim());
      setEditingMode(null);
    } catch (error) {
      console.error('Error renaming mode:', error);
      alert(`Failed to rename mode: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancelRename = () => {
    setEditingMode(null);
    setNewName('');
  };

  const modeNames = Object.keys(modes);
  const customModes = modeNames.filter(name => !['dark', 'light'].includes(name));

  return (
    <div className="mode-manager">
      <div className="mode-manager-controls">
        {isAuthenticated ? (
          <>
            <button
              className="btn-primary font-light mode-manager-button"
              onClick={() => setShowNewModeModal(true)}
              title="Create New Mode Collection"
            >
              <Plus size={16} />
              <span>New Mode</span>
            </button>
            
            <button
              className="btn-secondary font-light mode-manager-button"
              onClick={() => setShowModesList(!showModesList)}
              title="Manage Modes"
            >
              <Settings size={16} />
              <span>Manage ({modeNames.length})</span>
            </button>
            
            <button
              className="btn-outline font-light mode-manager-button logout-button"
              onClick={logout}
              title="Lock Features"
            >
              <LogOut size={16} />
              <span>Lock</span>
            </button>
          </>
        ) : (
          <button
            className="btn-primary font-light mode-manager-button reveal-features-button"
            onClick={() => setShowPasswordModal(true)}
            title="Enter password to reveal database management features"
          >
            <Lock size={16} />
            <span>Reveal Features</span>
          </button>
        )}
      </div>

      {isAuthenticated && showModesList && (
        <div className="modes-list-panel">
          <div className="modes-list-header">
            <h3 className="font-light">Available Modes</h3>
            <button
              className="close-panel-button"
              onClick={() => setShowModesList(false)}
            >
              ×
            </button>
          </div>
          
          <div className="modes-list">
            {modeNames.map(modeName => {
              const isBuiltIn = ['dark', 'light'].includes(modeName);
              const colorCount = modes[modeName]?.colors?.length || 0;
              
              return (
                <div key={modeName} className={`mode-item ${isBuiltIn ? 'built-in' : 'custom'}`}>
                  <div className="mode-info">
                    {editingMode === modeName ? (
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(modeName);
                          if (e.key === 'Escape') handleCancelRename();
                        }}
                        onBlur={() => handleSaveRename(modeName)}
                        className="mode-rename-input"
                        autoFocus
                      />
                    ) : (
                      <>
                        <div className="mode-name font-light">
                          {modeName}
                          {isBuiltIn && <span className="built-in-badge">Built-in</span>}
                        </div>
                        <div className="mode-stats font-light">
                          {colorCount} colors
                        </div>
                      </>
                    )}
                  </div>
                  
                  {!isBuiltIn && (
                    <div className="mode-actions">
                      {editingMode === modeName ? (
                        <button
                          className="action-button save"
                          onClick={() => handleSaveRename(modeName)}
                          title="Save"
                        >
                          ✓
                        </button>
                      ) : (
                        <>
                          <button
                            className="action-button edit"
                            onClick={() => handleStartRename(modeName)}
                            title="Rename Mode"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            className="action-button delete"
                            onClick={() => handleDeleteMode(modeName)}
                            title="Delete Mode"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            
            {customModes.length === 0 && (
              <div className="empty-modes-message">
                <p className="font-light">No custom modes yet.</p>
                <p className="font-light">Create your first custom color collection!</p>
              </div>
            )}
          </div>
        </div>
      )}

      <NewModeModal
        isOpen={isAuthenticated && showNewModeModal}
        onClose={() => setShowNewModeModal(false)}
        onSave={handleCreateNewMode}
      />
      
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onValidate={validatePassword}
        isLoading={isLoading}
      />
    </div>
  );
}
