'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';

interface FundData {
  id: string;
  name: string;
  category: 'equity' | 'debt' | 'hybrid' | 'commodity' | 'index';
  subCategory: string;
  nav: number;
  returns: {
    '1Y': number;
    '3Y': number;
    '5Y': number;
  };
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  minInvestment: number;
  aum: number;
  expenseRatio: number;
  rating: number;
  manager: string;
  isTopPick: boolean;
  isNew: boolean;
  isTrending: boolean;
}

const DiscoverFunds = () => {
  const { } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredFund, setHoveredFund] = useState<string | null>(null);
  const [animatedCards, setAnimatedCards] = useState<string[]>([]);
  const router = useRouter();

  const fundsData: FundData[] = [
    {
      id: '1',
      name: 'Axis Bluechip Fund',
      category: 'equity',
      subCategory: 'Large Cap',
      nav: 45.67,
      returns: { '1Y': 18.5, '3Y': 15.2, '5Y': 12.8 },
      riskLevel: 'High',
      minInvestment: 415000,
      aum: 3735000,
      expenseRatio: 1.8,
      rating: 4.5,
      manager: 'Shreyash Devalkar',
      isTopPick: true,
      isNew: false,
      isTrending: true,
    },
    {
      id: '2',
      name: 'HDFC Corporate Bond Fund',
      category: 'debt',
      subCategory: 'Corporate Bond',
      nav: 23.45,
      returns: { '1Y': 8.2, '3Y': 7.8, '5Y': 8.5 },
      riskLevel: 'Low',
      minInvestment: 83000,
      aum: 1037500,
      expenseRatio: 0.9,
      rating: 4.2,
      manager: 'Rahul Goswami',
      isTopPick: false,
      isNew: true,
      isTrending: false,
    },
    {
      id: '3',
      name: 'SBI Gold ETF',
      category: 'commodity',
      subCategory: 'Gold',
      nav: 56.78,
      returns: { '1Y': 12.3, '3Y': 9.8, '5Y': 8.9 },
      riskLevel: 'Moderate',
      minInvestment: 166000,
      aum: 705500,
      expenseRatio: 0.5,
      rating: 4.0,
      manager: 'Nitesh Jain',
      isTopPick: false,
      isNew: false,
      isTrending: true,
    },
    {
      id: '4',
      name: 'Mirae Asset Hybrid Equity Fund',
      category: 'hybrid',
      subCategory: 'Aggressive Hybrid',
      nav: 34.12,
      returns: { '1Y': 14.7, '3Y': 12.5, '5Y': 11.2 },
      riskLevel: 'Moderate',
      minInvestment: 249000,
      aum: 1568700,
      expenseRatio: 1.4,
      rating: 4.3,
      manager: 'Neelesh Surana',
      isTopPick: true,
      isNew: false,
      isTrending: false,
    },
    {
      id: '5',
      name: 'UTI Nifty Index Fund',
      category: 'index',
      subCategory: 'Large Cap Index',
      nav: 78.90,
      returns: { '1Y': 16.8, '3Y': 13.5, '5Y': 11.8 },
      riskLevel: 'High',
      minInvestment: 83000,
      aum: 2124800,
      expenseRatio: 0.2,
      rating: 4.1,
      manager: 'Sharwan Kumar Goyal',
      isTopPick: false,
      isNew: true,
      isTrending: true,
    },
    {
      id: '6',
      name: 'ICICI Prudential Bluechip Fund',
      category: 'equity',
      subCategory: 'Large Cap',
      nav: 67.45,
      returns: { '1Y': 17.2, '3Y': 14.8, '5Y': 12.5 },
      riskLevel: 'High',
      minInvestment: 415000,
      aum: 3170600,
      expenseRatio: 1.9,
      rating: 4.4,
      manager: 'Anuj Dawar',
      isTopPick: true,
      isNew: false,
      isTrending: false,
    },
  ];

  const categories = [
    { id: 'all', name: 'All Funds', icon: '📊' },
    { id: 'equity', name: 'Equity', icon: '📈' },
    { id: 'debt', name: 'Debt', icon: '🏦' },
    { id: 'hybrid', name: 'Hybrid', icon: '⚖️' },
    { id: 'commodity', name: 'Commodity', icon: '🏅' },
    { id: 'index', name: 'Index', icon: '📉' },
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
      setAnimatedCards(fundsData.map(fund => fund.id));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredFunds = fundsData.filter(fund => {
    const categoryMatch = selectedCategory === 'all' || fund.category === selectedCategory;
    const riskMatch = selectedRisk === 'all' || fund.riskLevel === selectedRisk;
    const searchMatch = searchQuery === '' || 
      fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && riskMatch && searchMatch;
  });

  const sortedFunds = [...filteredFunds].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'returns':
        return b.returns['1Y'] - a.returns['1Y'];
      case 'aum':
        return b.aum - a.aum;
      case 'expense':
        return a.expenseRatio - b.expenseRatio;
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
      case 'equity': return '#3b82f6';
      case 'debt': return '#10b981';
      case 'hybrid': return '#8b5cf6';
      case 'commodity': return '#f59e0b';
      case 'index': return '#06b6d4';
      default: return 'var(--color-primary)';
    }
  };

  const renderStars = (rating: number) => {
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
          placeholder="Search funds by name, manager, or category..."
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
            key={fund.id}
            className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer hover:shadow-xl ${
              animatedCards.includes(fund.id) ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            } ${
              hoveredFund === fund.id ? 'scale-105' : ''
            }`}
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: hoveredFund === fund.id ? getCategoryColor(fund.category) : 'var(--color-border)',
              borderWidth: hoveredFund === fund.id ? '2px' : '1px',
              transitionDelay: `${index * 100}ms`,
            }}
            onMouseEnter={() => setHoveredFund(fund.id)}
            onMouseLeave={() => setHoveredFund(null)}
            onClick={() => router.push(`/fund/${fund.id}`)}
          >
            {/* Fund Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(fund.category) }}
                  />
                  <span className="text-xs font-medium uppercase tracking-wide"
                        style={{ color: 'var(--color-muted-foreground)' }}>
                    {fund.subCategory}
                  </span>
                </div>
                <h3 className="text-lg font-bold leading-tight mb-1" 
                    style={{ color: 'var(--color-foreground)' }}>
                  {fund.name}
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  {fund.manager}
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
                  ₹{fund.nav.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  {renderStars(fund.rating)}
                  <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                    {fund.rating}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  {fund.rating >= 4.5 ? 'Excellent' : fund.rating >= 4 ? 'Very Good' : fund.rating >= 3.5 ? 'Good' : 'Average'}
                </p>
              </div>
            </div>

            {/* Returns */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {Object.entries(fund.returns).map(([period, value]) => (
                <div key={period} className="text-center p-2 rounded-lg"
                     style={{ backgroundColor: 'var(--color-muted)' }}>
                  <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                    {period}
                  </p>
                  <p className={`text-sm font-bold ${
                    value >= 15 ? 'text-green-600' : value >= 10 ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {value.toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>

            {/* Fund Details */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  Risk Level
                </span>
                <span className="text-sm font-medium px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: getRiskColor(fund.riskLevel) + '20',
                        color: getRiskColor(fund.riskLevel)
                      }}>
                  {fund.riskLevel}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  Min Investment
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                  {formatCurrency(fund.minInvestment)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  AUM
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                  {formatAUM(fund.aum)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  Expense Ratio
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                  {fund.expenseRatio}%
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
                onClick={e => { e.stopPropagation(); router.push(`/fund/${fund.id}`); }}
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