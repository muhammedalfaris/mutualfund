import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { usePortfolio, SchemeData } from '@/context/PortfolioContext';

// interface FundData {
//   name: string;
//   percentage: number;
//   amount: number;
//   color: string;
//   category: 'equity' | 'debt' | 'hybrid' | 'commodity';
//   logo: string;
// }

// Define a type for both real and dummy data
interface FundChartData extends SchemeData {
  color: string;
  logo: string;
  category: string;
  percentage: number;
  amount: number;
}

const FundDonutChart = () => {
  const { } = useTheme();
  const [hoveredFund, setHoveredFund] = useState<number | null>(null);
  const [animatedPercentages, setAnimatedPercentages] = useState<number[]>([]);
  const { schemes } = usePortfolio();

  // Use real data if available, otherwise fallback to dummy
  let fundData: FundChartData[] = [];
  if (schemes.length > 0) {
    // Calculate total market value
    const totalMktValue = schemes.reduce((sum, s) => sum + (s.currentMktValue || 0), 0);
    fundData = schemes.map((scheme, i) => {
      const colorList = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#eab308', '#f472b6', '#6366f1', '#14b8a6', '#f43f5e', '#a3e635', '#f87171', '#facc15', '#38bdf8', '#fbbf24', '#a21caf', '#f59e42', '#0ea5e9', '#f43f5e'
      ];
      return {
        ...scheme,
        color: colorList[i % colorList.length],
        logo: 'https://via.placeholder.com/16x16/3b82f6/ffffff?text=MF',
        category: scheme.assetType?.toLowerCase() || 'other',
        percentage: totalMktValue > 0 ? Math.round((scheme.currentMktValue / totalMktValue) * 100) : 0,
        amount: scheme.currentMktValue,
      };
    });
  } else {
    fundData = [
      { percentage: 35, amount: 4305625, color: '#3b82f6', category: 'equity', logo: 'https://via.placeholder.com/16x16/3b82f6/ffffff?text=LC', amc: '', amcName: '', schemeName: 'Large Cap Equity', currentMktValue: 4305625, costValue: 0, gainLoss: 0, gainLossPercentage: 0, assetType: 'equity' },
      { percentage: 25, amount: 3076146, color: '#10b981', category: 'equity', logo: 'https://via.placeholder.com/16x16/10b981/ffffff?text=MC', amc: '', amcName: '', schemeName: 'Mid Cap Growth', currentMktValue: 3076146, costValue: 0, gainLoss: 0, gainLossPercentage: 0, assetType: 'equity' },
      { percentage: 20, amount: 2460950, color: '#f59e0b', category: 'debt', logo: 'https://via.placeholder.com/16x16/f59e0b/ffffff?text=DF', amc: '', amcName: '', schemeName: 'Debt Funds', currentMktValue: 2460950, costValue: 0, gainLoss: 0, gainLossPercentage: 0, assetType: 'debt' },
      { percentage: 12, amount: 1476570, color: '#ef4444', category: 'equity', logo: 'https://via.placeholder.com/16x16/ef4444/ffffff?text=SC', amc: '', amcName: '', schemeName: 'Small Cap', currentMktValue: 1476570, costValue: 0, gainLoss: 0, gainLossPercentage: 0, assetType: 'equity' },
      { percentage: 5, amount: 615196, color: '#8b5cf6', category: 'commodity', logo: 'https://via.placeholder.com/16x16/8b5cf6/ffffff?text=GE', amc: '', amcName: '', schemeName: 'Gold ETF', currentMktValue: 615196, costValue: 0, gainLoss: 0, gainLossPercentage: 0, assetType: 'commodity' },
      { percentage: 3, amount: 369018, color: '#06b6d4', category: 'hybrid', logo: 'https://via.placeholder.com/16x16/06b6d4/ffffff?text=HB', amc: '', amcName: '', schemeName: 'Hybrid Balanced', currentMktValue: 369018, costValue: 0, gainLoss: 0, gainLossPercentage: 0, assetType: 'hybrid' },
    ];
  }

  const totalAmount = fundData.reduce((sum, fund) => sum + fund.amount, 0);

  // Animation effect for percentages
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentages(fundData.map(fund => fund.percentage));
    }, 100);
    return () => clearTimeout(timer);
  }, [fundData]);

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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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
                    key={fund.schemeName}
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
              key={fund.schemeName}
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
                  <img 
                    src={fund.logo}
                    alt={`${fund.schemeName} logo`}
                    className="w-5 h-5 rounded-full shadow-sm"
                  />
                  <div>
                    <p className="font-medium text-sm" style={{ color: 'var(--color-foreground)' }}>
                      {fund.schemeName}
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