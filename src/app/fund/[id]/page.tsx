"use client";

import Navbar from '@/components/dashboard/Navbar';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type ChartPoint = { date: string; value: number };

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
  // Sector allocation data
  sectorAllocation: [
    { name: 'Financial Services', percentage: 28.45, color: '#3b82f6' },
    { name: 'Information Technology', percentage: 22.13, color: '#8b5cf6' },
    { name: 'Consumer Goods', percentage: 15.67, color: '#10b981' },
    { name: 'Healthcare', percentage: 12.34, color: '#f59e0b' },
    { name: 'Automobile', percentage: 8.92, color: '#ef4444' },
    { name: 'Energy', percentage: 7.23, color: '#06b6d4' },
    { name: 'Others', percentage: 5.26, color: '#64748b' },
  ],
  // Top holdings data
  topHoldings: [
    { name: 'Reliance Industries Ltd', percentage: 8.45, sector: 'Energy' },
    { name: 'HDFC Bank Ltd', percentage: 7.23, sector: 'Financial Services' },
    { name: 'Infosys Ltd', percentage: 6.89, sector: 'Information Technology' },
    { name: 'ICICI Bank Ltd', percentage: 5.67, sector: 'Financial Services' },
    { name: 'Tata Consultancy Services', percentage: 5.34, sector: 'Information Technology' },
    { name: 'Hindustan Unilever Ltd', percentage: 4.78, sector: 'Consumer Goods' },
    { name: 'ITC Ltd', percentage: 4.23, sector: 'Consumer Goods' },
    { name: 'State Bank of India', percentage: 3.89, sector: 'Financial Services' },
    { name: 'Bajaj Finance Ltd', percentage: 3.56, sector: 'Financial Services' },
    { name: 'Maruti Suzuki India Ltd', percentage: 3.12, sector: 'Automobile' },
  ],
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
  const [activeAllocationTab, setActiveAllocationTab] = useState<'sectors' | 'holdings'>('sectors');

  const EnhancedChart = ({ data, duration }: { data: ChartPoint[], duration: string }) => {
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div>
            <h4 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Performance Over {duration}
            </h4>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              NAV progression chart
            </p>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{fund.returns[duration as keyof typeof fund.returns]?.toFixed(1)}%
            </div>
            <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              {duration} Return
            </p>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-4 overflow-hidden">
          <svg 
            viewBox={`0 0 ${width} ${height}`} 
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
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
            <div className="text-base font-bold text-green-600">₹{maxValue.toFixed(2)}</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Current</div>
            <div className="text-base font-bold" style={{ color: 'var(--color-foreground)' }}>₹{data[data.length - 1].value.toFixed(2)}</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
            <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Lowest</div>
            <div className="text-base font-bold text-red-600">₹{minValue.toFixed(2)}</div>
          </div>
        </div>
      </div>
    );
  };

  // Sector Allocation Component
  const SectorAllocation = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="flex justify-center items-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              <defs>
                {fund.sectorAllocation.map((sector, index) => (
                  <linearGradient key={index} id={`sector-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={sector.color} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={sector.color} stopOpacity="1" />
                  </linearGradient>
                ))}
              </defs>
              {(() => {
                let cumulativePercentage = 0;
                return fund.sectorAllocation.map((sector, index) => {
                  const startAngle = (cumulativePercentage / 100) * 360;
                  const endAngle = ((cumulativePercentage + sector.percentage) / 100) * 360;
                  cumulativePercentage += sector.percentage;
                  
                  const startAngleRad = (startAngle * Math.PI) / 180;
                  const endAngleRad = (endAngle * Math.PI) / 180;
                  
                  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
                  
                  const x1 = 100 + 70 * Math.cos(startAngleRad);
                  const y1 = 100 + 70 * Math.sin(startAngleRad);
                  const x2 = 100 + 70 * Math.cos(endAngleRad);
                  const y2 = 100 + 70 * Math.sin(endAngleRad);
                  
                  const pathData = [
                    "M", 100, 100,
                    "L", x1, y1,
                    "A", 70, 70, 0, largeArcFlag, 1, x2, y2,
                    "Z"
                  ].join(" ");
                  
                  return (
                    <path
                      key={index}
                      d={pathData}
                      fill={`url(#sector-gradient-${index})`}
                      stroke="white"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  );
                });
              })()}
              <circle cx="100" cy="100" r="35" fill="var(--color-background)" stroke="var(--color-border)" strokeWidth="2" />
            </svg>
          </div>
        </div>
        
        {/* Legend */}
        <div className="space-y-3">
          {fund.sectorAllocation.map((sector, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:shadow-sm transition-shadow" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: sector.color }}></div>
                <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{sector.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(sector.percentage / 30) * 100}%`, backgroundColor: sector.color }}></div>
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>{sector.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Top Holdings Component
  const TopHoldings = () => (
    <div className="space-y-3">
      {fund.topHoldings.map((holding, index) => (
        <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:shadow-sm transition-all hover:border-blue-200" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: 'var(--color-primary)' }}>
                {index + 1}
              </div>
              <div>
                <h4 className="font-semibold text-sm" style={{ color: 'var(--color-foreground)' }}>{holding.name}</h4>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{holding.sector}</p>
              </div>
            </div>
            <div className="ml-11">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(holding.percentage / 9) * 100}%`, backgroundColor: 'var(--color-primary)' }}
                ></div>
              </div>
            </div>
          </div>
          <div className="text-right ml-4">
            <span className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>{holding.percentage}%</span>
          </div>
        </div>
      ))}
      <div className="text-center pt-2">
        <button className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
          View All Holdings
        </button>
      </div>
    </div>
  );

  return (
    <div className="justify-center"> 
      <Navbar activeMenu="" />
      <div className="min-h-screen flex flex-col items-center px-4 py-8" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="w-full max-w-2xl p-4 rounded-2xl border shadow-lg space-y-6" style={{ backgroundColor: 'var(--color-muted)', borderColor: 'var(--color-border)' }}>
          
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
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
              <EnhancedChart 
                data={fund.historicalData[selectedDuration as keyof typeof fund.historicalData]} 
                duration={selectedDuration}
              />
            </div>
          </div>

          {/* Portfolio Allocation Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>
              Portfolio Allocation
            </h3>
            
            {/* Allocation Tab Selection */}
            <div className="flex gap-1 mb-6 p-1 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
              <button
                onClick={() => setActiveAllocationTab('sectors')}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeAllocationTab === 'sectors' 
                    ? 'shadow-sm' 
                    : 'hover:opacity-75'
                }`}
                style={{
                  backgroundColor: activeAllocationTab === 'sectors' ? 'var(--color-primary)' : 'transparent',
                  color: activeAllocationTab === 'sectors' ? 'white' : 'var(--color-foreground)'
                }}
              >
                <span className="text-lg">🏢</span>
                Sectors
              </button>
              <button
                onClick={() => setActiveAllocationTab('holdings')}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeAllocationTab === 'holdings' 
                    ? 'shadow-sm' 
                    : 'hover:opacity-75'
                }`}
                style={{
                  backgroundColor: activeAllocationTab === 'holdings' ? 'var(--color-primary)' : 'transparent',
                  color: activeAllocationTab === 'holdings' ? 'white' : 'var(--color-foreground)'
                }}
              >
                <span className="text-lg">📊</span>
                Holdings
              </button>
            </div>

            {/* Allocation Content */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
              {activeAllocationTab === 'sectors' ? <SectorAllocation /> : <TopHoldings />}
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