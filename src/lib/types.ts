// Core data models for the AI Travel Itinerary Agent

export interface TripProfile {
  origin: string;
  destinations: string[];
  startDate: string;
  endDate: string;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  pace: "chill" | "balanced" | "packed";
  interests: string[];
  constraints: {
    dietary: string[];
    walkingTolerance: "low" | "medium" | "high";
    mustSeeItems: string[];
    additionalNotes: string;
  };
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  category:
    | "sight"
    | "food"
    | "activity"
    | "nightlife"
    | "nature"
    | "culture"
    | "shopping"
    | "rest";
  neighborhood: string;
  duration: number; // in minutes
  costEstimate: number;
  tags: string[];
  timeOfDay: "morning" | "afternoon" | "evening";
}

export interface DayPlan {
  dayIndex: number;
  date: string;
  morningActivities: Activity[];
  afternoonActivities: Activity[];
  eveningActivities: Activity[];
  dailyBudget: number;
}

export interface Itinerary {
  id: string;
  tripProfile: TripProfile;
  days: DayPlan[];
  totalEstimatedCost: number;
  generatedAt: string;
  summary: string;
}

export interface AgentStep {
  agentName:
    | "Preference Agent"
    | "Research Agent"
    | "Itinerary Agent"
    | "Refine Agent";
  status: "pending" | "running" | "completed" | "error";
  message: string;
  timestamp: string;
}

export interface TripFormData {
  origin: string;
  destinations: string;
  startDate: string;
  endDate: string;
  budgetMin: number;
  budgetMax: number;
  pace: "chill" | "balanced" | "packed";
  interests: string[];
  dietary: string[];
  walkingTolerance: "low" | "medium" | "high";
  mustSeeItems: string;
  additionalNotes: string;
  freeformPrompt: string;
}
