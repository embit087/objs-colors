import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import type { ColorsConfig } from '@/types/colors';

// GET - Retrieve colors configuration
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

    // Convert legacy format to new format if needed
    let config = storedConfig;
    if (!storedConfig.modes && storedConfig.darkMode && storedConfig.lightMode) {
      config = {
        modes: {
          dark: storedConfig.darkMode,
          light: storedConfig.lightMode,
        },
        // Keep legacy properties for backwards compatibility
        darkMode: storedConfig.darkMode,
        lightMode: storedConfig.lightMode,
      };
    }

    return NextResponse.json({
      source: 'database',
      data: config
    });
  } catch (error) {
    console.error('GET /api/colors error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve colors configuration from database' },
      { status: 500 }
    );
  }
}

// POST - Save colors configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config: ColorsConfig = body.data || body;

    // Validate the structure - support both new and legacy formats
    if (config.modes) {
      // New format validation
      if (typeof config.modes !== 'object') {
        return NextResponse.json(
          { error: 'Invalid colors configuration: modes must be an object' },
          { status: 400 }
        );
      }

      for (const [modeName, modeData] of Object.entries(config.modes)) {
        if (!modeData || typeof modeData !== 'object' || !Array.isArray(modeData.colors)) {
          return NextResponse.json(
            { error: `Invalid colors configuration: mode "${modeName}" must have a colors array` },
            { status: 400 }
          );
        }
      }
    } else {
      // Legacy format validation
      if (!config.darkMode || !config.lightMode) {
        return NextResponse.json(
          { error: 'Invalid colors configuration: missing modes, darkMode, or lightMode' },
          { status: 400 }
        );
      }

      if (!Array.isArray(config.darkMode.colors) || !Array.isArray(config.lightMode.colors)) {
        return NextResponse.json(
          { error: 'Invalid colors configuration: colors must be arrays' },
          { status: 400 }
        );
      }
    }

    const db = getDatabase();
    const success = db.setColorsConfig(config);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save colors configuration to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Colors configuration saved successfully'
    });
  } catch (error) {
    console.error('POST /api/colors error:', error);
    return NextResponse.json(
      { error: 'Failed to save colors configuration' },
      { status: 500 }
    );
  }
}

// PUT - Update colors configuration (alias for POST)
export async function PUT(request: NextRequest) {
  return POST(request);
}

// DELETE - Remove colors configuration
export async function DELETE() {
  try {
    const db = getDatabase();
    const success = db.delete('colors-choices');

    if (!success) {
      return NextResponse.json(
        { error: 'Colors configuration not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Colors configuration deleted successfully'
    });
  } catch (error) {
    console.error('DELETE /api/colors error:', error);
    return NextResponse.json(
      { error: 'Failed to delete colors configuration' },
      { status: 500 }
    );
  }
}
