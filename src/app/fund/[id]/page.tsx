"use client";

import Navbar from '@/components/dashboard/Navbar';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const fund = {
  id: '1',
  name: 'Axis Bluechip Fund',
  category: 'equity',
  subCategory: 'Large Cap',
  nav: 45.67,
  navDate: '16 Jun 2025',
  navChange: 1.12,
  returns: { 
    '1Y': 18.5, 
    '3Y': 15.2, 
    '5Y': 12.8,
    'overall': 19.31 
  },
  riskLevel: 'High',
  minInvestment: 100,
  lumpsum: 100,
  aum: 970.28,
  expenseRatio: 1.0,
  rating: 4.5,
  manager: 'Shreyash Devalkar',
  isTopPick: true,
  isNew: false,
  isTrending: true,
  fundType: 'OPEN-ENDED',
  planType: 'DIRECT PLAN',
  investmentType: 'EQUITY',
  categoryType: 'SECTORAL/THEMATIC',
  growthType: 'GROWTH',
  since: '23 June 2023',
  yearMonths: '1 Year 11 Months',
  exitLoad: 1.0
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatAUM = (amount: number) => {
  return `₹${amount.toFixed(2)}Cr`;
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
    stars.push(<span key={i} className="text-yellow-400">★</span>);
  }
  if (hasHalfStar) {
    stars.push(<span key="half" className="text-yellow-400">★</span>);
  }
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
  }
  return stars;
};

export default function FundDetailPage() {
  const { } = useTheme();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="justify-center"> 
      <Navbar activeMenu="" />
      <div className="min-h-screen flex flex-col items-center px-4 py-8" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="w-full max-w-2xl p-8 rounded-2xl border shadow-lg space-y-6" style={{ backgroundColor: 'var(--color-muted)', borderColor: 'var(--color-border)' }}>
          
          {/* Header with back button and favorite */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:shadow-md flex items-center gap-2"
              style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }}
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 rounded-lg border transition-all hover:shadow-md"
              style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
            >
              <span className={`text-lg ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}>♡</span>
            </button>
          </div>

          {/* Fund Name and Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded border flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: getCategoryColor(fund.category) }}>
              AB
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-foreground)' }}>{fund.name}</h2>
            </div>
          </div>

          {/* Fund Type Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
              {fund.fundType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--color-secondary)', color: 'white' }}>
              {fund.categoryType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--color-success)', color: 'white' }}>
              {fund.investmentType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--color-warning)', color: 'white' }}>
              {fund.planType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--color-ring)', color: 'white' }}>
              {fund.growthType}
            </span>
          </div>

          {/* Min Investment and Rating */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm mb-1" style={{ color: 'var(--color-muted-foreground)' }}>Min. Investment</p>
              <p className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>
                SIP {formatCurrency(fund.minInvestment)} • Lumpsum {formatCurrency(fund.lumpsum)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm mb-1" style={{ color: 'var(--color-muted-foreground)' }}>Rating</p>
              <div className="flex items-center space-x-1">
                {renderStars(fund.rating)}
                <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                  {fund.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Returns Section */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👤</span>
                <span className="font-medium" style={{ color: 'var(--color-foreground)' }}>Returns</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-green-600">↗ {fund.returns.overall}%</span>
              </div>
            </div>
          </div>

          {/* NAV Section */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📈</span>
                <span className="font-medium" style={{ color: 'var(--color-foreground)' }}>NAV</span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>₹{fund.nav.toFixed(3)}</span>
                  <span className="text-sm font-medium text-green-600">↗ {fund.navChange}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>as on {fund.navDate}</p>
              </div>
            </div>
          </div>

          {/* AUM Section */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <span className="font-medium" style={{ color: 'var(--color-foreground)' }}>AUM</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>{formatAUM(fund.aum)}</span>
                <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  <p>Since {fund.since}</p>
                  <p>{fund.yearMonths}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Exit Load Section */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💼</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium" style={{ color: 'var(--color-foreground)' }}>Exit Load</span>
                  <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>ⓘ</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>{fund.exitLoad}</span>
              </div>
            </div>
          </div>

          {/* Historical Returns Grid */}
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(fund.returns).filter(([key]) => key !== 'overall').map(([period, value]) => (
              <div key={period} className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--color-muted-foreground)' }}>{period}</p>
                <p className={`text-sm font-bold ${value >= 15 ? 'text-green-600' : value >= 10 ? 'text-blue-600' : 'text-gray-600'}`}>{value.toFixed(1)}%</p>
              </div>
            ))}
          </div>

          {/* Additional Fund Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Risk Level</span>
              <span className="text-sm font-medium px-2 py-1 rounded-full" style={{ backgroundColor: getRiskColor(fund.riskLevel) + '20', color: getRiskColor(fund.riskLevel) }}>{fund.riskLevel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Expense Ratio</span>
              <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{fund.expenseRatio}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Fund Manager</span>
              <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{fund.manager}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex space-x-3 mt-6">
            <button className="flex-1 py-3 px-4 rounded-lg border transition-all duration-200 hover:shadow-md" style={{ backgroundColor: 'transparent', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
              <span className="text-sm font-medium">Invest Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}