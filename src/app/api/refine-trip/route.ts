import { NextRequest, NextResponse } from 'next/server';
import { runRefineAgent } from '@/lib/agents';
import { Itinerary } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { itinerary, feedback }: { itinerary: Itinerary; feedback: string } = await request.json();

    if (!itinerary || !feedback) {
      return NextResponse.json(
        { success: false, error: 'Missing itinerary or feedback' },
        { status: 400 }
      );
    }

    const refined = await runRefineAgent(itinerary, feedback);

    return NextResponse.json({
      success: true,
      itinerary: refined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
