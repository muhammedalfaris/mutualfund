"use client";

import Navbar from '@/components/dashboard/Navbar';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// Enhanced fund data with additional fields from reference
const fund = {
  id: '1',
  name: 'Axis Bluechip Fund',
  category: 'equity',
  subCategory: 'Large Cap',
  nav: 45.67,
  navDate: '16 Jun 2025',
  navChange: 1.12,
  returns: { 
    '1M': 2.3,
    '6M': 8.7,
    '1Y': 18.5, 
    '3Y': 15.2, 
    '5Y': 12.8,
    'overall': 19.31 // Overall return percentage
  },
  // Historical data for graph (sample data points)
  historicalData: {
    '1M': [
      { date: '2025-05-19', value: 44.89 },
      { date: '2025-05-26', value: 45.12 },
      { date: '2025-06-02', value: 44.78 },
      { date: '2025-06-09', value: 45.23 },
      { date: '2025-06-16', value: 45.67 },
    ],
    '6M': [
      { date: '2024-12-19', value: 42.15 },
      { date: '2025-01-19', value: 43.20 },
      { date: '2025-02-19', value: 42.85 },
      { date: '2025-03-19', value: 44.10 },
      { date: '2025-04-19', value: 44.95 },
      { date: '2025-05-19', value: 44.89 },
      { date: '2025-06-19', value: 45.67 },
    ],
    '1Y': [
      { date: '2024-06-19', value: 38.45 },
      { date: '2024-08-19', value: 39.80 },
      { date: '2024-10-19', value: 41.20 },
      { date: '2024-12-19', value: 42.15 },
      { date: '2025-02-19', value: 42.85 },
      { date: '2025-04-19', value: 44.95 },
      { date: '2025-06-19', value: 45.67 },
    ],
    '3Y': [
      { date: '2022-06-19', value: 35.20 },
      { date: '2022-12-19', value: 36.80 },
      { date: '2023-06-19', value: 38.90 },
      { date: '2023-12-19', value: 40.50 },
      { date: '2024-06-19', value: 38.45 },
      { date: '2024-12-19', value: 42.15 },
      { date: '2025-06-19', value: 45.67 },
    ],
    '5Y': [
      { date: '2020-06-19', value: 28.90 },
      { date: '2021-06-19', value: 32.40 },
      { date: '2022-06-19', value: 35.20 },
      { date: '2023-06-19', value: 38.90 },
      { date: '2024-06-19', value: 38.45 },
      { date: '2025-06-19', value: 45.67 },
    ],
  },
  riskLevel: 'High',
  minInvestment: 100,
  lumpsum: 100,
  aum: 970.28, // in crores
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
  const [selectedDuration, setSelectedDuration] = useState('1Y');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const EnhancedChart = ({ data, duration }: { data: any[], duration: string }) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;
    const width = 480;
    const height = 280;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * chartWidth + padding;
      const y = height - padding - ((point.value - minValue) / range) * chartHeight;
      return { x, y, value: point.value, date: point.date, index };
    });

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    const areaPathData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    const isPositive = data[data.length - 1].value > data[0].value;
    const primaryColor = isPositive ? '#22c55e' : '#ef4444';
    const gradientId = `gradient-${duration}`;

    // Format date for display
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Calculate grid lines
    const gridLines = [];
    const numGridLines = 4;
    for (let i = 0; i <= numGridLines; i++) {
      const y = height - padding - (i / numGridLines) * chartHeight;
      const value = minValue + (i / numGridLines) * range;
      gridLines.push({ y, value });
    }

    return (
      <div className="w-full">
        {/* Chart Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Performance Over {duration}
            </h4>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              NAV progression chart
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{fund.returns[duration as keyof typeof fund.returns]?.toFixed(1)}%
            </div>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              {duration} Return
            </p>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-4 overflow-hidden">
          <svg width={width} height={height} className="w-full">
            {/* Gradient Definitions */}
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={primaryColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={primaryColor} stopOpacity="0.05" />
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={primaryColor} floodOpacity="0.3"/>
              </filter>
            </defs>

            {/* Grid Lines */}
            {gridLines.map((line, index) => (
              <g key={index}>
                <line
                  x1={padding}
                  y1={line.y}
                  x2={width - padding}
                  y2={line.y}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  strokeDasharray="3,3"
                />
                <text
                  x={padding - 10}
                  y={line.y + 4}
                  fontSize="10"
                  fill="var(--color-muted-foreground)"
                  textAnchor="end"
                >
                  ₹{line.value.toFixed(1)}
                </text>
              </g>
            ))}

            {/* Area Fill */}
            <path
              d={areaPathData}
              fill={`url(#${gradientId})`}
            />

            {/* Main Line */}
            <path
              d={pathData}
              fill="none"
              stroke={primaryColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#shadow)"
            />

            {/* Data Points */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={hoveredPoint === index ? "6" : "4"}
                  fill="white"
                  stroke={primaryColor}
                  strokeWidth="3"
                  filter="url(#shadow)"
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  style={{ cursor: 'pointer' }}
                />
                
                {/* Tooltip on Hover */}
                {hoveredPoint === index && (
                  <g>
                    <rect
                      x={point.x - 35}
                      y={point.y - 45}
                      width="70"
                      height="35"
                      rx="6"
                      fill="rgba(0,0,0,0.8)"
                      stroke="none"
                    />
                    <text
                      x={point.x}
                      y={point.y - 30}
                      fontSize="10"
                      fill="white"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      ₹{point.value.toFixed(2)}
                    </text>
                    <text
                      x={point.x}
                      y={point.y - 18}
                      fontSize="8"
                      fill="white"
                      textAnchor="middle"
                      opacity="0.8"
                    >
                      {formatDate(point.date)}
                    </text>
                  </g>
                )}
              </g>
            ))}

            {/* X-axis labels */}
            {points.map((point, index) => {
              // Show labels for first, middle, and last points
              const showLabel = index === 0 || index === points.length - 1 || index === Math.floor(points.length / 2);
              if (!showLabel) return null;
              
              return (
                <text
                  key={`label-${index}`}
                  x={point.x}
                  y={height - 15}
                  fontSize="10"
                  fill="var(--color-muted-foreground)"
                  textAnchor="middle"
                >
                  {formatDate(point.date)}
                </text>
              );
            })}
          </svg>

          {/* Performance Indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-lg border">
            <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
              {isPositive ? 'Uptrend' : 'Downtrend'}
            </span>
          </div>
        </div>

        {/* Chart Statistics */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Highest</div>
            <div className="text-lg font-bold text-green-600">₹{maxValue.toFixed(2)}</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Current</div>
            <div className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>₹{data[data.length - 1].value.toFixed(2)}</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Lowest</div>
            <div className="text-lg font-bold text-red-600">₹{minValue.toFixed(2)}</div>
          </div>
        </div>
      </div>
    );
  };

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

          {/* Historical Returns Grid with Enhanced Graph */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
              Historical Returns
            </h3>
            
            {/* Duration Selection Tabs */}
            <div className="flex gap-1 mb-4 p-1 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
              {Object.keys(fund.returns).filter(key => key !== 'overall').map((duration) => (
                <button
                  key={duration}
                  onClick={() => setSelectedDuration(duration)}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    selectedDuration === duration 
                      ? 'shadow-sm' 
                      : 'hover:opacity-75'
                  }`}
                  style={{
                    backgroundColor: selectedDuration === duration ? 'var(--color-primary)' : 'transparent',
                    color: selectedDuration === duration ? 'white' : 'var(--color-foreground)'
                  }}
                >
                  {duration}
                </button>
              ))}
            </div>

            {/* Enhanced Graph Display */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
              <EnhancedChart 
                data={fund.historicalData[selectedDuration as keyof typeof fund.historicalData]} 
                duration={selectedDuration}
              />
            </div>
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