'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import FundDonutChart from '@/components/dashboard/FundDonutChart';
import DiscoverFunds from '@/components/dashboard/DiscoverFundSection';

interface PortfolioData {
  totalInvestment: number;
  currentValue: number;
  totalGainLoss: number;
  gainLossPercentage: number;
  todaysGainLoss: number;
  availableBalance: number;
}

interface UserData {
  fullName: string;
  accountNumber: string;
  memberSince: string;
  accountType: string;
  riskProfile: string;
}

export default function Dashboard() {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const portfolioData: PortfolioData = {
    totalInvestment: 10375000,
    currentValue: 12304750,
    totalGainLoss: 1929750,
    gainLossPercentage: 18.6,
    todaysGainLoss: 103750,
    availableBalance: 1037500,
  };

  const userData: UserData = {
    fullName: "John Alexander Smith",
    accountNumber: "****-****-****-2847",
    memberSince: "January 2022",
    accountType: "Premium Investor",
    riskProfile: "Moderate",
  };

  const menuItems = [
    { name: 'Dashboard', active: true },
    { name: 'Portfolio', active: false },
    { name: 'Investments', active: false },
    { name: 'Transactions', active: false },
    { name: 'Analytics', active: false },
    { name: 'Settings', active: false },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <nav className="border-b px-4 lg:px-4 py-4" 
           style={{ 
             backgroundColor: 'var(--color-muted)', 
             borderColor: 'var(--color-border)' 
           }}>
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
                  item.active ? 'font-medium' : 'hover:opacity-70'
                }`}
                style={{
                  backgroundColor: item.active ? 'var(--color-primary)' : 'transparent',
                  color: item.active ? 'var(--color-background)' : 'var(--color-foreground)',
                }}
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
                    JS
                  </span>
                </div>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                  John Smith
                </p>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  Premium Member
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
                    item.active ? 'font-medium' : 'hover:opacity-70'
                  }`}
                  style={{
                    backgroundColor: item.active ? 'var(--color-primary)' : 'transparent',
                    color: item.active ? 'var(--color-background)' : 'var(--color-foreground)',
                  }}
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
      </nav>

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-foreground)' }}>
            Welcome back, John
          </h2>
          <p style={{ color: 'var(--color-muted-foreground)' }}>
            Here's your portfolio performance overview
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <div 
              className={`relative w-full h-64 cursor-pointer transition-transform duration-700 transform-gpu ${
                isCardFlipped ? 'rotate-y-180' : ''
              }`}
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
              onClick={() => setIsCardFlipped(!isCardFlipped)}
            >
              <div 
                className="absolute inset-0 w-full h-full rounded-2xl p-6 shadow-xl border backface-hidden"
                style={{
                  background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
                  borderColor: 'var(--color-border)',
                  backfaceVisibility: 'hidden',
                }}
              >
                <div className="flex flex-col h-full justify-between text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm opacity-90">Total Portfolio Value</p>
                      <h3 className="text-2xl font-bold">
                        {formatCurrency(portfolioData.currentValue)}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="w-12 h-8 bg-[#C0C0C0] bg-opacity-20 rounded flex items-center justify-center">
                        <span className="text-sm font-bold">MF</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm opacity-90">Total Investment</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(portfolioData.totalInvestment)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm opacity-90">Total Gain/Loss</span>
                      <span className={`text-sm font-medium ${
                        portfolioData.totalGainLoss >= 0 ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {formatCurrency(portfolioData.totalGainLoss)} ({formatPercentage(portfolioData.gainLossPercentage)})
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm opacity-90">Today's Change</span>
                      <span className={`text-sm font-medium ${
                        portfolioData.todaysGainLoss >= 0 ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {portfolioData.todaysGainLoss >= 0 ? '+' : ''}{formatCurrency(portfolioData.todaysGainLoss)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-70">Available Balance</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(portfolioData.availableBalance)}
                      </p>
                    </div>
                    <p className="text-xs opacity-70">Click to flip</p>
                  </div>
                </div>
              </div>

              <div 
                className="absolute inset-0 w-full h-full rounded-2xl p-6 shadow-xl border rotate-y-180 backface-hidden"
                style={{
                  background: `linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)`,
                  borderColor: 'var(--color-border)',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="flex flex-col h-full justify-between text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm opacity-90">Account Holder</p>
                      <h3 className="text-xl font-bold">{userData.fullName}</h3>
                    </div>
                    <div className="text-right">
                      <div className="w-12 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
                        <span className="text-xs font-bold">MF</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs opacity-70">Account Number</p>
                      <p className="text-lg font-mono tracking-wider">{userData.accountNumber}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs opacity-70">Member Since</p>
                        <p className="text-sm font-medium">{userData.memberSince}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-70">Account Type</p>
                        <p className="text-sm font-medium">{userData.accountType}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs opacity-70">Risk Profile</p>
                      <p className="text-sm font-medium">{userData.riskProfile}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex space-x-2">
                      <div className="w-8 h-5 bg-white bg-opacity-30 rounded"></div>
                      <div className="w-8 h-5 bg-white bg-opacity-30 rounded"></div>
                    </div>
                    <p className="text-xs opacity-70">Click to flip</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { name: 'Invest', icon: '💰', color: 'var(--color-success)' },
            { name: 'Withdraw', icon: '🏦', color: 'var(--color-warning)' },
            { name: 'Transfer', icon: '🔄', color: 'var(--color-primary)' },
            { name: 'Reports', icon: '📊', color: 'var(--color-secondary)' },
          ].map((action) => (
            <button
              key={action.name}
              className="p-4 rounded-xl border hover:shadow-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'var(--color-muted)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: action.color, opacity: 0.5 }}>
                  <span className="text-2xl">{action.icon}</span>
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                  {action.name}
                </p>
              </div>
            </button>
          ))}
        </div>
        <div className="mb-8">
          <FundDonutChart />
        </div>
        <div className="mb-8">
          <DiscoverFunds />
        </div>
      </main>
    </div>
  );
}