'use client';

import { ColorGrid } from '@/components';
import { useColors } from '@/hooks/useColors';

export default function Home() {
  const { colors, loading, error, refetch } = useColors();

  // Show loading state
  if (loading) {
    return (
      <div className="container">
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <p>Loading colors from database...</p>
        </div>
      </div>
    );
  }

  // Show error state - database required
  if (error || !colors) {
    return (
      <div className="container">
        <div className="error-state">
          <div className="error-icon">🗄️</div>
          <h2>Database Not Initialized</h2>
          <p>The color database needs to be initialized before you can use this application.</p>
          <div className="error-instructions">
            <p><strong>To initialize the database, run:</strong></p>
            <code>npm run db:init</code>
            <p>Then refresh this page.</p>
          </div>
          {error && (
            <details className="error-details">
              <summary>Error details</summary>
              <pre>{error}</pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  // Show colors from database
  return (
    <>
      <ColorGrid colorsConfig={colors} onColorsChange={refetch} />
    </>
  );
}
