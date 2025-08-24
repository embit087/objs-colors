# Colors Matter - Database-Driven Color Palette

A modern Next.js application for managing and displaying color palettes with SQLite database persistence.

## ✨ Features

- **Database-Only**: Colors exclusively stored in SQLite database with key-value architecture
- **Interactive Management**: Add, edit, and delete colors with real-time database updates
- **Dual Mode Support**: Dark mode and light mode color palettes
- **Modern Stack**: Next.js 15, TypeScript, React 19
- **Component Architecture**: Modular, reusable React components
- **API-Driven**: RESTful API for full CRUD operations
- **Mobile Responsive**: Optimized for both desktop and mobile without layout compromise
- **Confirmation Dialogs**: Safe deletion with user confirmation
- **Visual Feedback**: Loading states, success indicators, and error handling
- **Type Safety**: Full TypeScript support with proper interfaces

## 🏗️ Architecture

### Database Structure
```sql
- kv_store: Key-value storage table
- Key: "colors-choices"  
- Value: JSON string containing complete color configuration
```

### Component Hierarchy
```
Home (page.tsx)
├── ColorGrid
    ├── ModeSection (Dark/Light)
        └── ColorFeatureCard (Wrapper with action buttons)
            └── ColorCard (Individual color display)
```

### API Endpoints

**Full Configuration:**
- `GET /api/colors` - Retrieve complete color configuration
- `POST /api/colors` - Save complete color configuration  
- `PUT /api/colors` - Update complete color configuration
- `DELETE /api/colors` - Remove complete color configuration

**Individual Colors:**
- `POST /api/colors/add/{mode}` - Add color to specific mode (dark/light)
- `PUT /api/colors/{colorId}` - Update individual color by ID
- `DELETE /api/colors/{colorId}` - Delete individual color by ID

## 🎨 Interactive Features

### Color Management
- **Add Colors**: Click "Add Color" button in any mode section
- **Edit Colors**: Click on any color card or the edit (✏️) button
- **Delete Colors**: Click the delete (🗑️) button with confirmation dialog

### Color Form Features
- **Visual Color Picker**: Native color input with live preview
- **Hex Input**: Direct hex code input with validation  
- **RGB Display**: Automatic RGB conversion
- **Hover Effects**: Optional interactive hover state colors
- **Real-time Preview**: See colors before saving

### Mobile Experience  
- **Responsive Design**: Optimized layouts for all screen sizes
- **Touch Friendly**: Large buttons and touch targets
- **Always Visible Controls**: Action buttons always visible on mobile
- **Stack Layout**: Colors stack vertically on small screens

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- SQLite3

### Installation & Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Initialize database:**
```bash
npm run db:init
```

3. **Start development server:**
```bash
npm run dev
```

4. **Visit the application:**
```
http://localhost:3000
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:init` - Initialize database with default colors
- `npm run db:reset` - Reset database and reinitialize

## 🧪 Testing Features

**Test Interactive API:**
```bash
node test-new-features.js  # (after starting dev server)
```

**Test Full System:**
```bash
node test-api.js  # (after starting dev server)
```

## 🎨 Color Configuration Format

```typescript
{
  darkMode: {
    mode: 'dark',
    colors: [
      {
        id: 'dark-primary',
        name: 'Primary Background',
        color: {
          hex: '#020817',
          rgb: 'rgb(2, 8, 23)'
        }
      }
      // ... more colors
    ]
  },
  lightMode: {
    mode: 'light', 
    colors: [
      // ... light mode colors
    ]
  }
}
```

## 🔧 API Usage Examples

### Get Colors
```bash
curl http://localhost:3000/api/colors
```

### Save Colors
```bash
curl -X POST http://localhost:3000/api/colors \
  -H "Content-Type: application/json" \
  -d '{"darkMode": {...}, "lightMode": {...}}'
```

### Delete Colors
```bash
curl -X DELETE http://localhost:3000/api/colors
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/colors/route.ts    # API endpoints
│   ├── globals.css            # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── components/
│   ├── ColorCard.tsx         # Individual color display
│   ├── ColorGrid.tsx         # Main grid container
│   ├── ModeSection.tsx       # Dark/Light mode sections
│   └── index.ts              # Component exports

├── hooks/
│   └── useColors.ts          # Color data fetching hook
├── lib/
│   └── database.ts           # SQLite database service
├── scripts/
│   └── init-db.ts           # Database initialization
├── types/
│   └── colors.ts            # TypeScript interfaces
└── utils/
    └── api-examples.ts      # API usage examples
```

## 💾 Database Location

The SQLite database is stored at:
```
/Users/office/objs/objs-ui-refine/colors-matters/objs-colors/db/database.db
```

## 🎯 Key Features

- **Persistent Storage**: Colors survive server restarts
- **Graceful Degradation**: Falls back to default colors if database fails
- **Visual Feedback**: Shows data source (Database vs Default)
- **Hover Effects**: Interactive color demonstrations
- **Loading States**: Smooth loading experience
- **Type Safety**: Full TypeScript coverage
- **Modern UI**: Clean, professional design with thin fonts

## 🔄 Data Flow

1. App loads → `useColors` hook triggered
2. Hook calls `/api/colors` endpoint
3. API checks SQLite database for `colors-choices` key
4. If found: returns database colors with success indicator
5. If not found: returns 404 error requiring database initialization
6. UI shows colors from database OR initialization instructions if database empty

Ready to run with `npm run dev`! 🚀