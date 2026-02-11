// Prompt templates for each agent in the pipeline

export const PREFERENCE_AGENT_PROMPT = `You are a travel preference analysis agent. Your job is to take raw user input about a trip and produce a structured trip profile.

Given the following user input, extract and normalize the trip details into a JSON object.

User Input:
{userInput}

Structured Fields (if provided):
{structuredFields}

Return ONLY a valid JSON object with this exact structure (no markdown, no code fences):
{
  "origin": "city name or empty string",
  "destinations": ["city1", "city2"],
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "budgetMin": number,
  "budgetMax": number,
  "currency": "USD",
  "pace": "chill" | "balanced" | "packed",
  "interests": ["interest1", "interest2"],
  "constraints": {
    "dietary": ["restriction1"],
    "walkingTolerance": "low" | "medium" | "high",
    "mustSeeItems": ["item1"],
    "additionalNotes": "any other notes"
  }
}

Infer reasonable defaults for any missing fields. If dates are not specified, assume a trip starting 2 weeks from now lasting 5 days.`;

export const RESEARCH_AGENT_PROMPT = `You are a travel research agent. Given a trip profile, suggest activities for each day of the trip.

Trip Profile:
{tripProfile}

Number of days: {numDays}

For each day, suggest 5-7 activities that:
- Align with the traveler's interests: {interests}
- Respect the budget range: {budgetMin}-{budgetMax} {currency}
- Match the pace preference: {pace}
- Consider dietary restrictions: {dietary}
- Include any must-see items: {mustSeeItems}

Return ONLY a valid JSON array (no markdown, no code fences) of activity objects:
[
  {
    "id": "unique-id-string",
    "name": "Activity Name",
    "description": "Brief 1-2 sentence description",
    "category": "sight" | "food" | "activity" | "nightlife" | "nature" | "culture" | "shopping" | "rest",
    "neighborhood": "Area/District Name",
    "duration": number (in minutes),
    "costEstimate": number (in {currency}),
    "tags": ["tag1", "tag2"],
    "timeOfDay": "morning" | "afternoon" | "evening"
  }
]

Ensure variety: mix categories, neighborhoods, and price ranges. Include local hidden gems alongside popular attractions.`;

export const ITINERARY_AGENT_PROMPT = `You are an itinerary planning agent. Given a trip profile and a list of candidate activities, organize them into a detailed day-by-day itinerary.

Trip Profile:
{tripProfile}

Available Activities:
{activities}

Rules:
1. Organize activities into morning (2-3), afternoon (2-3), and evening (1-2) blocks per day.
2. Respect the "{pace}" pace — chill means fewer activities with more rest, packed means maximize experiences.
3. Keep daily spending within the overall budget range ({budgetMin}-{budgetMax} {currency} total for {numDays} days).
4. Ensure variety — don't put 3 of the same category in a row.
5. Group activities by neighborhood to minimize travel time.
6. Include rest/meal breaks between activities.
7. Place food activities at appropriate meal times.

Return ONLY a valid JSON object (no markdown, no code fences):
{
  "days": [
    {
      "dayIndex": 0,
      "date": "YYYY-MM-DD",
      "morningActivities": [activity objects],
      "afternoonActivities": [activity objects],
      "eveningActivities": [activity objects],
      "dailyBudget": number
    }
  ],
  "totalEstimatedCost": number,
  "summary": "Brief 2-3 sentence trip summary highlighting themes and highlights"
}`;

export const REFINE_AGENT_PROMPT = `You are a travel itinerary refinement agent. Given an existing itinerary and user feedback, modify the itinerary to address the feedback.

Current Itinerary:
{itinerary}

User Feedback:
{feedback}

Rules:
1. Make targeted changes — don't recreate the entire plan from scratch.
2. Preserve activities the user likely enjoys (those not mentioned in feedback).
3. If asked to change intensity/pace, add or remove activities accordingly.
4. If asked to adjust budget, swap activities for cheaper/premium alternatives.
5. If asked to change themes ("more food", "less museums"), swap relevant activities.
6. Keep the same date structure and overall organization.

Return ONLY the complete modified itinerary as a valid JSON object (no markdown, no code fences) with the same structure as the input, including ALL days (even unchanged ones).`;

export const REGENERATE_DAY_PROMPT = `You are a travel day-planning agent. Regenerate a single day of an itinerary based on new constraints.

Full Trip Profile:
{tripProfile}

Day to regenerate (dayIndex {dayIndex}):
{currentDay}

Other days in the trip (for context, avoid duplicating activities):
{otherDays}

Additional constraints or preferences:
{constraints}

Generate a fresh day plan with new activities that:
1. Fit the traveler's overall interests and budget.
2. Don't duplicate activities from other days.
3. Include morning (2-3), afternoon (2-3), and evening (1-2) blocks.
4. Address any additional constraints provided.

Return ONLY a valid JSON object (no markdown, no code fences):
{
  "dayIndex": {dayIndex},
  "date": "{date}",
  "morningActivities": [activity objects],
  "afternoonActivities": [activity objects],
  "eveningActivities": [activity objects],
  "dailyBudget": number
}`;
