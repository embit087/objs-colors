'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { ColorData } from '@/types/colors';

interface ColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (colorData: Omit<ColorData, 'id'>) => Promise<void>;
  initialColor?: ColorData;
  mode: 'add' | 'edit';
  modeType: string;
}

export default function ColorModal({
  isOpen,
  onClose,
  onSave,
  initialColor,
  mode,
  modeType
}: ColorModalProps) {
  const [name, setName] = useState('');
  const [hex, setHex] = useState('#000000');
  const [isHoverCard, setIsHoverCard] = useState(false);
  const [hoverHex, setHoverHex] = useState('#000000');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialColor) {
      setName(initialColor.name || '');
      setHex(initialColor.color.hex);
      setIsHoverCard(initialColor.isHoverCard || false);
      setHoverHex(initialColor.hoverState?.hoverHex || initialColor.color.hex);
    } else {
      // Reset form for new color
      setName('');
      // Set default colors based on mode type
      if (modeType === 'dark') {
        setHex('#1E293B');
        setHoverHex('#3B82F6');
      } else if (modeType === 'light') {
        setHex('#F1F5F9');
        setHoverHex('#2563EB');
      } else {
        // For custom modes, use neutral defaults
        setHex('#6B7280');
        setHoverHex('#3B82F6');
      }
      setIsHoverCard(false);
    }
  }, [initialColor, isOpen, modeType]);

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 'rgb(0, 0, 0)';
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a color name');
      return;
    }

    setIsSaving(true);
    try {
      const colorData: Omit<ColorData, 'id'> = {
        name: name.trim(),
        color: {
          hex,
          rgb: hexToRgb(hex)
        },
        isHoverCard,
        ...(isHoverCard && {
          hoverState: {
            hex,
            rgb: hexToRgb(hex),
            hoverHex,
            hoverRgb: hexToRgb(hoverHex)
          }
        })
      };

      await onSave(colorData);
      onClose();
    } catch (error) {
      console.error('Error saving color:', error);
      alert('Failed to save color. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'add' ? 'Add New Color' : 'Edit Color'}</h2>
          <button className="modal-close" onClick={handleClose} disabled={isSaving}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="colorName">Color Name</label>
            <input
              id="colorName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Primary Background"
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="colorHex">Hex Color</label>
            <div className="color-input-group">
              <input
                id="colorHex"
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                disabled={isSaving}
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#000000"
                pattern="^#[0-9A-Fa-f]{6}$"
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isHoverCard}
                onChange={(e) => setIsHoverCard(e.target.checked)}
                disabled={isSaving}
              />
              <span>Interactive Hover Effect</span>
            </label>
          </div>

          {isHoverCard && (
            <div className="form-group">
              <label htmlFor="hoverHex">Hover Color</label>
              <div className="color-input-group">
                <input
                  id="hoverHex"
                  type="color"
                  value={hoverHex}
                  onChange={(e) => setHoverHex(e.target.value)}
                  disabled={isSaving}
                />
                <input
                  type="text"
                  value={hoverHex}
                  onChange={(e) => setHoverHex(e.target.value)}
                  placeholder="#000000"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  disabled={isSaving}
                />
              </div>
            </div>
          )}

          <div className="color-preview">
            <div className="preview-label">Preview:</div>
            <div 
              className="preview-swatch"
              style={{ backgroundColor: hex }}
              title={`${hex} | ${hexToRgb(hex)}`}
            >
              {isHoverCard && (
                <div 
                  className="preview-hover"
                  style={{ backgroundColor: hoverHex }}
                  title={`Hover: ${hoverHex} | ${hexToRgb(hoverHex)}`}
                />
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn-secondary" 
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Color'}
          </button>
        </div>
      </div>
    </div>
  );
}
