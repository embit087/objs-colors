import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import type { ColorData, ColorsConfig } from '@/types/colors';

// DELETE - Remove a specific color
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ colorId: string }> }
) {
  try {
    const { colorId } = await params;
    const db = getDatabase();
    const config = db.getColorsConfig();

    if (!config) {
      return NextResponse.json(
        { error: 'No colors configuration found' },
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

    // Find and remove the color from all modes
    let colorRemoved = false;
    
    for (const [modeName, modeData] of Object.entries(modes)) {
      const colorIndex = modeData.colors.findIndex(color => color.id === colorId);
      if (colorIndex !== -1) {
        updatedConfig.modes![modeName].colors.splice(colorIndex, 1);
        colorRemoved = true;

        // Keep legacy properties synchronized for backwards compatibility
        if (modeName === 'dark' && updatedConfig.darkMode) {
          updatedConfig.darkMode.colors.splice(colorIndex, 1);
        } else if (modeName === 'light' && updatedConfig.lightMode) {
          updatedConfig.lightMode.colors.splice(colorIndex, 1);
        }
        break; // Color IDs should be unique, so we can break after finding it
      }
    }

    if (!colorRemoved) {
      return NextResponse.json(
        { error: 'Color not found' },
        { status: 404 }
      );
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
      message: 'Color deleted successfully',
      colorId
    });
  } catch (error) {
    console.error('DELETE /api/colors/[colorId] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete color' },
      { status: 500 }
    );
  }
}

// PUT - Update a specific color
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ colorId: string }> }
) {
  try {
    const { colorId } = await params;
    const body = await request.json();
    const updatedColor: ColorData = body;

    // Validate the color data
    if (!updatedColor.color?.hex || !updatedColor.color?.rgb) {
      return NextResponse.json(
        { error: 'Invalid color data: missing hex or rgb values' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const config = db.getColorsConfig();

    if (!config) {
      return NextResponse.json(
        { error: 'No colors configuration found' },
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

    let colorUpdated = false;
    
    // Find and update the color in all modes
    for (const [modeName, modeData] of Object.entries(modes)) {
      const colorIndex = modeData.colors.findIndex(color => color.id === colorId);
      if (colorIndex !== -1) {
        const updatedColorWithId = { ...updatedColor, id: colorId };
        updatedConfig.modes![modeName].colors[colorIndex] = updatedColorWithId;
        colorUpdated = true;

        // Keep legacy properties synchronized for backwards compatibility
        if (modeName === 'dark' && updatedConfig.darkMode) {
          updatedConfig.darkMode.colors[colorIndex] = updatedColorWithId;
        } else if (modeName === 'light' && updatedConfig.lightMode) {
          updatedConfig.lightMode.colors[colorIndex] = updatedColorWithId;
        }
        break; // Color IDs should be unique, so we can break after finding it
      }
    }

    if (!colorUpdated) {
      return NextResponse.json(
        { error: 'Color not found' },
        { status: 404 }
      );
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
      message: 'Color updated successfully',
      color: updatedColor
    });
  } catch (error) {
    console.error('PUT /api/colors/[colorId] error:', error);
    return NextResponse.json(
      { error: 'Failed to update color' },
      { status: 500 }
    );
  }
}
