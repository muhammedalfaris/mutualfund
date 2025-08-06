'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import FundDonutChart from '@/components/dashboard/FundDonutChart';
import DiscoverFunds from '@/components/dashboard/DiscoverFundSection';
import Navbar from '@/components/dashboard/Navbar';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';

interface PortfolioData {
  totalInvestment: number;
  currentValue: number;
  totalGainLoss: number;
  gainLossPercentage: number;
  // todaysGainLoss: number;
  // availableBalance: number;
}

interface UserData {
  fullName: string;
  accountNumber: string;
  memberSince: string;
  accountType: string;
  riskProfile: string;
}

export default function Dashboard() {
  const { } = useTheme();
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const portfolioData: PortfolioData = {
    totalInvestment: 10375000,
    currentValue: 12304750,
    totalGainLoss: 1929750,
    gainLossPercentage: 18.6,
    // todaysGainLoss: 103750,
    // availableBalance: 1037500,
  };

  const userData: UserData = {
    fullName: "John Alexander Smith",
    accountNumber: "****-****-****-2847",
    memberSince: "January 2022",
    accountType: "Premium Investor",
    riskProfile: "Moderate",
  };

  const quickAccessItems = [
    { name: 'Invest', icon: '💰', color: 'var(--color-success)' },
    { name: 'Withdraw', icon: '🏦', color: 'var(--color-warning)' },
    { name: 'Transfer', icon: '🔄', color: 'var(--color-primary)' },
    { name: 'Reports', icon: '📊', color: 'var(--color-secondary)' },
    { name: 'History', icon: '📋', color: 'var(--color-accent)' },
    { name: 'Support', icon: '🎧', color: 'var(--color-info)' },
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

  // Function to fetch external schemes data
  const fetchExternalSchemes = async (pan: string) => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem('accessToken');
      const response = await fetch(`https://walletfree-api.nexcard.co.in/api/mfcentral/casresponse/?pan=${pan}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Store the response in session storage
      sessionStorage.setItem('extScheme', JSON.stringify(data));
      
      console.log('External schemes data fetched and stored successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching external schemes:', error);
      // You might want to show a toast notification or handle the error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  // Auth guard and API call on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        router.replace('/login');
        return;
      }

      // Check if external schemes data already exists to avoid unnecessary API calls
      const existingExtScheme = sessionStorage.getItem('extScheme');
      if (!existingExtScheme) {
        // Get PAN from basic details
        const basicDetailsStr = sessionStorage.getItem('basicDetails');
        if (basicDetailsStr) {
          try {
            const basicDetails = JSON.parse(basicDetailsStr);
            const pan = basicDetails.pan;
            
            if (pan) {
              fetchExternalSchemes(pan);
            } else {
              console.warn('PAN not found in basic details');
            }
          } catch (error) {
            console.error('Error parsing basic details:', error);
          }
        } else {
          console.warn('Basic details not found in session storage');
        }
      }
    }
  }, [router]);

  return (
    <AuthGuard>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <Navbar activeMenu="Dashboard" />

        <main className="max-w-7xl mx-auto px-4 mt-20 lg:px-6 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-foreground)' }}>
              Welcome back, John
            </h2>
            <p style={{ color: 'var(--color-muted-foreground)' }}>
              Here&apos;s your portfolio performance overview
              {isLoading && <span className="ml-2 text-sm">(Loading external data...)</span>}
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
                          {formatCurrency(portfolioData.totalGainLoss)} 
                          {/* ({formatPercentage(portfolioData.gainLossPercentage)}) */}
                        </span>
                      </div>  

                      {/* <div className="flex justify-between">
                        <span className="text-sm opacity-90">Today&apos;s Change</span>
                        <span className={`text-sm font-medium ${
                          portfolioData.todaysGainLoss >= 0 ? 'text-green-300' : 'text-red-300'
                        }`}>
                          {portfolioData.todaysGainLoss >= 0 ? '+' : ''}{formatCurrency(portfolioData.todaysGainLoss)}
                        </span>
                      </div> */}
                       <div className="flex justify-between">
                        <span className="text-sm opacity-90">Returns</span>
                        <span className={`text-sm font-medium ${
                          portfolioData.gainLossPercentage >= 0 ? 'text-green-300' : 'text-red-300'
                        }`}>
                         {formatPercentage(portfolioData.gainLossPercentage)}
                        </span>
                      </div>
                    </div>
                    

                    <div className="flex justify-end">
                      {/* <div>
                        <p className="text-xs opacity-70">Available Balance</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(portfolioData.availableBalance)}
                        </p>
                      </div> */}
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

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
                Quick Access
              </h3>
              <p className="text-sm md:hidden" style={{ color: 'var(--color-muted-foreground)' }}>
                Swipe for more
              </p>
            </div>
            
            {/* Desktop Grid Layout */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickAccessItems.slice(0, 4).map((action) => (
                <button
                  key={action.name}
                  className="flex flex-col items-center p-4 rounded-xl border hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: 'var(--color-muted)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div 
                    className="w-12 h-12 mb-3 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: action.color, 
                      opacity: 0.6 
                    }}
                  >
                    <div 
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: action.color,
                        opacity: 0.8
                      }}
                    >
                      <span className="text-base">{action.icon}</span>
                    </div>
                  </div>
                  <p 
                    className="text-sm font-medium text-center"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    {action.name}
                  </p>
                </button>
              ))}
            </div>

            {/* Mobile Horizontal Scroll Layout */}
            <div className="relative md:hidden">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 pb-2" style={{ minWidth: 'fit-content' }}>
                  {quickAccessItems.map((action) => (
                    <button
                      key={action.name}
                      className="flex-shrink-0 flex flex-col items-center p-3 rounded-xl border hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 min-w-[80px]"
                      style={{
                        backgroundColor: 'var(--color-muted)',
                        borderColor: 'var(--color-border)',
                      }}
                    >
                      <div 
                        className="w-10 h-10 mb-2 rounded-full flex items-center justify-center"
                        style={{ 
                          backgroundColor: action.color, 
                          opacity: 0.6 
                        }}
                      >
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: action.color,
                            opacity: 0.8
                          }}
                        >
                          <span className="text-sm">{action.icon}</span>
                        </div>
                      </div>
                      <p 
                        className="text-xs font-medium text-center leading-tight"
                        style={{ color: 'var(--color-foreground)' }}
                      >
                        {action.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              {/* Scroll indicator
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gradient-to-l from-white/80 to-transparent w-8 h-full pointer-events-none md:hidden"
                 style={{ background: `linear-gradient(to left, var(--color-background) 0%, transparent 100%)` }}>
            </div> */}
            </div>
          </div>

          <div className="mb-8">
            <FundDonutChart />
          </div>
          <div className="mb-8">
            <DiscoverFunds />
          </div>
        </main>

        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .backface-hidden {
            backface-visibility: hidden;
          }
          .rotate-y-180 {
            transform: rotateY(180deg);
          }
        `}</style>
      </div>
    </AuthGuard>
  );
}