import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import type { ColorsConfig, ModeColors } from '@/types/colors';

// GET - Retrieve all available modes
export async function GET() {
  try {
    const db = getDatabase();
    const storedConfig = db.getColorsConfig();
    
    if (!storedConfig) {
      return NextResponse.json(
        { error: 'No colors configuration found in database. Please initialize the database first.' },
        { status: 404 }
      );
    }

    // Handle both new and legacy format
    let modes: Record<string, ModeColors> = {};
    
    if (storedConfig.modes) {
      modes = storedConfig.modes;
    } else if (storedConfig.darkMode && storedConfig.lightMode) {
      // Convert legacy format to new format
      modes = {
        dark: storedConfig.darkMode,
        light: storedConfig.lightMode,
      };
    }

    return NextResponse.json({
      success: true,
      data: modes
    });
  } catch (error) {
    console.error('GET /api/modes error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve modes from database' },
      { status: 500 }
    );
  }
}

// POST - Create a new mode collection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { modeName, initialColors = [] }: { modeName: string; initialColors?: any[] } = body;

    if (!modeName || typeof modeName !== 'string' || modeName.trim() === '') {
      return NextResponse.json(
        { error: 'Mode name is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Sanitize mode name (remove special characters, make lowercase)
    const sanitizedModeName = modeName.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');

    const db = getDatabase();
    const storedConfig = db.getColorsConfig();
    
    let config: ColorsConfig;
    
    if (!storedConfig) {
      // Create new config with just this mode
      config = {
        modes: {
          [sanitizedModeName]: {
            mode: sanitizedModeName,
            colors: initialColors
          }
        }
      };
    } else {
      // Convert legacy format if needed
      if (!storedConfig.modes && storedConfig.darkMode && storedConfig.lightMode) {
        config = {
          modes: {
            dark: storedConfig.darkMode,
            light: storedConfig.lightMode,
            [sanitizedModeName]: {
              mode: sanitizedModeName,
              colors: initialColors
            }
          }
        };
      } else {
        config = {
          ...storedConfig,
          modes: {
            ...storedConfig.modes,
            [sanitizedModeName]: {
              mode: sanitizedModeName,
              colors: initialColors
            }
          }
        };
      }
    }

    // Check if mode already exists
    if (config.modes && config.modes[sanitizedModeName] && config.modes[sanitizedModeName].colors.length > 0) {
      return NextResponse.json(
        { error: `Mode "${sanitizedModeName}" already exists` },
        { status: 409 }
      );
    }

    const success = db.setColorsConfig(config);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save new mode to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Mode "${sanitizedModeName}" created successfully`,
      data: {
        modeName: sanitizedModeName,
        originalName: modeName
      }
    });
  } catch (error) {
    console.error('POST /api/modes error:', error);
    return NextResponse.json(
      { error: 'Failed to create new mode' },
      { status: 500 }
    );
  }
}
