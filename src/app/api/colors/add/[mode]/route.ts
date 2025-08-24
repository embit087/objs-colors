import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import type { ColorData, ColorsConfig } from '@/types/colors';

// POST - Add a new color to a specific mode
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ mode: string }> }
) {
  try {
    const { mode } = await params;
    
    if (!mode || typeof mode !== 'string' || mode.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid mode name' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const newColor: Omit<ColorData, 'id'> = body;

    // Validate the color data
    if (!newColor.color?.hex || !newColor.color?.rgb) {
      return NextResponse.json(
        { error: 'Invalid color data: missing required fields (hex, rgb)' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const config = db.getColorsConfig();

    if (!config) {
      return NextResponse.json(
        { error: 'No colors configuration found. Initialize database first.' },
        { status: 404 }
      );
    }

    // Handle both new and legacy formats
    let updatedConfig: ColorsConfig = { ...config };
    let modes = updatedConfig.modes || {};

    // Convert legacy format to new format if needed
    if (!updatedConfig.modes && updatedConfig.darkMode && updatedConfig.lightMode) {
      modes = {
        dark: updatedConfig.darkMode,
        light: updatedConfig.lightMode,
      };
      updatedConfig.modes = modes;
    }

    // Check if the mode exists
    if (!modes[mode]) {
      return NextResponse.json(
        { error: `Mode "${mode}" not found. Create the mode first.` },
        { status: 404 }
      );
    }

    // Generate unique ID
    const timestamp = Date.now();
    const colorId = `${mode}-${timestamp}`;
    
    const colorWithId: ColorData = {
      ...newColor,
      id: colorId
    };

    // Add color to the specified mode
    updatedConfig.modes![mode].colors.push(colorWithId);

    // Keep legacy properties synchronized for backwards compatibility
    if (mode === 'dark' && updatedConfig.darkMode) {
      updatedConfig.darkMode.colors.push(colorWithId);
    } else if (mode === 'light' && updatedConfig.lightMode) {
      updatedConfig.lightMode.colors.push(colorWithId);
    }

    // Save updated configuration
    const success = db.setColorsConfig(updatedConfig);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Color added to ${mode} mode successfully`,
      color: colorWithId
    });
  } catch (error) {
    console.error('POST /api/colors/add/[mode] error:', error);
    return NextResponse.json(
      { error: 'Failed to add color' },
      { status: 500 }
    );
  }
}
