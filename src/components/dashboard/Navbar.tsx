"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';

const menuItems = [
  { name: 'Dashboard' },
  { name: 'Portfolio' },
  { name: 'Investments' },
  { name: 'Transactions' },
  { name: 'Analytics' },
  { name: 'Settings' },
];

interface NavbarProps {
  activeMenu?: string; // optional
}

const Navbar: React.FC<NavbarProps> = ({ activeMenu = "" }) => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [pan, setPan] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = sessionStorage.getItem('username');
      setUserName(storedUsername);
    }
  }, []);

  const menuRoutes: Record<string, string> = {
    Dashboard: '/dashboard',
    Portfolio: '/portfolio',
    Investments: '/investments',
    Transactions: '/transactions',
    Analytics: '/analytics',
    Settings: '/settings',
  };

  const handlePortfolioClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPortfolioModal(true);
  };

  const handlePortfolioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!pan.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i)) {
      setFormError('Invalid PAN number');
      return;
    }
    if (!phone.match(/^\d{10}$/)) {
      setFormError('Invalid phone number');
      return;
    }
    setFormError(null);
    setShowPortfolioModal(false);
    // You can handle the form data here (API call, etc)
  };

  return (
    <nav className="border-b px-4 lg:px-4 py-4 fixed top-0 left-0 right-0 z-50"
         style={{ backgroundColor: 'var(--color-muted)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
               style={{ backgroundColor: 'var(--color-primary)' }}>
            <span className="text-xl font-bold" style={{ color: 'var(--color-background)' }}>
              MF
            </span>
          </div>
          <h1 className="text-xl font-bold hidden sm:block"
              style={{ color: 'var(--color-foreground)' }}>
            Investment Portal
          </h1>
        </div>

        <div className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                activeMenu === item.name ? 'font-medium' : 'hover:opacity-70'
              }`}
              style={{
                backgroundColor: activeMenu === item.name ? 'var(--color-primary)' : 'transparent',
                color: activeMenu === item.name ? 'var(--color-background)' : 'var(--color-foreground)',
              }}
              onClick={item.name === 'Portfolio' ? handlePortfolioClick : () => router.push(menuRoutes[item.name] || '/')}
            >
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={currentTheme.name.toLowerCase()}
            onChange={(e) => setTheme(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border transition-colors hidden sm:block"
            style={{
              backgroundColor: 'var(--color-input)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          >
            {availableThemes.map((theme) => (
              <option key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </option>
            ))}
          </select>

          <button className="p-2 rounded-lg hover:opacity-70 transition-opacity relative"
                  style={{ color: 'var(--color-foreground)' }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{ backgroundColor: 'var(--color-destructive)' }}>
            </span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2"
                 style={{ borderColor: 'var(--color-border)' }}>
              <div className="w-full h-full flex items-center justify-center"
                   style={{ backgroundColor: 'var(--color-primary)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--color-background)' }}>
                  {userName ? userName.slice(0,2).toUpperCase() : 'JS'}
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                {userName ? userName : 'John Smith'}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                {/* Optionally show account type or other info here */}
              </p>
            </div>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-foreground)' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {menuItems.map((item) => (
              <button
                key={item.name}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  activeMenu === item.name ? 'font-medium' : 'hover:opacity-70'
                }`}
                style={{
                  backgroundColor: activeMenu === item.name ? 'var(--color-primary)' : 'transparent',
                  color: activeMenu === item.name ? 'var(--color-background)' : 'var(--color-foreground)',
                }}
                onClick={item.name === 'Portfolio' ? handlePortfolioClick : () => router.push(menuRoutes[item.name] || '/')}
              >
                <span className="text-sm">{item.name}</span>
              </button>
            ))}
          </div>
          <select
            value={currentTheme.name.toLowerCase()}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border transition-colors"
            style={{
              backgroundColor: 'var(--color-input)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          >
            {availableThemes.map((theme) => (
              <option key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Modal for Portfolio */}
      <Modal isOpen={showPortfolioModal} onClose={() => setShowPortfolioModal(false)} title="Portfolio Access">
        <form onSubmit={handlePortfolioSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-foreground)' }}>PAN Number</label>
            <input
              type="text"
              value={pan}
              onChange={e => setPan(e.target.value.toUpperCase())}
              maxLength={10}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
              style={{ backgroundColor: 'var(--color-input)', color: 'var(--color-foreground)', borderColor: 'var(--color-border)' }}
              placeholder="ABCDE1234F"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-foreground)' }}>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={10}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
              style={{ backgroundColor: 'var(--color-input)', color: 'var(--color-foreground)', borderColor: 'var(--color-border)' }}
              placeholder="9876543210"
              required
            />
          </div>
          {formError && <div className="text-sm text-[var(--color-destructive)]">{formError}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Submit
          </button>
        </form>
      </Modal>
    </nav>
  );
};

export default Navbar;