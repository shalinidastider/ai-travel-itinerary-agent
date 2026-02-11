'use client';

import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { AgentStep } from '@/lib/types';

interface AgentStepperProps {
  steps: AgentStep[];
  isLoading: boolean;
}

const AGENT_ORDER = ['Preference Agent', 'Research Agent', 'Itinerary Agent', 'Refine Agent'] as const;

function getStepIcon(status: AgentStep['status']) {
  switch (status) {
    case 'completed':
      return <CheckCircleIcon sx={{ color: 'success.main', fontSize: 28 }} />;
    case 'running':
      return <CircularProgress size={24} sx={{ color: 'primary.main' }} />;
    case 'error':
      return <ErrorIcon sx={{ color: 'error.main', fontSize: 28 }} />;
    default:
      return <RadioButtonUncheckedIcon sx={{ color: 'text.secondary', fontSize: 28 }} />;
  }
}

export default function AgentStepper({ steps, isLoading }: AgentStepperProps) {
  const stepMap = new Map(steps.map((s) => [s.agentName, s]));

  const activeStep = AGENT_ORDER.findIndex((name) => {
    const step = stepMap.get(name);
    return step?.status === 'running';
  });

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(108,99,255,0.05) 0%, rgba(255,107,157,0.05) 100%)',
        border: '1px solid rgba(159, 168, 218, 0.08)',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary' }}>
        Agent Pipeline
      </Typography>
      <Stepper
        activeStep={activeStep >= 0 ? activeStep : (isLoading ? 0 : -1)}
        orientation="vertical"
        sx={{
          '& .MuiStepConnector-line': {
            borderColor: 'rgba(159, 168, 218, 0.15)',
            minHeight: 20,
          },
        }}
      >
        {AGENT_ORDER.slice(0, 3).map((agentName) => {
          const step = stepMap.get(agentName);
          return (
            <Step key={agentName} completed={step?.status === 'completed'}>
              <StepLabel
                icon={step ? getStepIcon(step.status) : getStepIcon('pending')}
                sx={{
                  '& .MuiStepLabel-label': {
                    color: step?.status === 'completed' ? 'success.main' : step?.status === 'running' ? 'primary.main' : 'text.secondary',
                    fontWeight: step?.status === 'running' ? 600 : 400,
                    fontSize: '0.9rem',
                  },
                }}
              >
                {agentName}
              </StepLabel>
              <StepContent>
                {step && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                    {step.message}
                  </Typography>
                )}
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
