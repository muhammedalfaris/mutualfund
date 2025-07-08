'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface ApiResponse {
  status: string;
  tokens?: {
    refresh: string;
    access: string;
  };
  error?: string;
}

export default function LoginPage() {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://walletfree-api.nexcard.co.in/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please try again.');
      }

      if (data.status === 'success' && data.tokens) {
        // Store tokens securely
        localStorage.setItem('accessToken', data.tokens.access);
        localStorage.setItem('refreshToken', data.tokens.refresh);
        
        // Store rememberMe preference
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          sessionStorage.setItem('rememberMe', 'true');
        }

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Left Side - Branding/Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-90"
          style={{
            background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-primary) 100%)`,
          }}
        />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-20 animate-pulse"
               style={{ backgroundColor: 'var(--color-accent)' }} />
          <div className="absolute bottom-32 right-20 w-24 h-24 rounded-full opacity-30 animate-bounce"
               style={{ backgroundColor: 'var(--color-accent)' }} />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full opacity-25 animate-ping"
               style={{ backgroundColor: 'var(--color-accent)' }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 text-white">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                 style={{ backgroundColor: 'var(--color-accent)' }}>
              <span className="text-4xl font-bold" style={{ color: 'var(--color-primary)' }}>
                MF
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome to MF App</h1>
            <p className="text-xl opacity-90 max-w-md">
              Your trusted partner in mutual fund investments. Secure, reliable, and profitable.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold">₹10L+</div>
              <div className="text-sm opacity-80">Assets Managed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-sm opacity-80">Happy Investors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">15%</div>
              <div className="text-sm opacity-80">Avg. Returns</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-2 lg:px-8 py-4">
        {/* Theme Selector */}
        <div className="absolute top-6 right-6 z-20">
          <select
            value={currentTheme.name.toLowerCase()}
            onChange={(e) => setTheme(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: 'var(--color-muted)',
              color: 'var(--color-foreground)',
              borderColor: 'var(--color-border)',
            }}
          >
            {availableThemes.map((theme) => (
              <option key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Logo */}
        <div className="lg:hidden text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
               style={{ backgroundColor: 'var(--color-primary)' }}>
            <span className="text-2xl font-bold text-white">MF</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>
            Welcome Back
          </h1>
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Login Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 hidden lg:block" style={{ color: 'var(--color-foreground)' }}>
              Sign In
            </h2>
            <p className="text-base" style={{ color: 'var(--color-muted-foreground)' }}>
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg text-sm" 
                 style={{ 
                   backgroundColor: 'var(--color-destructive)',
                   color: 'var(--color-destructive-foreground)'
                 }}>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-foreground)' }}
              >
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--color-input)',
                    color: 'var(--color-foreground)',
                    borderColor: 'var(--color-border)',
                  }}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400">👤</span>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-foreground)' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all pr-12"
                  style={{
                    backgroundColor: 'var(--color-input)',
                    color: 'var(--color-foreground)',
                    borderColor: 'var(--color-border)',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 hover:opacity-70"
                >
                  <span className="text-gray-400">
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
              </div>
              <Link 
                href="/forgot-password" 
                className="text-sm hover:underline transition-all"
                style={{ color: 'var(--color-primary)' }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }}></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              Don't have an account?{' '}
              <Link 
                href="/register" 
                className="font-medium hover:underline transition-all"
                style={{ color: 'var(--color-primary)' }}
              >
                Sign up
              </Link>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
          <p>© 2024 MF App. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <Link href="#" className="hover:underline">Terms of Service</Link>
            <Link href="#" className="hover:underline">Support</Link>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        input:focus {
          ring-width: 2px;
          ring-color: var(--color-ring);
        }
        
        button:hover {
          transform: translateY(-1px);
        }
        
        button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}