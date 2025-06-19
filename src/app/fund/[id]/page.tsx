"use client";

import Navbar from '@/components/dashboard/Navbar';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import React from 'react';

// For now, static data for one fund
const fund = {
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

  return (
    <div className="justify-center"> 
        <Navbar activeMenu="" />
    <div className="min-h-screen flex flex-col items-center px-4 py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="w-full max-w-2xl p-8 rounded-2xl border shadow-lg space-y-6" style={{ backgroundColor: 'var(--color-muted)', borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-4 px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }}
        >
          ← Back to Dashboard
        </button>
        <div className="flex items-center space-x-4">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getCategoryColor(fund.category) }} />
          <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--color-muted-foreground)' }}>{fund.subCategory}</span>
        </div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>{fund.name}</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>NAV</p>
            <p className="text-xl font-bold" style={{ color: 'var(--color-foreground)' }}>₹{fund.nav.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">{renderStars(fund.rating)}<span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{fund.rating}</span></div>
            <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{fund.rating >= 4.5 ? 'Excellent' : fund.rating >= 4 ? 'Very Good' : fund.rating >= 3.5 ? 'Good' : 'Average'}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(fund.returns).map(([period, value]) => (
            <div key={period} className="text-center p-2 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
              <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{period}</p>
              <p className={`text-sm font-bold ${value >= 15 ? 'text-green-600' : value >= 10 ? 'text-blue-600' : 'text-gray-600'}`}>{value.toFixed(1)}%</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Risk Level</span>
            <span className="text-sm font-medium px-2 py-1 rounded-full" style={{ backgroundColor: getRiskColor(fund.riskLevel) + '20', color: getRiskColor(fund.riskLevel) }}>{fund.riskLevel}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Min Investment</span>
            <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{formatCurrency(fund.minInvestment)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>AUM</span>
            <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{formatAUM(fund.aum)}</span>
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
        <div className="flex space-x-3 mt-6">
          <button className="flex-1 py-2 px-4 rounded-lg border transition-all duration-200 hover:shadow-md" style={{ backgroundColor: 'transparent', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
            <span className="text-sm font-medium">Invest Now</span>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
} 