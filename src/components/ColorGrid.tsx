'use client';

import { useState, useEffect } from 'react';
import ModeSection from './ModeSection';
import ColorModal from './ColorModal';
import ModeManager from './ModeManager';
import type { ColorsConfig, ColorData } from '@/types/colors';

interface ColorGridProps {
  colorsConfig: ColorsConfig;
  onColorsChange: () => void;
}

export default function ColorGrid({ colorsConfig, onColorsChange }: ColorGridProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedMode, setSelectedMode] = useState<string>('dark');
  const [editingColor, setEditingColor] = useState<ColorData | undefined>();
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);

  const handleAddColor = (mode: string) => {
    setSelectedMode(mode);
    setModalMode('add');
    setEditingColor(undefined);
    setModalOpen(true);
  };

  const handleEditColor = (colorData: ColorData) => {
    // Extract mode from color ID (format: "mode_colorIndex" or "mode-colorIndex")
    const modeName = colorData.id.split(/[_-]/)[0];
    setSelectedMode(modeName);
    setModalMode('edit');
    setEditingColor(colorData);
    setModalOpen(true);
  };

  const handleDeleteColor = async (colorId: string) => {
    try {
      const response = await fetch(`/api/colors/${colorId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete color');
      }

      onColorsChange(); // Refresh the colors
    } catch (error) {
      console.error('Error deleting color:', error);
      alert('Failed to delete color. Please try again.');
    }
  };

  const handleSaveColor = async (colorData: Omit<ColorData, 'id'>) => {
    try {
      if (modalMode === 'add') {
        // Add new color
        const response = await fetch(`/api/colors/add/${selectedMode}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(colorData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to add color');
        }
      } else if (editingColor) {
        // Update existing color
        const response = await fetch(`/api/colors/${editingColor.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(colorData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update color');
        }
      }

      onColorsChange(); // Refresh the colors
    } catch (error) {
      console.error('Error saving color:', error);
      throw error; // Re-throw to be handled by the modal
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingColor(undefined);
  };

  // Get modes - handle both new and legacy formats
  const modes = colorsConfig.modes || {
    dark: colorsConfig.darkMode!,
    light: colorsConfig.lightMode!,
  };

  const handleModeCreated = () => {
    onColorsChange();
  };

  const handleModeDeleted = (modeName: string) => {
    onColorsChange();
  };

  const handleModeRenamed = (oldName: string, newName: string) => {
    onColorsChange();
  };

  const handleColorCardClick = (colorId: string) => {
    setSelectedColorId(colorId);
  };

  const handleClickAway = () => {
    setSelectedColorId(null);
  };

  // Add click handler to the container to handle click-away
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if click was on a color card or its children
      if (!target.closest('.color-card') && !target.closest('.color-feature-card')) {
        setSelectedColorId(null);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  return (
    <>
      <div className="container">
        <div className="mode-controls">
          <ModeManager 
            modes={modes}
            onModeCreated={handleModeCreated}
            onModeDeleted={handleModeDeleted}
            onModeRenamed={handleModeRenamed}
          />
        </div>

        <div className="modes-container">
          {Object.entries(modes).map(([modeName, modeData]) => (
            <ModeSection 
              key={modeName}
              modeData={modeData} 
              onAddColor={handleAddColor}
              onEditColor={handleEditColor}
              onDeleteColor={handleDeleteColor}
              selectedColorId={selectedColorId}
              onColorCardClick={handleColorCardClick}
            />
          ))}
        </div>
      </div>

      <ColorModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveColor}
        initialColor={editingColor}
        mode={modalMode}
        modeType={selectedMode as string}
      />
    </>
  );
}
