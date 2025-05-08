import React, { createContext, useContext, useState } from 'react';

interface TestContextType {
  value: string;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  const [value, setValue] = useState('test');

  return (
    <TestContext.Provider value={{ value }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within TestProvider');
  }
  return context;
};
