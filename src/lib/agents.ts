// Agent orchestration using Google Gemini API

import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  PREFERENCE_AGENT_PROMPT,
  RESEARCH_AGENT_PROMPT,
  ITINERARY_AGENT_PROMPT,
  REFINE_AGENT_PROMPT,
  REGENERATE_DAY_PROMPT,
} from './prompts';
import { TripProfile, Activity, Itinerary, DayPlan, AgentStep, TripFormData } from './types';
import { MOCK_ITINERARY } from './mock-data';
import { v4 as uuidv4 } from 'uuid';

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

async function callGemini(prompt: string): Promise<string> {
  const genAI = getGenAI();
  if (!genAI) {
    throw new Error('NO_API_KEY');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

function parseJSON<T>(text: string): T {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  return JSON.parse(cleaned) as T;
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

// ─── Preference Agent ────────────────────────────────────────────────

export async function runPreferenceAgent(formData: TripFormData): Promise<TripProfile> {
  const structuredFields = JSON.stringify({
    origin: formData.origin,
    destinations: formData.destinations,
    startDate: formData.startDate,
    endDate: formData.endDate,
    budgetMin: formData.budgetMin,
    budgetMax: formData.budgetMax,
    pace: formData.pace,
    interests: formData.interests,
    dietary: formData.dietary,
    walkingTolerance: formData.walkingTolerance,
    mustSeeItems: formData.mustSeeItems,
    additionalNotes: formData.additionalNotes,
  }, null, 2);

  const prompt = fillTemplate(PREFERENCE_AGENT_PROMPT, {
    userInput: formData.freeformPrompt || 'No additional free-form input provided.',
    structuredFields,
  });

  const response = await callGemini(prompt);
  return parseJSON<TripProfile>(response);
}

// ─── Research Agent ──────────────────────────────────────────────────

export async function runResearchAgent(profile: TripProfile): Promise<Activity[]> {
  const startDate = new Date(profile.startDate);
  const endDate = new Date(profile.endDate);
  const numDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

  const prompt = fillTemplate(RESEARCH_AGENT_PROMPT, {
    tripProfile: JSON.stringify(profile, null, 2),
    numDays: String(numDays),
    interests: profile.interests.join(', '),
    budgetMin: String(profile.budgetMin),
    budgetMax: String(profile.budgetMax),
    currency: profile.currency,
    pace: profile.pace,
    dietary: profile.constraints.dietary.join(', ') || 'none',
    mustSeeItems: profile.constraints.mustSeeItems.join(', ') || 'none specified',
  });

  const response = await callGemini(prompt);
  return parseJSON<Activity[]>(response);
}

// ─── Itinerary Agent ─────────────────────────────────────────────────

export async function runItineraryAgent(
  profile: TripProfile,
  activities: Activity[]
): Promise<Itinerary> {
  const startDate = new Date(profile.startDate);
  const endDate = new Date(profile.endDate);
  const numDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

  const prompt = fillTemplate(ITINERARY_AGENT_PROMPT, {
    tripProfile: JSON.stringify(profile, null, 2),
    activities: JSON.stringify(activities, null, 2),
    pace: profile.pace,
    budgetMin: String(profile.budgetMin),
    budgetMax: String(profile.budgetMax),
    currency: profile.currency,
    numDays: String(numDays),
  });

  const response = await callGemini(prompt);
  const parsed = parseJSON<{ days: DayPlan[]; totalEstimatedCost: number; summary: string }>(response);

  return {
    id: uuidv4(),
    tripProfile: profile,
    days: parsed.days,
    totalEstimatedCost: parsed.totalEstimatedCost,
    summary: parsed.summary,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Full Pipeline ───────────────────────────────────────────────────

export async function runFullPipeline(
  formData: TripFormData,
  onStepUpdate: (step: AgentStep) => void
): Promise<Itinerary> {
  try {
    // Step 1: Preference Agent
    onStepUpdate({
      agentName: 'Preference Agent',
      status: 'running',
      message: 'Analyzing your travel preferences...',
      timestamp: new Date().toISOString(),
    });

    let profile: TripProfile;
    try {
      profile = await runPreferenceAgent(formData);
    } catch (e) {
      if (e instanceof Error && e.message === 'NO_API_KEY') {
        // Fallback to mock data
        onStepUpdate({
          agentName: 'Preference Agent',
          status: 'completed',
          message: 'Using demo mode (no API key set)',
          timestamp: new Date().toISOString(),
        });
        return MOCK_ITINERARY;
      }
      throw e;
    }

    onStepUpdate({
      agentName: 'Preference Agent',
      status: 'completed',
      message: `Trip profile created for ${profile.destinations.join(', ')}`,
      timestamp: new Date().toISOString(),
    });

    // Step 2: Research Agent
    onStepUpdate({
      agentName: 'Research Agent',
      status: 'running',
      message: `Researching activities in ${profile.destinations.join(', ')}...`,
      timestamp: new Date().toISOString(),
    });

    const activities = await runResearchAgent(profile);

    onStepUpdate({
      agentName: 'Research Agent',
      status: 'completed',
      message: `Found ${activities.length} activities across categories`,
      timestamp: new Date().toISOString(),
    });

    // Step 3: Itinerary Agent
    onStepUpdate({
      agentName: 'Itinerary Agent',
      status: 'running',
      message: 'Building your day-by-day itinerary...',
      timestamp: new Date().toISOString(),
    });

    const itinerary = await runItineraryAgent(profile, activities);

    onStepUpdate({
      agentName: 'Itinerary Agent',
      status: 'completed',
      message: `Created ${itinerary.days.length}-day itinerary`,
      timestamp: new Date().toISOString(),
    });

    return itinerary;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    onStepUpdate({
      agentName: 'Itinerary Agent',
      status: 'error',
      message: `Error: ${message}`,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

// ─── Refine Agent ────────────────────────────────────────────────────

export async function runRefineAgent(
  itinerary: Itinerary,
  feedback: string
): Promise<Itinerary> {
  const genAI = getGenAI();
  if (!genAI) {
    // In demo mode, just return the same itinerary
    return { ...itinerary, generatedAt: new Date().toISOString() };
  }

  const prompt = fillTemplate(REFINE_AGENT_PROMPT, {
    itinerary: JSON.stringify(itinerary, null, 2),
    feedback,
  });

  const response = await callGemini(prompt);
  const parsed = parseJSON<{ days: DayPlan[]; totalEstimatedCost: number; summary: string }>(response);

  return {
    ...itinerary,
    days: parsed.days,
    totalEstimatedCost: parsed.totalEstimatedCost,
    summary: parsed.summary,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Regenerate Day Agent ────────────────────────────────────────────

export async function runRegenerateDayAgent(
  itinerary: Itinerary,
  dayIndex: number,
  constraints: string
): Promise<DayPlan> {
  const genAI = getGenAI();
  if (!genAI) {
    // In demo mode, return the same day
    return itinerary.days[dayIndex];
  }

  const currentDay = itinerary.days[dayIndex];
  const otherDays = itinerary.days.filter((_, i) => i !== dayIndex);

  const prompt = fillTemplate(REGENERATE_DAY_PROMPT, {
    tripProfile: JSON.stringify(itinerary.tripProfile, null, 2),
    dayIndex: String(dayIndex),
    currentDay: JSON.stringify(currentDay, null, 2),
    otherDays: JSON.stringify(otherDays, null, 2),
    constraints: constraints || 'No additional constraints',
    date: currentDay.date,
  });

  const response = await callGemini(prompt);
  return parseJSON<DayPlan>(response);
}
