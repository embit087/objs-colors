'use client';

import { useState, useEffect } from 'react';
import type { ColorsConfig } from '@/types/colors';

interface UseColorsResult {
  colors: ColorsConfig | null;
  loading: boolean;
  error: string | null;
  source: 'database' | 'default' | null;
  refetch: () => Promise<void>;
}

export function useColors(): UseColorsResult {
  const [colors, setColors] = useState<ColorsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'database' | 'default' | null>(null);

  const fetchColors = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/colors', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch colors: ${response.statusText}`);
      }

      const result = await response.json();
      setColors(result.data);
      setSource(result.source);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching colors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  return {
    colors,
    loading,
    error,
    source,
    refetch: fetchColors,
  };
}
