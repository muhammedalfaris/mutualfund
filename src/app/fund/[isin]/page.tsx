"use client";

import Navbar from '@/components/dashboard/Navbar';
import { useTheme } from '@/context/ThemeContext';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

type ChartPoint = { date: string; value: number };

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatAUM = (amount: number | string | undefined) => {
  if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
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
  const params = useParams();
  const isin = Array.isArray(params.isin) ? params.isin[0] : params.isin;
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('1Y');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [activeAllocationTab, setActiveAllocationTab] = useState<'sectors' | 'holdings'>('sectors');
  const [fundDetails, setFundDetails] = useState<any>(null);
  const [navHistory, setNavHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isin) return;
    setLoading(true);
    setError(null);
    // Fetch fund details
    const fetchDetails = async () => {
      try {
        const [detailsRes, navRes] = await Promise.all([
          fetch(`https://pl.pr.flashfund.in/schemedetails/scheme/detail/${isin}`),
          fetch(`https://vyable-be.onrender.com/scheme/nav-history/?isin=${isin}`)
        ]);
        const detailsData = await detailsRes.json();
        const navData = await navRes.json();
        // Map API response to UI structure
        const basic = detailsData?.data?.basic_info || {};
        const perf = detailsData?.data?.risk_and_performance || {};
        const invest = detailsData?.data?.investment_details || {};
        const fund = {
          name: basic.scheme_name || 'N/A',
          category: basic.scheme_type || 'N/A',
          subCategory: basic.category || 'N/A',
          nav: perf.current_nav ?? null,
          navDate: navData?.results?.[0]?.nav_date ? new Date(navData.results[0].nav_date).toLocaleDateString('en-IN') : 'N/A',
          navChange: 'N/A', // Not available in API
          returns: {
            '1M': 'N/A',
            '6M': 'N/A',
            '1Y': perf.nav_1year_return ?? 'N/A',
            '3Y': perf.nav_3year_return ?? 'N/A',
            '5Y': perf.nav_5year_return ?? 'N/A',
            'overall': 'N/A',
          },
          historicalData: {
            '1M': [],
            '6M': [],
            '1Y': [],
            '3Y': [],
            '5Y': [],
          },
          sectorAllocation: [], // Not available in API
          topHoldings: [], // Not available in API
          riskLevel: perf.current_risk || 'N/A',
          minInvestment: invest.min_sip_amount ?? 'N/A',
          lumpsum: invest.face_value ?? 'N/A',
          aum: 'N/A', // Not available in API
          expenseRatio: 'N/A', // Not available in API
          rating: 'N/A', // Not available in API
          manager: invest.fund_manager || 'N/A',
          isTopPick: false,
          isNew: false,
          isTrending: false,
          fundType: basic.fund_type || 'N/A',
          planType: basic.scheme_plan || 'N/A',
          investmentType: basic.scheme_type || 'N/A',
          categoryType: basic.category || 'N/A',
          growthType: 'N/A',
          since: detailsData?.data?.dates_and_status?.start_date ? new Date(detailsData.data.dates_and_status.start_date).toLocaleDateString('en-IN') : 'N/A',
          yearMonths: 'N/A',
        };
        // Map NAV history to chart data
        if (Array.isArray(navData?.results)) {
          const navs = navData.results.map((item: any) => ({
            date: item.nav_date,
            value: parseFloat(item.nav_value)
          })).reverse();
          // Fill historicalData for 1M, 6M, 1Y, 3Y, 5Y
          const now = new Date();
          const filterByMonths = (months: number) => navs.filter((n: any) => {
            const d = new Date(n.date);
            return d >= new Date(now.getFullYear(), now.getMonth() - months, now.getDate());
          });
          fund.historicalData['1M'] = filterByMonths(1);
          fund.historicalData['6M'] = filterByMonths(6);
          fund.historicalData['1Y'] = filterByMonths(12);
          fund.historicalData['3Y'] = filterByMonths(36);
          fund.historicalData['5Y'] = filterByMonths(60);
        }
        setFundDetails(fund);
        setNavHistory(navData?.results || []);
      } catch (e: any) {
        setError('Failed to load fund details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [isin]);

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
              {typeof fundDetails?.returns[duration as keyof typeof fundDetails.returns] === 'number'
                ? `${isPositive ? '+' : ''}${(fundDetails.returns[duration as keyof typeof fundDetails.returns] as number).toFixed(1)}%`
                : 'N/A'}
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
                {fundDetails?.sectorAllocation.map((sector: any, index: number) => (
                  <linearGradient key={index} id={`sector-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={sector.color} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={sector.color} stopOpacity="1" />
                  </linearGradient>
                ))}
              </defs>
              {(() => {
                let cumulativePercentage = 0;
                return fundDetails?.sectorAllocation.map((sector: any, index: number) => {
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
          {fundDetails?.sectorAllocation.map((sector: any, index: number) => (
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
      {fundDetails?.topHoldings.map((holding: any, index: number) => (
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

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading fund details...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }
  if (!fundDetails) {
    return null;
  }

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
            <div className="w-8 h-8 rounded border flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: getCategoryColor(fundDetails?.category) }}>
              AB
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-foreground)' }}>{fundDetails?.name}</h2>
            </div>
          </div>

          {/* Fund Type Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
              {fundDetails?.fundType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--color-secondary)', color: 'white' }}>
              {fundDetails?.categoryType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--color-success)', color: 'white' }}>
              {fundDetails?.investmentType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--color-warning)', color: 'white' }}>
              {fundDetails?.planType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--color-ring)', color: 'white' }}>
              {fundDetails?.growthType}
            </span>
          </div>

          {/* Min Investment and Rating */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm mb-1" style={{ color: 'var(--color-muted-foreground)' }}>Min. Investment</p>
              <p className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>
                SIP {formatCurrency(fundDetails?.minInvestment)} • Lumpsum {formatCurrency(fundDetails?.lumpsum)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm mb-1" style={{ color: 'var(--color-muted-foreground)' }}>Rating</p>
              <div className="flex items-center space-x-1">
                {renderStars(fundDetails?.rating)}
                <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                  {fundDetails?.rating}
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
                <span className="text-lg font-bold text-green-600">↗ {fundDetails?.returns.overall}%</span>
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
                  <span className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>₹{fundDetails?.nav.toFixed(3)}</span>
                  <span className="text-sm font-medium text-green-600">↗ {fundDetails?.navChange}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>as on {fundDetails?.navDate}</p>
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
                <span className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>{formatAUM(fundDetails?.aum)}</span>
                <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  <p>Since {fundDetails?.since}</p>
                  <p>{fundDetails?.yearMonths}</p>
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
              {Object.keys(fundDetails?.returns).filter(key => key !== 'overall').map((duration) => (
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
                data={fundDetails?.historicalData[selectedDuration as keyof typeof fundDetails.historicalData]} 
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
              <span className="text-sm font-medium px-2 py-1 rounded-full" style={{ backgroundColor: getRiskColor(fundDetails?.riskLevel) + '20', color: getRiskColor(fundDetails?.riskLevel) }}>{fundDetails?.riskLevel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Expense Ratio</span>
              <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{fundDetails?.expenseRatio}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Fund Manager</span>
              <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{fundDetails?.manager}</span>
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