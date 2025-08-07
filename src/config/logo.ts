// Logo Configuration
// Change these values to customize your logo across the entire application

export const logoConfig = {
  // Main logo icon (emoji, text, or image path)
  icon: '💰', // Change this to any emoji, text, or image path like '/logo.png'
  
  // Text that appears in the logo (used as fallback for image)
  text: 'MF', // Change this to your preferred text
  
  // Full application name
  fullName: 'One S Lite', // Change this to your app name
  
  // App name for titles and headers
  appName: 'One S Lite', // Change this to your app name
  
  // Alternative icons for different contexts
  alternatives: {
    // For fund categories
    equity: '📈',
    debt: '🏦', 
    hybrid: '⚖️',
    commodity: '🥇',
    index: '📊',
    
    // For different sections
    dashboard: '📊',
    portfolio: '💼',
    investments: '💰',
    transactions: '📋',
    settings: '⚙️',
  },
  
  // Image configuration
  image: {
    // Main logo image path (relative to public folder)
    main: '/logo.png', // Change this to your logo image path
    
    // Alternative images for different contexts
    alternatives: {
      // For fund categories
      equity: '/icons/equity.png',
      debt: '/icons/debt.png',
      hybrid: '/icons/hybrid.png',
      commodity: '/icons/commodity.png',
      index: '/icons/index.png',
      
      // For different sections
      dashboard: '/icons/dashboard.png',
      portfolio: '/icons/portfolio.png',
      investments: '/icons/investments.png',
      transactions: '/icons/transactions.png',
      settings: '/icons/settings.png',
    }
  }
};

// Helper function to get icon for different contexts
export const getLogoIcon = (context?: string) => {
  if (context && logoConfig.alternatives[context as keyof typeof logoConfig.alternatives]) {
    return logoConfig.alternatives[context as keyof typeof logoConfig.alternatives];
  }
  return logoConfig.icon;
};

// Helper function to get image path for different contexts
export const getLogoImage = (context?: string) => {
  if (context && logoConfig.image.alternatives[context as keyof typeof logoConfig.image.alternatives]) {
    return logoConfig.image.alternatives[context as keyof typeof logoConfig.image.alternatives];
  }
  return logoConfig.image.main;
};

// Helper function to check if logo should use image
export const shouldUseImage = (context?: string) => {
  const imagePath = getLogoImage(context);
  return imagePath && imagePath.startsWith('/');
};

// Helper function to get text for different contexts
export const getLogoText = (context?: string) => {
  if (context === 'short') {
    return logoConfig.text;
  }
  return logoConfig.fullName;
};
