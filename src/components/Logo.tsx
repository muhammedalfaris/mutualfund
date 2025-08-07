import React from 'react';
import { logoConfig, getLogoIcon, getLogoImage, shouldUseImage } from '@/config/logo';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'text' | 'full';
  context?: string; // For different contexts (equity, debt, etc.)
  className?: string;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'icon',
  context,
  className = '',
  style = {}
}) => {

  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl',
    xl: 'w-24 h-24 text-4xl',
  };

  const renderIcon = () => {
    // Check if we should use an image
    if (shouldUseImage(context)) {
      const imagePath = getLogoImage(context);
      return (
        <div 
          className={`rounded-lg flex items-center justify-center ${sizeClasses[size]} ${className}`}
          style={{ 
            backgroundColor: 'var(--color-primary)',
            ...style 
          }}
        >
          <Image
            src={imagePath}
            alt={`${logoConfig.appName} logo`}
            width={size === 'sm' ? 24 : size === 'md' ? 40 : size === 'lg' ? 64 : 96}
            height={size === 'sm' ? 24 : size === 'md' ? 40 : size === 'lg' ? 64 : 96}
            className="object-contain"
          />
        </div>
      );
    }

    // Fallback to text/emoji icon
    return (
      <div 
        className={`rounded-lg flex items-center justify-center ${sizeClasses[size]} ${className}`}
        style={{ 
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-background)',
          ...style 
        }}
      >
        <span className="font-bold">{getLogoIcon(context)}</span>
      </div>
    );
  };

  const renderText = () => (
    <span className={`font-bold ${className}`} style={{ color: 'var(--color-foreground)', ...style }}>
      {logoConfig.text}
    </span>
  );

  const renderFull = () => (
    <div className={`flex items-center space-x-2 ${className}`}>
      {renderIcon()}
      <h1 className="text-xl font-bold" style={{ color: 'var(--color-foreground)' }}>
        {logoConfig.fullName}
      </h1>
    </div>
  );

  switch (variant) {
    case 'text':
      return renderText();
    case 'full':
      return renderFull();
    case 'icon':
    default:
      return renderIcon();
  }
};

export default Logo;
