# Logo Customization Guide

This guide explains how to customize the logo across the entire application using the centralized logo system.

## Overview

The logo system is designed to be flexible and easy to customize. You can use:
- **Text/Emoji icons** (default)
- **PNG image files** (new feature)

## Quick Setup

### For PNG Images (Recommended)

1. **Place your logo image** in the `public` folder:
   ```
   public/
   ├── logo.png          # Main logo
   └── icons/            # Optional: context-specific icons
       ├── equity.png
       ├── debt.png
       ├── hybrid.png
       └── ...
   ```

2. **Update the configuration** in `src/config/logo.ts`:
   ```typescript
   export const logoConfig = {
     // ... other settings ...
     image: {
       main: '/logo.png', // Your main logo path
       alternatives: {
         equity: '/icons/equity.png',
         debt: '/icons/debt.png',
         // ... other context-specific images
       }
     }
   };
   ```

### For Text/Emoji Icons

1. **Update the configuration** in `src/config/logo.ts`:
   ```typescript
   export const logoConfig = {
     icon: '💰', // Your preferred emoji or text
     text: 'MF', // Short text version
     fullName: 'Investment Portal', // Full app name
     appName: 'One S Lite', // App name for titles
     // ... other settings
   };
   ```

## What Gets Updated

When you change the logo configuration, it automatically updates:

### UI Elements
- ✅ **Navbar** - Main navigation logo
- ✅ **Login page** - Welcome screen logo
- ✅ **Dashboard** - Portfolio card logos
- ✅ **Fund detail pages** - Fund-specific logos
- ✅ **Fund allocation charts** - Category-specific icons

### Metadata
- ✅ **Page titles** - Browser tab titles
- ✅ **App manifest** - PWA app name
- ✅ **Apple meta tags** - iOS app name

### What's NOT Affected
- ❌ **Favicon** - Browser tab icon (separate configuration)
- ❌ **PWA icons** - App store icons (in `public/manifest.json`)

## Using the Logo Component

The `Logo` component automatically detects whether to use an image or text/emoji based on your configuration.

### Basic Usage

```tsx
import Logo from '@/components/Logo';

// Icon only (default)
<Logo />

// Different sizes
<Logo size="sm" />
<Logo size="md" />
<Logo size="lg" />
<Logo size="xl" />

// Different variants
<Logo variant="icon" />
<Logo variant="text" />
<Logo variant="full" />
```

### Context-Specific Icons

```tsx
// Fund category icons
<Logo context="equity" />
<Logo context="debt" />
<Logo context="hybrid" />

// Section icons
<Logo context="dashboard" />
<Logo context="portfolio" />
<Logo context="investments" />
```

### Custom Styling

```tsx
<Logo 
  size="lg" 
  className="my-custom-class"
  style={{ backgroundColor: 'red', color: 'white' }}
/>
```

## Image Requirements

### For PNG Images

- **Format**: PNG (recommended) or JPG
- **Size**: At least 96x96px for best quality
- **Background**: Transparent or solid color
- **Placement**: In the `public` folder
- **Naming**: Use descriptive names like `logo.png`, `equity-icon.png`

### Recommended Image Sizes

- **Main logo**: 192x192px or larger
- **Context icons**: 64x64px or larger
- **Small icons**: 32x32px minimum

## Configuration Options

### Main Settings

```typescript
export const logoConfig = {
  // Text/emoji fallback
  icon: '💰',
  text: 'MF',
  fullName: 'Investment Portal',
  appName: 'One S Lite',
  
  // Image settings
  image: {
    main: '/logo.png',
    alternatives: {
      equity: '/icons/equity.png',
      debt: '/icons/debt.png',
      // ... more contexts
    }
  }
};
```

### Available Contexts

- **Fund Categories**: `equity`, `debt`, `hybrid`, `commodity`, `index`
- **App Sections**: `dashboard`, `portfolio`, `investments`, `transactions`, `settings`

## Migration from Text to Images

If you're switching from text/emoji to images:

1. **Keep the text fallback** for better accessibility
2. **Add your images** to the `public` folder
3. **Update the configuration** with image paths
4. **Test all contexts** to ensure images load correctly

## Troubleshooting

### Image Not Loading
- Check the file path in `public` folder
- Verify the image file exists
- Ensure the path in `logoConfig.image.main` is correct

### Fallback to Text
- If an image fails to load, the system automatically falls back to text/emoji
- Check browser console for image loading errors

### Performance
- Use optimized PNG images
- Consider using WebP format for better compression
- Keep image sizes reasonable (under 100KB each)

## Examples

### Simple Text Logo
```typescript
export const logoConfig = {
  icon: '💰',
  text: 'MF',
  fullName: 'Investment Portal',
  appName: 'One S Lite',
  // No image configuration needed
};
```

### Image-Based Logo
```typescript
export const logoConfig = {
  icon: '💰', // Fallback
  text: 'MF',
  fullName: 'Investment Portal',
  appName: 'One S Lite',
  image: {
    main: '/logo.png',
    alternatives: {
      equity: '/icons/equity.png',
      debt: '/icons/debt.png',
    }
  }
};
```

### Mixed Approach
```typescript
export const logoConfig = {
  icon: '💰',
  text: 'MF',
  fullName: 'Investment Portal',
  appName: 'One S Lite',
  image: {
    main: '/logo.png', // Main logo as image
    alternatives: {
      equity: '📈', // Some contexts use emoji
      debt: '/icons/debt.png', // Others use images
    }
  }
};
```
