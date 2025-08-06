'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SchemeData {
  amc: string;
  amcName: string;
  schemeName: string;
  currentMktValue: number;
  costValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  assetType: string;
  color?: string;
  // Additional fields from external API
  age?: number;
  nav?: number;
  isin?: string;
  folio?: string;
  mobile?: string;
  isDemat?: string;
  navDate?: string;
  rtaName?: string;
  planMode?: string;
  schemeCode?: string;
  schemeType?: string;
  investorName?: string;
  schemeOption?: string;
  availableUnits?: number;
  closingBalance?: number;
  availableAmount?: number;
  lienEligibleUnits?: number;
  transactionSource?: string;
}

export interface PortfolioSummary {
  totalInvestment: number;
  currentValue: number;
  totalGainLoss: number;
  gainLossPercentage: number;
}

interface PortfolioContextType {
  schemes: SchemeData[];
  setSchemes: (schemes: SchemeData[]) => void;
  portfolioSummary: PortfolioSummary | null;
  setPortfolioSummary: (summary: PortfolioSummary | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [schemes, setSchemes] = useState<SchemeData[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <PortfolioContext.Provider value={{ 
      schemes, 
      setSchemes, 
      portfolioSummary, 
      setPortfolioSummary,
      isLoading,
      setIsLoading
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return context;
}; 