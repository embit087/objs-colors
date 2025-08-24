import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import type { ColorsConfig } from '@/types/colors';

interface RouteParams {
  params: {
    modeName: string;
  };
}

// GET - Get specific mode
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { modeName } = params;
    const db = getDatabase();
    const storedConfig = db.getColorsConfig();
    
    if (!storedConfig) {
      return NextResponse.json(
        { error: 'No colors configuration found' },
        { status: 404 }
      );
    }

    // Handle both new and legacy format
    let modes: Record<string, any> = {};
    
    if (storedConfig.modes) {
      modes = storedConfig.modes;
    } else if (storedConfig.darkMode && storedConfig.lightMode) {
      modes = {
        dark: storedConfig.darkMode,
        light: storedConfig.lightMode,
      };
    }

    const mode = modes[modeName];
    if (!mode) {
      return NextResponse.json(
        { error: `Mode "${modeName}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mode
    });
  } catch (error) {
    console.error(`GET /api/modes/${params.modeName} error:`, error);
    return NextResponse.json(
      { error: 'Failed to retrieve mode' },
      { status: 500 }
    );
  }
}

// PUT - Update mode (rename or update colors)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { modeName } = params;
    const body = await request.json();
    const { newName, colors } = body;

    const db = getDatabase();
    const storedConfig = db.getColorsConfig();
    
    if (!storedConfig) {
      return NextResponse.json(
        { error: 'No colors configuration found' },
        { status: 404 }
      );
    }

    // Convert legacy format if needed
    let config: ColorsConfig;
    if (!storedConfig.modes && storedConfig.darkMode && storedConfig.lightMode) {
      config = {
        modes: {
          dark: storedConfig.darkMode,
          light: storedConfig.lightMode,
        }
      };
    } else {
      config = { ...storedConfig };
    }

    if (!config.modes || !config.modes[modeName]) {
      return NextResponse.json(
        { error: `Mode "${modeName}" not found` },
        { status: 404 }
      );
    }

    // If renaming
    if (newName && newName !== modeName) {
      const sanitizedNewName = newName.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
      
      // Check if new name already exists
      if (config.modes[sanitizedNewName]) {
        return NextResponse.json(
          { error: `Mode "${sanitizedNewName}" already exists` },
          { status: 409 }
        );
      }

      // Create new mode with new name
      config.modes[sanitizedNewName] = {
        ...config.modes[modeName],
        mode: sanitizedNewName
      };

      // Delete old mode (but protect built-in modes)
      if (!['dark', 'light'].includes(modeName)) {
        delete config.modes[modeName];
      }
    }

    // Update colors if provided
    if (colors !== undefined) {
      const targetModeName = newName ? newName.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_') : modeName;
      if (config.modes[targetModeName]) {
        config.modes[targetModeName].colors = colors;
      }
    }

    const success = db.setColorsConfig(config);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update mode' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Mode updated successfully`
    });
  } catch (error) {
    console.error(`PUT /api/modes/${params.modeName} error:`, error);
    return NextResponse.json(
      { error: 'Failed to update mode' },
      { status: 500 }
    );
  }
}

// DELETE - Delete mode
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { modeName } = params;

    // Protect built-in modes
    if (['dark', 'light'].includes(modeName)) {
      return NextResponse.json(
        { error: `Cannot delete built-in mode "${modeName}"` },
        { status: 403 }
      );
    }

    const db = getDatabase();
    const storedConfig = db.getColorsConfig();
    
    if (!storedConfig) {
      return NextResponse.json(
        { error: 'No colors configuration found' },
        { status: 404 }
      );
    }

    // Convert legacy format if needed
    let config: ColorsConfig;
    if (!storedConfig.modes && storedConfig.darkMode && storedConfig.lightMode) {
      config = {
        modes: {
          dark: storedConfig.darkMode,
          light: storedConfig.lightMode,
        }
      };
    } else {
      config = { ...storedConfig };
    }

    if (!config.modes || !config.modes[modeName]) {
      return NextResponse.json(
        { error: `Mode "${modeName}" not found` },
        { status: 404 }
      );
    }

    delete config.modes[modeName];

    const success = db.setColorsConfig(config);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete mode' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Mode "${modeName}" deleted successfully`
    });
  } catch (error) {
    console.error(`DELETE /api/modes/${params.modeName} error:`, error);
    return NextResponse.json(
      { error: 'Failed to delete mode' },
      { status: 500 }
    );
  }
}
