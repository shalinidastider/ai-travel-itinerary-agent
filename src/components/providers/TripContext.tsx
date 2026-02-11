'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Itinerary, AgentStep } from '@/lib/types';

interface TripContextType {
  itinerary: Itinerary | null;
  setItinerary: (itinerary: Itinerary | null) => void;
  agentSteps: AgentStep[];
  setAgentSteps: (steps: AgentStep[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <TripContext.Provider
      value={{
        itinerary,
        setItinerary,
        agentSteps,
        setAgentSteps,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
}
