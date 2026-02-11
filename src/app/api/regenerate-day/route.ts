import { NextRequest, NextResponse } from 'next/server';
import { runRegenerateDayAgent } from '@/lib/agents';
import { Itinerary } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const {
      itinerary,
      dayIndex,
      constraints,
    }: { itinerary: Itinerary; dayIndex: number; constraints: string } = await request.json();

    if (!itinerary || dayIndex === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing itinerary or dayIndex' },
        { status: 400 }
      );
    }

    if (dayIndex < 0 || dayIndex >= itinerary.days.length) {
      return NextResponse.json(
        { success: false, error: 'Invalid dayIndex' },
        { status: 400 }
      );
    }

    const newDay = await runRegenerateDayAgent(itinerary, dayIndex, constraints || '');

    const updatedDays = [...itinerary.days];
    updatedDays[dayIndex] = newDay;

    const updatedItinerary: Itinerary = {
      ...itinerary,
      days: updatedDays,
      totalEstimatedCost: updatedDays.reduce((sum, day) => sum + day.dailyBudget, 0),
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      itinerary: updatedItinerary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
