'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Stack,
  Paper,
  IconButton,
  TextField,
  Drawer,
  Badge,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import TuneIcon from '@mui/icons-material/Tune';
import SendIcon from '@mui/icons-material/Send';
import TimelineIcon from '@mui/icons-material/Timeline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ActivityCard from './ActivityCard';
import AgentStepper from '@/components/features/trip/AgentStepper';
import { Itinerary, AgentStep } from '@/lib/types';

interface ItineraryViewProps {
  itinerary: Itinerary;
  agentSteps: AgentStep[];
  onRegenerateDay: (dayIndex: number) => void;
  onRefineTrip: (feedback: string) => void;
  isRefining: boolean;
}

export default function ItineraryView({
  itinerary,
  agentSteps,
  onRegenerateDay,
  onRefineTrip,
  isRefining,
}: ItineraryViewProps) {
  const [expandedDay, setExpandedDay] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [showAgentLog, setShowAgentLog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleRefine = () => {
    if (feedback.trim()) {
      onRefineTrip(feedback);
      setFeedback('');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <Box>
      {/* Summary Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 3,
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(108,99,255,0.12) 0%, rgba(255,107,157,0.08) 50%, rgba(0,229,160,0.06) 100%)',
          border: '1px solid rgba(108,99,255,0.15)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'radial-gradient(ellipse at top right, rgba(108,99,255,0.08) 0%, transparent 70%)',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" sx={{ mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
            {itinerary.tripProfile.destinations.join(' → ')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, maxWidth: 600 }}>
            {itinerary.summary}
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
            <Chip
              icon={<CalendarMonthIcon />}
              label={`${itinerary.days.length} days`}
              variant="outlined"
              sx={{ borderColor: 'rgba(108,99,255,0.3)', color: 'primary.light' }}
            />
            <Chip
              icon={<AttachMoneyIcon />}
              label={`~$${itinerary.totalEstimatedCost.toLocaleString()} total`}
              variant="outlined"
              sx={{ borderColor: 'rgba(0,229,160,0.3)', color: 'success.light' }}
            />
            {itinerary.tripProfile.interests.map((interest) => (
              <Chip
                key={interest}
                label={interest}
                size="small"
                sx={{
                  background: 'rgba(255,181,71,0.12)',
                  color: 'warning.light',
                  textTransform: 'capitalize',
                }}
              />
            ))}
          </Stack>

          {/* Agent Log Toggle + Refine Controls */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
            <Button
              startIcon={<TimelineIcon />}
              variant="outlined"
              size="small"
              onClick={() => setShowAgentLog(true)}
              sx={{
                borderColor: 'rgba(159, 168, 218, 0.2)',
                color: 'text.secondary',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              Agent Log
            </Button>
            <Box sx={{ display: 'flex', flex: 1, gap: 1, maxWidth: 500 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Refine: &quot;more food, less museums&quot;, &quot;reduce budget&quot;..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                disabled={isRefining}
                sx={{ flex: 1 }}
              />
              <IconButton
                onClick={handleRefine}
                disabled={!feedback.trim() || isRefining}
                sx={{
                  background: 'linear-gradient(135deg, #6C63FF, #FF6B9D)',
                  color: '#fff',
                  '&:hover': { opacity: 0.9 },
                  '&.Mui-disabled': { opacity: 0.3 },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Stack>
        </Box>
      </Paper>

      {/* Day Accordions */}
      {itinerary.days.map((day) => (
        <Accordion
          key={day.dayIndex}
          expanded={expandedDay === day.dayIndex}
          onChange={(_, expanded) => setExpandedDay(expanded ? day.dayIndex : -1)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '& .MuiAccordionSummary-content': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mr: 2,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(255,107,157,0.15))',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'primary.light',
                }}
              >
                D{day.dayIndex + 1}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                  Day {day.dayIndex + 1}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatDate(day.date)}
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                label={`$${day.dailyBudget}`}
                sx={{ background: 'rgba(0,229,160,0.1)', color: 'success.light', fontWeight: 600 }}
              />
              <Badge
                badgeContent={
                  day.morningActivities.length + day.afternoonActivities.length + day.eveningActivities.length
                }
                color="primary"
                sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}
              >
                <TuneIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </Badge>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                startIcon={<RefreshIcon />}
                size="small"
                onClick={() => onRegenerateDay(day.dayIndex)}
                sx={{
                  color: 'text.secondary',
                  borderColor: 'rgba(159, 168, 218, 0.15)',
                  '&:hover': { borderColor: 'primary.main', color: 'primary.light' },
                }}
                variant="outlined"
              >
                Regenerate Day
              </Button>
            </Box>

            {/* Morning */}
            {day.morningActivities.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <WbSunnyIcon sx={{ color: '#FFB547', fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FFB547' }}>
                    Morning
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  {day.morningActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Afternoon */}
            {day.afternoonActivities.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <WbTwilightIcon sx={{ color: '#FF6B9D', fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FF6B9D' }}>
                    Afternoon
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  {day.afternoonActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Evening */}
            {day.eveningActivities.length > 0 && (
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <NightsStayIcon sx={{ color: '#B388FF', fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#B388FF' }}>
                    Evening
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  {day.eveningActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </Stack>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Agent Log Drawer */}
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={showAgentLog}
        onClose={() => setShowAgentLog(false)}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : 360,
            maxHeight: isMobile ? '70vh' : '100%',
            background: '#121829',
            borderRadius: isMobile ? '20px 20px 0 0' : 0,
            p: 3,
          },
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>Agent Pipeline Log</Typography>
        <AgentStepper steps={agentSteps} isLoading={false} />
        {agentSteps.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Generated at: {new Date(itinerary.generatedAt).toLocaleString()}
            </Typography>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
