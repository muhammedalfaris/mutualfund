'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { logoConfig } from '@/config/logo';

interface SignUpFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
}

interface ApiResponse {
  status: string;
  message?: string;
  error?: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<SignUpFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
    if (validationErrors[name as keyof SignUpFormData]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<SignUpFormData> = {};

    // Required field validation
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    const phoneRegex = /^\d{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        role: 'client',
        user: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName
        },
        distributor_id: 2,
        phone: formData.phone,
        address: formData.address
      };

      const response = await fetch('https://walletfree-api.nexcard.co.in/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      if (data.status === 'success') {
        // Registration successful, redirect to login
        router.push('/login?message=Registration successful. Please log in.');
      } else {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Left Side - Branding/Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden fixed-left">
        <div 
          className="absolute inset-0 opacity-90"
          style={{
            background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-primary) 100%)`,
          }}
        />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-5 left-15 w-32 h-32 rounded-full opacity-20 animate-pulse"
               style={{ backgroundColor: 'var(--color-accent)' }} />
          <div className="absolute top-44 left-51 w-34 h-34 rounded-full animate-pulse"
               style={{ backgroundColor: 'var(--color-muted)' }} />
          <div className="absolute bottom-32 right-20 w-24 h-24 rounded-full opacity-30 animate-bounce"
               style={{ backgroundColor: 'var(--color-accent)' }} />
          <div className="absolute top-1/2 left-1/3 w-10 h-10 rounded-full opacity-25 animate-ping"
               style={{ backgroundColor: 'var(--color-accent)' }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 text-white">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <Logo size="xl" style={{ backgroundColor: 'transparent', color: 'var(--color-primary)' }} />
            </div>
            <h1 className="text-4xl font-bold mb-4">Join {logoConfig.appName}</h1>
            <p className="text-xl opacity-90 max-w-md">
              Start your investment journey with us. Connect and Grow Together.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold">₹80Cr+</div>
              <div className="text-sm opacity-80">Assets Managed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">600+</div>
              <div className="text-sm opacity-80">Happy Investors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 lg:ml-auto overflow-y-auto px-8 py-2 lg:px-8 py-4 min-h-screen">
        {/* Mobile Logo */}
        <div className="lg:hidden text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" style={{ backgroundColor: 'transparent' }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>
            Create Account
          </h1>
        </div>

        <div className="w-full max-w-md mx-auto py-8 min-h-screen flex flex-col justify-center">
          {/* Sign Up Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 hidden lg:block" style={{ color: 'var(--color-foreground)' }}>
              Sign Up
            </h2>
            <p className="text-base" style={{ color: 'var(--color-muted-foreground)' }}>
              Create your account to start investing
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

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="firstName" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--color-input)',
                    color: 'var(--color-foreground)',
                    borderColor: validationErrors.firstName ? 'var(--color-destructive)' : 'var(--color-border)',
                  }}
                  required
                />
                {validationErrors.firstName && (
                  <p className="text-xs mt-1" style={{ color: 'var(--color-destructive)' }}>
                    {validationErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label 
                  htmlFor="lastName" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--color-input)',
                    color: 'var(--color-foreground)',
                    borderColor: validationErrors.lastName ? 'var(--color-destructive)' : 'var(--color-border)',
                  }}
                  required
                />
                {validationErrors.lastName && (
                  <p className="text-xs mt-1" style={{ color: 'var(--color-destructive)' }}>
                    {validationErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Username */}
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
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--color-input)',
                    color: 'var(--color-foreground)',
                    borderColor: validationErrors.username ? 'var(--color-destructive)' : 'var(--color-border)',
                  }}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400">👤</span>
                </div>
              </div>
              {validationErrors.username && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-destructive)' }}>
                  {validationErrors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-foreground)' }}
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--color-input)',
                    color: 'var(--color-foreground)',
                    borderColor: validationErrors.email ? 'var(--color-destructive)' : 'var(--color-border)',
                  }}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400">📧</span>
                </div>
              </div>
              {validationErrors.email && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-destructive)' }}>
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
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
                  placeholder="Create a password"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all pr-12"
                  style={{
                    backgroundColor: 'var(--color-input)',
                    color: 'var(--color-foreground)',
                    borderColor: validationErrors.password ? 'var(--color-destructive)' : 'var(--color-border)',
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
              {validationErrors.password && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-destructive)' }}>
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-foreground)' }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all pr-12"
                  style={{
                    backgroundColor: 'var(--color-input)',
                    color: 'var(--color-foreground)',
                    borderColor: validationErrors.confirmPassword ? 'var(--color-destructive)' : 'var(--color-border)',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 hover:opacity-70"
                >
                  <span className="text-gray-400">
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </span>
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-destructive)' }}>
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label 
                htmlFor="phone" 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-foreground)' }}
              >
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--color-input)',
                    color: 'var(--color-foreground)',
                    borderColor: validationErrors.phone ? 'var(--color-destructive)' : 'var(--color-border)',
                  }}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400">📱</span>
                </div>
              </div>
              {validationErrors.phone && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-destructive)' }}>
                  {validationErrors.phone}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label 
                htmlFor="address" 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--color-foreground)' }}
              >
                Address
              </label>
              <textarea
                name="address"
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
                style={{
                  backgroundColor: 'var(--color-input)',
                  color: 'var(--color-foreground)',
                  borderColor: validationErrors.address ? 'var(--color-destructive)' : 'var(--color-border)',
                }}
                required
              />
              {validationErrors.address && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-destructive)' }}>
                  {validationErrors.address}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }}></div>
          </div>

          <div className="text-center">
            <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-medium hover:underline transition-all"
                style={{ color: 'var(--color-primary)' }}
              >
                Sign in
              </Link>
            </span>
          </div>
        </div>

        <div className="mt-12 text-center text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
          <p>© 2025 MF App. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <Link href="#" className="hover:underline">Terms of Service</Link>
            <Link href="#" className="hover:underline">Support</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fixed-left {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 50%;
        }
        
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
        
        input:focus, textarea:focus {
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