#!/usr/bin/env tsx

import { getDatabase } from '../lib/database';
import type { ColorsConfig, ModeColors } from '../types/colors';

// Default color configuration for database initialization  
const darkModeColors: ModeColors = {
    mode: 'dark',
    colors: [
      {
        id: 'dark-primary',
        name: 'Primary Background',
        color: {
          hex: '#020817',
          rgb: 'rgb(2, 8, 23)'
        }
      },
      {
        id: 'dark-secondary',
        name: 'Secondary Background',
        color: {
          hex: '#1E293B',
          rgb: 'rgb(30, 41, 59)'
        }
      },
      {
        id: 'dark-tertiary',
        name: 'Tertiary Background',
        color: {
          hex: '#07152E',
          rgb: 'rgb(7, 21, 46)'
        }
      },
      {
        id: 'dark-muted',
        name: 'Muted Text',
        color: {
          hex: '#94A3B8',
          rgb: 'rgb(148, 163, 184)'
        }
      },
      {
        id: 'dark-accent',
        name: 'Accent Blue',
        color: {
          hex: '#3B81F6',
          rgb: 'rgb(59, 129, 246)'
        }
      },
      {
        id: 'dark-hover',
        name: 'Interactive Purple',
        color: {
          hex: '#A854F7',
          rgb: 'rgb(168, 84, 247)'
        },
        isHoverCard: true,
        hoverState: {
          hex: '#A854F7',
          rgb: 'rgb(168, 84, 247)',
          hoverHex: '#D8B3FE',
          hoverRgb: 'rgb(216, 179, 254)'
        }
      }
    ]
};

const lightModeColors: ModeColors = {
    mode: 'light',
    colors: [
      {
        id: 'light-primary',
        name: 'Primary Background',
        color: {
          hex: '#FFFFFF',
          rgb: 'rgb(255, 255, 255)'
        }
      },
      {
        id: 'light-secondary',
        name: 'Secondary Background',
        color: {
          hex: '#F8FAFC',
          rgb: 'rgb(248, 250, 252)'
        }
      },
      {
        id: 'light-tertiary',
        name: 'Tertiary Background',
        color: {
          hex: '#F1F5F9',
          rgb: 'rgb(241, 245, 249)'
        }
      },
      {
        id: 'light-muted',
        name: 'Muted Text',
        color: {
          hex: '#64748B',
          rgb: 'rgb(100, 116, 139)'
        }
      },
      {
        id: 'light-accent',
        name: 'Accent Blue',
        color: {
          hex: '#2563EB',
          rgb: 'rgb(37, 99, 235)'
        }
      },
      {
        id: 'light-hover',
        name: 'Interactive Purple',
        color: {
          hex: '#8B5CF6',
          rgb: 'rgb(139, 92, 246)'
        },
        isHoverCard: true,
        hoverState: {
          hex: '#8B5CF6',
          rgb: 'rgb(139, 92, 246)',
          hoverHex: '#C4B5FD',
          hoverRgb: 'rgb(196, 181, 253)'
        }
      }
    ]
};

const defaultColorsConfig: ColorsConfig = {
  modes: {
    dark: darkModeColors,
    light: lightModeColors
  },
  // Backwards compatibility
  darkMode: darkModeColors,
  lightMode: lightModeColors
};

async function initializeDatabase() {
  console.log('🚀 Initializing database with colors configuration...');

  try {
    const db = getDatabase();
    
    // Check if colors-choices already exists
    const existing = db.getColorsConfig();
    if (existing) {
      console.log('✅ Colors configuration already exists in database');
      console.log('📊 Current configuration has:');
      const darkMode = existing.modes?.dark || existing.darkMode;
      const lightMode = existing.modes?.light || existing.lightMode;
      if (darkMode) console.log(`   • Dark mode colors: ${darkMode.colors.length}`);
      if (lightMode) console.log(`   • Light mode colors: ${lightMode.colors.length}`);
      return;
    }

    // Seed with initial data
    const success = db.setColorsConfig(defaultColorsConfig);
    
    // Initialize password for color features
    const passwordSet = db.set('color-feature-password', 'objs123abc');
    
    if (success && passwordSet) {
      console.log('✅ Database initialized successfully!');
      console.log('📊 Seeded with:');
      console.log(`   • Dark mode colors: ${darkModeColors.colors.length}`);
      console.log(`   • Light mode colors: ${lightModeColors.colors.length}`);
      console.log('🔐 Password protection enabled for advanced features');
      
      // Verify the data was saved correctly
      const saved = db.getColorsConfig();
      if (saved) {
        console.log('✅ Data verification passed');
      } else {
        console.error('❌ Data verification failed');
      }
    } else {
      console.error('❌ Failed to initialize database');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase };
