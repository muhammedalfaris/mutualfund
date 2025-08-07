# Logo Setup Instructions

## Adding Your PNG Logo

To use a PNG image for your logo:

### 1. Prepare Your Logo Image
- **Format**: PNG (recommended) or JPG
- **Size**: At least 96x96px, preferably 192x192px or larger
- **Background**: Transparent or solid color
- **File size**: Keep under 100KB for best performance

### 2. Place Your Logo File
Add your logo image to the `public` folder:
```
public/
└── logo.png    # Your main logo here
```

### 3. Optional: Add Context-Specific Icons
For different contexts (fund categories, sections), you can add specific icons:
```
public/
├── logo.png          # Main logo
└── icons/            # Optional folder for context icons
    ├── equity.png    # For equity funds
    ├── debt.png      # For debt funds
    ├── hybrid.png    # For hybrid funds
    └── ...
```

### 4. Update Configuration
The system is already configured to use `/logo.png` as the main logo. If you want to use different paths, update `src/config/logo.ts`:

```typescript
export const logoConfig = {
  // ... other settings ...
  image: {
    main: '/your-logo.png', // Change this to your file name
    alternatives: {
      equity: '/icons/equity.png',
      debt: '/icons/debt.png',
      // ... other contexts
    }
  }
};
```

### 5. Test Your Logo
After adding your logo file:
1. Start the development server: `npm run dev`
2. Check that the logo appears correctly in:
   - Navbar
   - Login page
   - Dashboard
   - Fund detail pages

### 6. Fallback System
If your image fails to load, the system automatically falls back to the text/emoji version defined in the configuration.

## Current Configuration
The system is currently set up to use:
- **Main logo**: `/logo.png` (place your file here)
- **Fallback**: 💰 emoji with "MF" text
- **App name**: "One S Lite"

## Troubleshooting
- **Image not showing**: Check that the file exists in `public/logo.png`
- **Wrong size**: The component automatically resizes images
- **Performance issues**: Optimize your PNG file size
- **Fallback to text**: Check browser console for image loading errors

## Example File Structure
```
public/
├── logo.png          # Your main logo
├── icons/            # Optional context icons
│   ├── equity.png
│   ├── debt.png
│   └── hybrid.png
└── ... (other files)
```

The logo system will automatically detect and use your PNG image once you place it in the correct location!
