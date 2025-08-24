'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface NewModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (modeName: string) => Promise<void>;
}

export default function NewModeModal({ isOpen, onClose, onSave }: NewModeModalProps) {
  const [modeName, setModeName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!modeName.trim()) {
      setError('Mode name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSave(modeName.trim());
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create mode');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setModeName('');
    setError(null);
    setIsLoading(false);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="modal-content new-mode-modal" 
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyPress}
      >
        <div className="modal-header">
          <h2 className="font-light">Create New Mode Collection</h2>
          <button 
            className="close-button" 
            onClick={handleClose}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="mode-name" className="form-label font-light">
              Mode Name
            </label>
            <input
              id="mode-name"
              type="text"
              className="form-input"
              value={modeName}
              onChange={(e) => {
                setModeName(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyPress}
              placeholder="e.g., Sunset, Ocean, Forest..."
              disabled={isLoading}
              autoFocus
            />
            <p className="form-help font-light">
              Create a new color collection theme. The name will be automatically formatted.
            </p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button 
            className="btn-secondary font-light" 
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className="btn-primary font-light" 
            onClick={handleSave}
            disabled={isLoading || !modeName.trim()}
          >
            {isLoading ? 'Creating...' : 'Create Mode'}
          </button>
        </div>
      </div>
    </div>
  );
}
