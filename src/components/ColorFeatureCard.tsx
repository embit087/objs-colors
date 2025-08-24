'use client';

import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import ColorCard from './ColorCard';
import { useAuth } from '@/hooks/useAuth';
import type { ColorData } from '@/types/colors';

interface ColorFeatureCardProps {
  colorData: ColorData;
  onEdit: (colorData: ColorData) => void;
  onDelete: (colorId: string) => void;
  selectedColorId: string | null;
  onColorCardClick: (colorId: string) => void;
}

export default function ColorFeatureCard({ colorData, onEdit, onDelete, selectedColorId, onColorCardClick }: ColorFeatureCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(colorData.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleEdit = () => {
    onEdit(colorData);
  };

  return (
    <div className="color-feature-card">
      <ColorCard 
        colorData={colorData} 
        onEdit={handleEdit} 
        isSelected={selectedColorId === colorData.id}
        onCardClick={onColorCardClick}
      />
      
      {isAuthenticated && (
        <div className="feature-actions-absolute">
          <button className="feature-btn edit-btn" onClick={handleEdit} title="Edit color">
            <Edit size={14} />
          </button>
          <button className="feature-btn delete-btn" onClick={handleDelete} title="Delete color">
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-content">
            <p>Delete this color?</p>
            <div className="confirm-buttons">
              <button className="btn-confirm" onClick={confirmDelete}>Yes</button>
              <button className="btn-cancel" onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
