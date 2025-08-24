'use client';

import { Plus, Download } from 'lucide-react';
import ColorFeatureCard from './ColorFeatureCard';
import { useAuth } from '@/hooks/useAuth';
import type { ModeColors, ColorData } from '@/types/colors';

interface ModeSectionProps {
  modeData: ModeColors;
  onAddColor: (mode: string) => void;
  onEditColor: (colorData: ColorData) => void;
  onDeleteColor: (colorId: string) => void;
  selectedColorId: string | null;
  onColorCardClick: (colorId: string) => void;
}

export default function ModeSection({ 
  modeData, 
  onAddColor, 
  onEditColor, 
  onDeleteColor,
  selectedColorId,
  onColorCardClick
}: ModeSectionProps) {
  const { mode, colors } = modeData;
  const { isAuthenticated } = useAuth();
  
  // Format mode name for display (capitalize first letter and add "Mode" if not present)
  const formatModeName = (name: string) => {
    const formatted = name.charAt(0).toUpperCase() + name.slice(1);
    return formatted.toLowerCase().includes('mode') ? formatted : `${formatted} Mode`;
  };
  
  const modeLabel = formatModeName(mode);

  // Export mode data to markdown format
  const exportModeToMarkdown = () => {
    const timestamp = new Date().toLocaleDateString();
    const colorCount = colors.length;
    
    let markdown = `# ${modeLabel}\n\n`;
    markdown += `**Exported:** ${timestamp}  \n`;
    markdown += `**Total Colors:** ${colorCount}\n\n`;
    
    if (colors.length === 0) {
      markdown += `*No colors defined for this mode.*\n`;
    } else {
      markdown += `## Colors\n\n`;
      
      colors.forEach((colorData, index) => {
        const { name, color, hoverState } = colorData;
        const colorName = name || `Color ${index + 1}`;
        
        markdown += `### ${colorName}\n\n`;
        markdown += `- **Hex:** \`${color.hex}\`\n`;
        markdown += `- **RGB:** \`${color.rgb}\`\n`;
        
        if (hoverState) {
          markdown += `- **Hover Hex:** \`${hoverState.hoverHex}\`\n`;
          markdown += `- **Hover RGB:** \`${hoverState.hoverRgb}\`\n`;
        }
        
        markdown += `\n`;
      });
    }
      
    return markdown;
  };

  // Download markdown file
  const handleExport = () => {
    const markdown = exportModeToMarkdown();
    const fileName = `${mode}-colors-${new Date().toISOString().split('T')[0]}.md`;
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mode-section">
      <div className="mode-header">
        <div className="mode-label">{modeLabel}</div>
        <button
          className="btn-secondary font-light export-button"
          onClick={handleExport}
          title={`Export ${modeLabel} colors to markdown`}
        >
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>
      
      <div className="colors-grid">
        {/* Add Color Card - Only show when authenticated */}
        {isAuthenticated && (
          <div className="add-color-card" onClick={() => onAddColor(mode)}>
            <div className="add-color-content">
              <div className="add-color-swatch">
                <Plus size={24} />
              </div>
              <div className="add-color-info">
                <span className="add-color-text">Add Color</span>
              </div>
            </div>
          </div>
        )}
        
        {colors.map((colorData) => (
          <ColorFeatureCard 
            key={colorData.id} 
            colorData={colorData}
            onEdit={onEditColor}
            onDelete={onDeleteColor}
            selectedColorId={selectedColorId}
            onColorCardClick={onColorCardClick}
          />
        ))}
      </div>
    </div>
  );
}
