'use client';

import React from 'react';
import { Box, Typography, Container, Button, Stack, Fade } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TripForm from '@/components/features/trip/TripForm';
import AgentStepper from '@/components/features/trip/AgentStepper';
import ItineraryView from '@/components/features/itinerary/ItineraryView';
import ExportPanel from '@/components/features/export/ExportPanel';
import { useTripContext } from '@/components/providers/TripContext';
import { TripFormData } from '@/lib/types';

export default function HomePage() {
  const {
    itinerary,
    setItinerary,
    agentSteps,
    setAgentSteps,
    isLoading,
    setIsLoading,
    error,
    setError,
  } = useTripContext();

  const [isRefining, setIsRefining] = React.useState(false);

  const handlePlanTrip = async (formData: TripFormData) => {
    setIsLoading(true);
    setError(null);
    setAgentSteps([]);

    try {
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setItinerary(data.itinerary);
        setAgentSteps(data.agentSteps || []);
      } else {
        setError(data.error || 'Failed to generate itinerary');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineTrip = async (feedback: string) => {
    if (!itinerary) return;
    setIsRefining(true);

    try {
      const response = await fetch('/api/refine-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary, feedback }),
      });

      const data = await response.json();
      if (data.success) {
        setItinerary(data.itinerary);
      } else {
        setError(data.error || 'Failed to refine itinerary');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsRefining(false);
    }
  };

  const handleRegenerateDay = async (dayIndex: number) => {
    if (!itinerary) return;
    setIsRefining(true);

    try {
      const response = await fetch('/api/regenerate-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary, dayIndex, constraints: '' }),
      });

      const data = await response.json();
      if (data.success) {
        setItinerary(data.itinerary);
      } else {
        setError(data.error || 'Failed to regenerate day');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsRefining(false);
    }
  };

  const handleBackToForm = () => {
    setItinerary(null);
    setAgentSteps([]);
    setError(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 20% 0%, rgba(108,99,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(255,107,157,0.06) 0%, transparent 50%), #0A0E1A',
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          {!itinerary ? (
            <>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  background: 'linear-gradient(135deg, #6C63FF 0%, #FF6B9D 50%, #00E5A0 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1.5,
                }}
              >
                AI Travel Agent
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: 'text.secondary', fontWeight: 400, fontSize: { xs: '1rem', md: '1.2rem' }, maxWidth: 600, mx: 'auto' }}
              >
                Turn your preferences into a day-by-day itinerary with costs and must-do experiences
              </Typography>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToForm}
                sx={{ color: 'text.secondary' }}
              >
                New Trip
              </Button>
              <Typography variant="h4" sx={{ fontSize: { xs: '1.3rem', md: '1.6rem' } }}>
                Your Itinerary
              </Typography>
            </Box>
          )}
        </Box>

        {/* Error */}
        {error && (
          <Fade in>
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                background: 'rgba(255,82,82,0.1)',
                border: '1px solid rgba(255,82,82,0.3)',
              }}
            >
              <Typography color="error">{error}</Typography>
            </Box>
          </Fade>
        )}

        {/* Main Content */}
        {!itinerary ? (
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <TripForm onSubmit={handlePlanTrip} isLoading={isLoading} />
            </Box>
            {(isLoading || agentSteps.length > 0) && (
              <Fade in>
                <Box sx={{ width: { xs: '100%', lg: 300 }, flexShrink: 0 }}>
                  <AgentStepper steps={agentSteps} isLoading={isLoading} />
                </Box>
              </Fade>
            )}
          </Box>
        ) : (
          <Stack spacing={3}>
            <ItineraryView
              itinerary={itinerary}
              agentSteps={agentSteps}
              onRegenerateDay={handleRegenerateDay}
              onRefineTrip={handleRefineTrip}
              isRefining={isRefining}
            />
            <ExportPanel itinerary={itinerary} />
          </Stack>
        )}
      </Container>
    </Box>
  );
}
