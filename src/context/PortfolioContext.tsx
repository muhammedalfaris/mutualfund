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
}

interface PortfolioContextType {
  schemes: SchemeData[];
  setSchemes: (schemes: SchemeData[]) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [schemes, setSchemes] = useState<SchemeData[]>([]);
  return (
    <PortfolioContext.Provider value={{ schemes, setSchemes }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return context;
}; 