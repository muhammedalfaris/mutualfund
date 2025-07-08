import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--color-background)] rounded-3xl shadow-2xl border p-8 w-full max-w-md mx-4 animate-modalSlideIn" 
           style={{ 
             borderColor: 'var(--color-border)',
             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
           }}>
        
        {/* Enhanced close button */}
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] group"
          onClick={onClose}
          aria-label="Close"
        >
          <svg 
            className="w-5 h-5 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)] transition-colors duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Enhanced title with subtle accent */}
        {title && (
          <div className="mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/50 rounded-full mb-4"></div>
            <h2 className="text-2xl font-semibold leading-tight" style={{ color: 'var(--color-foreground)' }}>
              {title}
            </h2>
          </div>
        )}
        
        {/* Content area with better spacing */}
        <div className="relative">
          {children}
        </div>
      </div>
      
      <style jsx>{`
        .animate-modalSlideIn {
          animation: modalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        @keyframes modalSlideIn {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
        
        /* Enhanced focus styles */
        .focus\\:ring-2:focus {
          box-shadow: 0 0 0 2px var(--color-ring);
        }
        
        /* Smooth transitions for interactive elements */
        * {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
      `}</style>
    </div>
  );
};

export default Modal;