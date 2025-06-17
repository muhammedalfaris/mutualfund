'use client';

import { useTheme } from '@/context/ThemeContext';

export default function ThemeExample() {
  const { currentTheme } = useTheme();

  return (
    <div className="p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Theme System Demo
        </h1>
        <p className="text-muted-foreground">
          Current Theme: <span className="font-semibold">{currentTheme.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Primary Button */}
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
          Primary Button
        </button>

        {/* Secondary Button */}
        <button className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
          Secondary Button
        </button>

        {/* Accent Button */}
        <button className="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-colors">
          Accent Button
        </button>

        {/* Success Button */}
        <button className="bg-success text-success-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
          Success Button
        </button>

        {/* Warning Button */}
        <button className="bg-warning text-warning-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
          Warning Button
        </button>

        {/* Destructive Button */}
        <button className="bg-destructive text-destructive-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
          Destructive Button
        </button>
      </div>

      {/* Card Example */}
      <div className="bg-muted border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Card Component
        </h2>
        <p className="text-muted-foreground mb-4">
          This card demonstrates how the theme system works with different components.
          All colors automatically adapt based on the selected theme.
        </p>
        <div className="flex gap-2">
          <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
            Primary Tag
          </span>
          <span className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
            Secondary Tag
          </span>
        </div>
      </div>

      {/* Input Example */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Example Input
        </label>
        <input
          type="text"
          placeholder="Enter some text..."
          className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-colors text-foreground"
        />
      </div>

      {/* Color Palette Display */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Current Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(currentTheme.colors).map(([key, value]) => (
            <div key={key} className="text-center">
              <div 
                className="w-16 h-16 rounded-lg mx-auto mb-2 border border-border"
                style={{ backgroundColor: value }}
              />
              <p className="text-xs text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-xs font-mono text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}