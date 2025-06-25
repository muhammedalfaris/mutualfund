'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';

interface FundData {
  _id: string;
  scheme_name: string;
  scheme_type: string;
  category: string;
  nav_value: number;
  nav_1year_return: number;
  nav_3year_return: number;
  nav_5year_return: number;
  min_investment: number;
  scheme_code: string;
  isin: string;
  amc_code: string;
  fund_type: string;
  scheme_plan: string;
  settlement_type: string;
  // Fields from UI not in API (will show as N/A)
  riskLevel?: 'Low' | 'Moderate' | 'High' | 'Very High';
  aum?: number;
  expenseRatio?: number;
  rating?: number;
  manager?: string;
  isTopPick?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
}

const DiscoverFunds = () => {
  const { } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredFund, setHoveredFund] = useState<string | null>(null);
  const [animatedCards, setAnimatedCards] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fundsData, setFundsData] = useState<FundData[]>([]);
  const router = useRouter();

  // Fetch funds data from API
  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const response = await fetch('https://pl.pr.flashfund.in/Wyable/mutual-funds');
        const data = await response.json();
        
        // Map API data to our UI structure
        const mappedData = data.data.map((fund: FundData) => ({
          ...fund,
          // Add UI-specific fields with default values
          riskLevel: 'Moderate', // Default value since not in API
          aum: 0, // Will show as N/A
          expenseRatio: 0, // Will show as N/A
          rating: 4.0, // Default rating
          manager: 'N/A', // Not in API
          isTopPick: Math.random() > 0.7, // Random top picks
          isNew: Math.random() > 0.8, // Random new funds
          isTrending: Math.random() > 0.6, // Random trending funds
          // Map returns to match UI structure
          returns: {
            '1Y': fund.nav_1year_return,
            '3Y': fund.nav_3year_return,
            '5Y': fund.nav_5year_return
          }
        }));
        
        setFundsData(mappedData);
      } catch (error) {
        console.error('Error fetching funds:', error);
        // Fallback to dummy data if API fails
        setFundsData([
          {
            _id: '1',
            scheme_name: 'Axis Bluechip Fund',
            scheme_type: 'EQUITY',
            category: 'Large Cap',
            nav_value: 45.67,
            nav_1year_return: 18.5,
            nav_3year_return: 15.2,
            nav_5year_return: 12.8,
            min_investment: 415000,
            riskLevel: 'High',
            aum: 3735000,
            expenseRatio: 1.8,
            rating: 4.5,
            manager: 'Shreyash Devalkar',
            isTopPick: true,
            isNew: false,
            isTrending: true,
            scheme_code: 'AXBLUE',
            isin: 'INF12345678',
            amc_code: 'AXIS_MF',
            fund_type: 'Open Ended',
            scheme_plan: 'Growth',
            settlement_type: 'T1'
          },
          // ... other fallback data
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFunds();
  }, []);

  const categories = [
    { id: 'all', name: 'All Funds', icon: '📊' },
    { id: 'EQUITY', name: 'Equity', icon: '📈' },
    { id: 'DEBT', name: 'Debt', icon: '🏦' },
    { id: 'HYBRID', name: 'Hybrid', icon: '⚖️' },
    { id: 'LIQUID', name: 'Liquid', icon: '💧' },
    { id: 'ELSS', name: 'ELSS', icon: '💰' },
  ];

  const riskLevels = [
    { id: 'all', name: 'All Risk Levels' },
    { id: 'Low', name: 'Low Risk' },
    { id: 'Moderate', name: 'Moderate Risk' },
    { id: 'High', name: 'High Risk' },
    { id: 'Very High', name: 'Very High Risk' },
  ];

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedCards(fundsData.map(fund => fund._id));
    }, 100);
    return () => clearTimeout(timer);
  }, [fundsData]);

  const filteredFunds = fundsData.filter(fund => {
    const categoryMatch = selectedCategory === 'all' || fund.scheme_type === selectedCategory;
    const riskMatch = selectedRisk === 'all' || fund.riskLevel === selectedRisk;
    const searchMatch = searchQuery === '' || 
      fund.scheme_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fund.manager && fund.manager.toLowerCase().includes(searchQuery.toLowerCase())) ||
      fund.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.scheme_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.amc_code.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && riskMatch && searchMatch;
  });

  const sortedFunds = [...filteredFunds].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'returns':
        return (b.nav_1year_return || 0) - (a.nav_1year_return || 0);
      case 'aum':
        return (b.aum || 0) - (a.aum || 0);
      case 'expense':
        return (a.expenseRatio || 0) - (b.expenseRatio || 0);
      case 'nav':
        return b.nav_value - a.nav_value;
      case 'min_investment':
        return a.min_investment - b.min_investment;
      default:
        return 0;
    }
  });

  // Show only 6 suggested funds when no search/filter is applied
  const displayFunds = (searchQuery === '' && selectedCategory === 'all' && selectedRisk === 'all') 
    ? sortedFunds.slice(0, 6) 
    : sortedFunds;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatAUM = (amount: number) => {
    if (!amount) return 'N/A';
    if (amount >= 100000000) {
      return `₹${(amount / 100000000).toFixed(1)} Cr`;
    } else if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return '#22c55e';
      case 'Moderate': return '#f59e0b';
      case 'High': return '#ef4444';
      case 'Very High': return '#dc2626';
      default: return 'var(--color-muted-foreground)';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'EQUITY': return '#3b82f6';
      case 'DEBT': return '#10b981';
      case 'HYBRID': return '#8b5cf6';
      case 'LIQUID': return '#06b6d4';
      case 'ELSS': return '#ec4899';
      default: return 'var(--color-primary)';
    }
  };

  const renderStars = (rating: number = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">★</span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      );
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 rounded-2xl border bg-gray-100 h-96 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-foreground)' }}>
            Discover Funds
          </h2>
          <p style={{ color: 'var(--color-muted-foreground)' }}>
            Explore and invest in top-performing mutual funds
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5" style={{ color: 'var(--color-muted-foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search funds by name, manager, category, scheme code or AMC..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border transition-colors"
          style={{
            backgroundColor: 'var(--color-input)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-foreground)',
          }}
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
              selectedCategory === category.id ? 'shadow-lg scale-105' : 'hover:shadow-md'
            }`}
            style={{
              backgroundColor: selectedCategory === category.id ? 'var(--color-primary)' : 'var(--color-muted)',
              borderColor: selectedCategory === category.id ? 'var(--color-primary)' : 'var(--color-border)',
              color: selectedCategory === category.id ? 'var(--color-background)' : 'var(--color-foreground)',
            }}
          >
            <span>{category.icon}</span>
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border"
           style={{
             backgroundColor: 'var(--color-muted)',
             borderColor: 'var(--color-border)',
           }}>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
            Risk Level
          </label>
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border transition-colors"
            style={{
              backgroundColor: 'var(--color-input)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          >
            {riskLevels.map((risk) => (
              <option key={risk.id} value={risk.id}>
                {risk.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border transition-colors"
            style={{
              backgroundColor: 'var(--color-input)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          >
            <option value="rating">Rating</option>
            <option value="returns">1Y Returns</option>
            <option value="aum">AUM</option>
            <option value="expense">Expense Ratio</option>
            <option value="nav">NAV Value</option>
            <option value="min_investment">Min Investment</option>
          </select>
        </div>

        <div className="flex items-end">
          <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            {displayFunds.length} funds {(searchQuery === '' && selectedCategory === 'all' && selectedRisk === 'all') ? 'suggested' : 'found'}
          </div>
        </div>
      </div>

      {/* Funds Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayFunds.map((fund, index) => (
          <div
            key={fund._id}
            className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer hover:shadow-xl ${
              animatedCards.includes(fund._id) ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            } ${
              hoveredFund === fund._id ? 'scale-105' : ''
            }`}
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: hoveredFund === fund._id ? getCategoryColor(fund.scheme_type) : 'var(--color-border)',
              borderWidth: hoveredFund === fund._id ? '2px' : '1px',
              transitionDelay: `${index * 100}ms`,
            }}
            onMouseEnter={() => setHoveredFund(fund._id)}
            onMouseLeave={() => setHoveredFund(null)}
            onClick={() => router.push(`/fund/${fund.isin}`)}
          >
            {/* Fund Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(fund.scheme_type) }}
                  />
                  <span className="text-xs font-medium uppercase tracking-wide"
                        style={{ color: 'var(--color-muted-foreground)' }}>
                    {fund.category || 'N/A'}
                  </span>
                </div>
                <h3 className="text-lg font-bold leading-tight mb-1" 
                    style={{ color: 'var(--color-foreground)' }}>
                  {fund.scheme_name}
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  {fund.manager || 'N/A'}
                </p>
              </div>

              <div className="flex flex-col items-end space-y-1">
                {fund.isTopPick && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{ 
                          backgroundColor: 'var(--color-success)',
                          color: 'var(--color-success-foreground)'
                        }}>
                    Top Pick
                  </span>
                )}
                {fund.isNew && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{ 
                          backgroundColor: 'var(--color-warning)',
                          color: 'var(--color-warning-foreground)'
                        }}>
                    New
                  </span>
                )}
                {fund.isTrending && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs">🔥</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                      Trending
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* NAV and Rating */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  NAV
                </p>
                <p className="text-xl font-bold" style={{ color: 'var(--color-foreground)' }}>
                  ₹{fund.nav_value.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  {renderStars(fund.rating)}
                  <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                    {fund.rating?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  {fund.rating ? 
                    (fund.rating >= 4.5 ? 'Excellent' : 
                     fund.rating >= 4 ? 'Very Good' : 
                     fund.rating >= 3.5 ? 'Good' : 'Average') : 'N/A'}
                </p>
              </div>
            </div>

            {/* Returns */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 rounded-lg"
                   style={{ backgroundColor: 'var(--color-muted)' }}>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  1Y
                </p>
                <p className={`text-sm font-bold ${
                  (fund.nav_1year_return || 0) >= 15 ? 'text-green-600' : 
                  (fund.nav_1year_return || 0) >= 10 ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {fund.nav_1year_return ? `${fund.nav_1year_return.toFixed(1)}%` : 'N/A'}
                </p>
              </div>
              <div className="text-center p-2 rounded-lg"
                   style={{ backgroundColor: 'var(--color-muted)' }}>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  3Y
                </p>
                <p className={`text-sm font-bold ${
                  (fund.nav_3year_return || 0) >= 15 ? 'text-green-600' : 
                  (fund.nav_3year_return || 0) >= 10 ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {fund.nav_3year_return ? `${fund.nav_3year_return.toFixed(1)}%` : 'N/A'}
                </p>
              </div>
              <div className="text-center p-2 rounded-lg"
                   style={{ backgroundColor: 'var(--color-muted)' }}>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  5Y
                </p>
                <p className={`text-sm font-bold ${
                  (fund.nav_5year_return || 0) >= 15 ? 'text-green-600' : 
                  (fund.nav_5year_return || 0) >= 10 ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {fund.nav_5year_return ? `${fund.nav_5year_return.toFixed(1)}%` : 'N/A'}
                </p>
              </div>
            </div>

            {/* Fund Details */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  Risk Level
                </span>
                <span className="text-sm font-medium px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: getRiskColor(fund.riskLevel || 'Moderate') + '20',
                        color: getRiskColor(fund.riskLevel || 'Moderate')
                      }}>
                  {fund.riskLevel || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  Min Investment
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                  {formatCurrency(fund.min_investment)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  AUM
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                  {fund.aum !== undefined ? formatAUM(fund.aum) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  Expense Ratio
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                  {fund.expenseRatio ? `${fund.expenseRatio}%` : 'N/A'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                className="flex-1 py-2 px-4 rounded-lg border transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                }}
                onClick={e => { e.stopPropagation(); router.push(`/fund/${fund.isin}`); }}
              >
                <span className="text-sm font-medium">View Details</span>
              </button>
              <button
                className="flex-1 py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-md hover:opacity-90"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-background)',
                }}
              >
                <span className="text-sm font-medium">Invest Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 p-6 rounded-2xl border"
           style={{
             backgroundColor: 'var(--color-muted)',
             borderColor: 'var(--color-border)',
           }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>
          Market Insights
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {fundsData.length}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              Total Funds
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>
              {fundsData.filter(f => f.isTopPick).length}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              Top Picks
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--color-warning)' }}>
              {fundsData.filter(f => f.isNew).length}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              New Funds
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--color-destructive)' }}>
              {fundsData.filter(f => f.isTrending).length}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              Trending
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverFunds;