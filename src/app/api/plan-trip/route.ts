import { NextRequest, NextResponse } from 'next/server';
import { runFullPipeline } from '@/lib/agents';
import { TripFormData, AgentStep } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const formData: TripFormData = await request.json();

    const agentSteps: AgentStep[] = [];

    const itinerary = await runFullPipeline(formData, (step) => {
      agentSteps.push(step);
    });

    return NextResponse.json({
      success: true,
      itinerary,
      agentSteps,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        error: message,
        agentSteps: [],
      },
      { status: 500 }
    );
  }
}
