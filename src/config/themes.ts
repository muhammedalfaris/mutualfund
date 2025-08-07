import { Theme } from '@/types/theme';

export const themes: Record<string, Theme> = {
  default: {
    name: 'Default',
    colors: {
      primary: '#dc2626', 
      secondary: '#000000', 
      accent: '#ffffff', 
      background: '#ffffff',
      foreground: '#171717',
      muted: '#edd7d7',
      mutedForeground: '#737373',
      border: '#e5e5e5',
      input: '#ffffff',
      ring: '#dc2626',
      destructive: '#ef4444',
      destructiveForeground: '#ffffff',
      success: '#22c55e',
      successForeground: '#ffffff',
      warning: '#f59e0b',
      warningForeground: '#ffffff',
    },
  },
  corporate: {
    name: 'Corporate',
    colors: {
      primary: '#1e40af', 
      secondary: '#1f2937', 
      accent: '#f8fafc',
      background: '#ffffff',
      foreground: '#1f2937',
      muted: '#f1f5f9',
      mutedForeground: '#64748b',
      border: '#e2e8f0',
      input: '#ffffff',
      ring: '#1e40af',
      destructive: '#dc2626',
      destructiveForeground: '#ffffff',
      success: '#059669',
      successForeground: '#ffffff',
      warning: '#d97706',
      warningForeground: '#ffffff',
    },
  },
  nature: {
    name: 'Nature',
    colors: {
      primary: '#16a34a', 
      secondary: '#365314', 
      accent: '#f7fee7',
      background: '#ffffff',
      foreground: '#365314',
      muted: '#f0fdf4',
      mutedForeground: '#4d7c0f',
      border: '#bbf7d0',
      input: '#ffffff',
      ring: '#16a34a',
      destructive: '#dc2626',
      destructiveForeground: '#ffffff',
      success: '#059669',
      successForeground: '#ffffff',
      warning: '#ca8a04',
      warningForeground: '#ffffff',
    },
  },
  ones : {
    name: 'Ones',
    colors: {
      primary: '#c71c4e',               
      secondary: '#1f1f1f',             
      accent: '#ffffff',                
      background: '#ffffff',            
      foreground: '#111111',            
      muted: '#f9dbe3',                 
      mutedForeground: '#6b6b6b',       
      border: '#e4e4e7',                
      input: '#ffffff',                 
      ring: '#c71c4e',                  
      destructive: '#dc2626',           
      destructiveForeground: '#ffffff', 
      success: '#16a34a',               
      successForeground: '#ffffff',     
      warning: '#f59e0b',               
      warningForeground: '#ffffff',     
    },
  }
};

export const ACTIVE_THEME = 'ones'; 

export const getActiveTheme = (): Theme => {
  return themes[ACTIVE_THEME] || themes.default;
};