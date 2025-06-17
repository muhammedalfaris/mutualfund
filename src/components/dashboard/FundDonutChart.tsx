import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface FundData {
  name: string;
  percentage: number;
  amount: number;
  color: string;
  category: 'equity' | 'debt' | 'hybrid' | 'commodity';
}

const FundDonutChart = () => {
  const { } = useTheme();
  const [hoveredFund, setHoveredFund] = useState<number | null>(null);
  const [animatedPercentages, setAnimatedPercentages] = useState<number[]>([]);

  const fundData: FundData[] = [
    { name: 'Large Cap Equity', percentage: 35, amount: 51875, color: '#3b82f6', category: 'equity' },
    { name: 'Mid Cap Growth', percentage: 25, amount: 37062, color: '#10b981', category: 'equity' },
    { name: 'Debt Funds', percentage: 20, amount: 29650, color: '#f59e0b', category: 'debt' },
    { name: 'Small Cap', percentage: 12, amount: 17790, color: '#ef4444', category: 'equity' },
    { name: 'Gold ETF', percentage: 5, amount: 7412, color: '#8b5cf6', category: 'commodity' },
    { name: 'Hybrid Balanced', percentage: 3, amount: 4446, color: '#06b6d4', category: 'hybrid' },
  ];

  const totalAmount = fundData.reduce((sum, fund) => sum + fund.amount, 0);

  // Animation effect for percentages
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentages(fundData.map(fund => fund.percentage));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate SVG path for donut segments
  const createDonutPath = (percentage: number, startAngle: number, radius: number = 90, ) => {
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    const startX = 120 + radius * Math.cos(startAngleRad);
    const startY = 120 + radius * Math.sin(startAngleRad);
    const endX = 120 + radius * Math.cos(endAngleRad);
    const endY = 120 + radius * Math.sin(endAngleRad);
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  let cumulativeAngle = 0;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 rounded-2xl border shadow-lg"
         style={{
           backgroundColor: 'var(--color-muted)',
           borderColor: 'var(--color-border)',
         }}>
      
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-foreground)' }}>
          Fund Allocation
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          Distribution of your investment portfolio
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Donut Chart */}
        <div className="relative flex justify-center">
          <div className="relative">
            <svg width="240" height="240" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="120"
                cy="120"
                r="90"
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="30"
                opacity="0.1"
              />
              
              {/* Fund segments */}
              {fundData.map((fund, index) => {
                const currentAngle = cumulativeAngle;
                cumulativeAngle += (animatedPercentages[index] || 0) / 100 * 360;
                
                return (
                  <path
                    key={fund.name}
                    d={createDonutPath(animatedPercentages[index] || 0, currentAngle)}
                    fill="none"
                    stroke={fund.color}
                    strokeWidth={hoveredFund === index ? "35" : "30"}
                    strokeLinecap="round"
                    className="transition-all duration-300 cursor-pointer filter drop-shadow-sm"
                    style={{
                      opacity: hoveredFund !== null && hoveredFund !== index ? 0.4 : 1,
                    }}
                    onMouseEnter={() => setHoveredFund(index)}
                    onMouseLeave={() => setHoveredFund(null)}
                  />
                );
              })}
              
              {/* Center decoration ring */}
              <circle
                cx="120"
                cy="120"
                r="50"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2"
                opacity="0.2"
                className="animate-pulse"
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg border"
                   style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-xs font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
                  Total Value
                </p>
                <p className="text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Legend and Details */}
        <div className="space-y-4">
          {fundData.map((fund, index) => (
            <div
              key={fund.name}
              className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                hoveredFund === index ? 'shadow-lg scale-105' : 'hover:shadow-md'
              }`}
              style={{
                backgroundColor: hoveredFund === index ? fund.color + '08' : 'var(--color-background)',
                borderColor: hoveredFund === index ? fund.color : 'var(--color-border)',
                borderWidth: hoveredFund === index ? '2px' : '1px',
              }}
              onMouseEnter={() => setHoveredFund(index)}
              onMouseLeave={() => setHoveredFund(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: fund.color }}
                  />
                  <div>
                    <p className="font-medium text-sm" style={{ color: 'var(--color-foreground)' }}>
                      {fund.name}
                    </p>
                    <p className="text-xs capitalize" 
                       style={{ color: 'var(--color-muted-foreground)' }}>
                      {fund.category} • {fund.percentage}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-foreground)' }}>
                    {formatCurrency(fund.amount)}
                  </p>
                  <div className="w-16 h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        backgroundColor: fund.color,
                        width: `${animatedPercentages[index] || 0}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Summary Stats */}
          <div className="mt-6 p-4 rounded-xl border bg-gradient-to-r from-opacity-5"
               style={{
                 backgroundColor: 'var(--color-primary)' + '08',
                 borderColor: 'var(--color-primary)' + '20',
               }}>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  Equity Funds
                </p>
                <p className="font-bold text-sm" style={{ color: 'var(--color-foreground)' }}>
                  {fundData.filter(f => f.category === 'equity').reduce((sum, f) => sum + f.percentage, 0)}%
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  Debt Funds
                </p>
                <p className="font-bold text-sm" style={{ color: 'var(--color-foreground)' }}>
                  {fundData.filter(f => f.category === 'debt').reduce((sum, f) => sum + f.percentage, 0)}%
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  Others
                </p>
                <p className="font-bold text-sm" style={{ color: 'var(--color-foreground)' }}>
                  {fundData.filter(f => !['equity', 'debt'].includes(f.category)).reduce((sum, f) => sum + f.percentage, 0)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundDonutChart;