// API Usage Examples
// These are example functions showing how to interact with the colors API

export async function getColors() {
  const response = await fetch('/api/colors');
  const result = await response.json();
  console.log('GET /api/colors:', result);
  return result;
}

export async function saveColors(colorsConfig: unknown) {
  const response = await fetch('/api/colors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(colorsConfig),
  });
  const result = await response.json();
  console.log('POST /api/colors:', result);
  return result;
}

export async function deleteColors() {
  const response = await fetch('/api/colors', {
    method: 'DELETE',
  });
  const result = await response.json();
  console.log('DELETE /api/colors:', result);
  return result;
}

// Example: How to use in a component
/*
import { getColors, saveColors } from '@/utils/api-examples';

// Get colors
const { data: colors, source } = await getColors();

// Save colors
const newColors = {
  darkMode: { ... },
  lightMode: { ... }
};
await saveColors(newColors);
*/
