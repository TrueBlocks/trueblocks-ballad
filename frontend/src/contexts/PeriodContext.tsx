import { createContext, useContext, useState } from 'react';

import { Period, PeriodType } from '@utils';

interface PeriodContextType {
  activePeriod: PeriodType;
  setActivePeriod: (period: PeriodType) => void;
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined);

export const PeriodProvider = ({ children }: { children: React.ReactNode }) => {
  const [activePeriod, setActivePeriod] = useState<PeriodType>(Period.Blockly);

  return (
    <PeriodContext.Provider value={{ activePeriod, setActivePeriod }}>
      {children}
    </PeriodContext.Provider>
  );
};

export const usePeriod = () => {
  const context = useContext(PeriodContext);
  if (context === undefined) {
    throw new Error('usePeriod must be used within a PeriodProvider');
  }
  return context;
};
