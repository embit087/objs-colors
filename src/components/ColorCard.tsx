'use client';

import { useState } from 'react';
import type { ColorData } from '@/types/colors';

interface ColorCardProps {
  colorData: ColorData;
  onEdit: (colorData: ColorData) => void;
  isSelected?: boolean;
  onCardClick?: (colorId: string) => void;
}

export default function ColorCard({ colorData, onEdit, isSelected = false, onCardClick }: ColorCardProps) {
  const { color, isHoverCard, hoverState, name } = colorData;
  const [tooltip, setTooltip] = useState<{ show: boolean; x: number; y: number }>({
    show: false,
    x: 0,
    y: 0
  });

  const copyToClipboard = async (event: React.MouseEvent) => {
    try {
      // Handle card selection
      if (onCardClick) {
        onCardClick(colorData.id);
      }

      let clipboardText = '';
      
      if (isHoverCard && hoverState) {
        clipboardText = `${name ? `${name}\n` : ''}Before: ${hoverState.hex}\nHover: ${hoverState.hoverHex}`;
      } else {
        clipboardText = `${name ? `${name}\n` : ''}${color.hex}`;
      }
      
      await navigator.clipboard.writeText(clipboardText);
      
      // Show tooltip at cursor position
      setTooltip({
        show: true,
        x: event.clientX,
        y: event.clientY
      });
      
      // Hide tooltip after 1.5 seconds
      setTimeout(() => {
        setTooltip(prev => ({ ...prev, show: false }));
      }, 1500);
      
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  if (isHoverCard && hoverState) {
    return (
      <>
        <div className={`color-card hover-card ${isSelected ? 'selected' : ''}`} onClick={copyToClipboard}>
          <div className="dual-swatch">
            <div className="swatch-section" style={{ backgroundColor: hoverState.hex }}>
              <div className="swatch-label">Before</div>
            </div>
            <div className="swatch-section" style={{ backgroundColor: hoverState.hoverHex }}>
              <div className="swatch-label">Hover</div>
            </div>
          </div>
          <div className="dual-info">
            <div className="dual-hex">{hoverState.hex} → {hoverState.hoverHex}</div>
            <div className="dual-rgb">
              {hoverState.rgb}<br />
              {hoverState.hoverRgb}
            </div>
            {name && <div className="color-name">{name}</div>}
          </div>
        </div>
        {tooltip.show && (
          <div
            className="copy-tooltip"
            style={{
              position: 'fixed',
              left: tooltip.x + 10,
              top: tooltip.y - 30,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'normal',
              zIndex: 10000,
              pointerEvents: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            Copied!
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className={`color-card ${isSelected ? 'selected' : ''}`} onClick={copyToClipboard}>
        <div className="color-swatch" style={{ backgroundColor: color.hex }}></div>
        <div className="color-info">
          <div className="hex-code">{color.hex}</div>
          <div className="rgb-code">{color.rgb}</div>
          {name && <div className="color-name">{name}</div>}
        </div>
      </div>
      {tooltip.show && (
        <div
          className="copy-tooltip"
          style={{
            position: 'fixed',
            left: tooltip.x + 10,
            top: tooltip.y - 30,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'normal',
            zIndex: 10000,
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          Copied!
        </div>
      )}
    </>
  );
}
