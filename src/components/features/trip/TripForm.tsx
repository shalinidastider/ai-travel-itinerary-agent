'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Slider,
  ToggleButtonGroup,
  ToggleButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Paper,
  InputAdornment,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ParkIcon from '@mui/icons-material/Park';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import MuseumIcon from '@mui/icons-material/Museum';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { TripFormData } from '@/lib/types';

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  isLoading: boolean;
}

const INTEREST_OPTIONS = [
  { label: 'Foodie', value: 'foodie', icon: <RestaurantIcon sx={{ fontSize: 18 }} /> },
  { label: 'Nature', value: 'nature', icon: <ParkIcon sx={{ fontSize: 18 }} /> },
  { label: 'Nightlife', value: 'nightlife', icon: <NightlifeIcon sx={{ fontSize: 18 }} /> },
  { label: 'Family', value: 'family', icon: <FamilyRestroomIcon sx={{ fontSize: 18 }} /> },
  { label: 'Culture', value: 'culture', icon: <MuseumIcon sx={{ fontSize: 18 }} /> },
];

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher', 'None'];

export default function TripForm({ onSubmit, isLoading }: TripFormProps) {
  const [formData, setFormData] = useState<TripFormData>({
    origin: '',
    destinations: '',
    startDate: '',
    endDate: '',
    budgetMin: 500,
    budgetMax: 3000,
    pace: 'balanced',
    interests: [],
    dietary: [],
    walkingTolerance: 'medium',
    mustSeeItems: '',
    additionalNotes: '',
    freeformPrompt: '',
  });

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleDietaryToggle = (diet: string) => {
    setFormData((prev) => ({
      ...prev,
      dietary: prev.dietary.includes(diet)
        ? prev.dietary.filter((d) => d !== diet)
        : [...prev.dietary, diet],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        background: 'linear-gradient(145deg, rgba(18,24,41,0.95) 0%, rgba(10,14,26,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(159, 168, 218, 0.08)',
      }}
    >
      {/* Free-form prompt */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: 'primary.main' }} />
          Describe your dream trip
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="e.g., I want a 5-day trip to Japan focusing on food and culture, moderate budget, relaxed pace..."
          value={formData.freeformPrompt}
          onChange={(e) => setFormData({ ...formData, freeformPrompt: e.target.value })}
          sx={{ mb: 1 }}
        />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Or fill in the fields below for a more guided experience
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Origin & Destination */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="From (Origin City)"
            placeholder="e.g., San Francisco"
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FlightTakeoffIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Destination(s)"
            placeholder="e.g., Tokyo, Kyoto"
            value={formData.destinations}
            onChange={(e) => setFormData({ ...formData, destinations: e.target.value })}
            required={!formData.freeformPrompt}
          />
        </Grid>

        {/* Dates */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        {/* Budget */}
        <Grid size={12}>
          <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AttachMoneyIcon sx={{ fontSize: 18, color: 'success.main' }} />
            Budget Range: ${formData.budgetMin.toLocaleString()} – ${formData.budgetMax.toLocaleString()}
          </Typography>
          <Slider
            value={[formData.budgetMin, formData.budgetMax]}
            onChange={(_, value) => {
              const [min, max] = value as number[];
              setFormData({ ...formData, budgetMin: min, budgetMax: max });
            }}
            min={100}
            max={10000}
            step={100}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `$${v.toLocaleString()}`}
            sx={{
              '& .MuiSlider-track': {
                background: 'linear-gradient(90deg, #6C63FF, #FF6B9D)',
              },
              '& .MuiSlider-thumb': {
                background: '#fff',
                border: '2px solid #6C63FF',
              },
            }}
          />
        </Grid>

        {/* Travel Style */}
        <Grid size={12}>
          <Typography variant="body2" sx={{ mb: 1.5 }}>Travel Style</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {INTEREST_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                icon={option.icon}
                onClick={() => handleInterestToggle(option.value)}
                variant={formData.interests.includes(option.value) ? 'filled' : 'outlined'}
                sx={{
                  transition: 'all 0.2s ease',
                  ...(formData.interests.includes(option.value)
                    ? {
                        background: 'linear-gradient(135deg, rgba(108,99,255,0.3) 0%, rgba(255,107,157,0.2) 100%)',
                        borderColor: 'primary.main',
                        color: 'primary.light',
                      }
                    : {
                        borderColor: 'rgba(159, 168, 218, 0.2)',
                        '&:hover': {
                          borderColor: 'primary.main',
                          background: 'rgba(108,99,255,0.08)',
                        },
                      }),
                }}
              />
            ))}
          </Box>
        </Grid>

        {/* Pace */}
        <Grid size={12}>
          <Typography variant="body2" sx={{ mb: 1.5 }}>Pace</Typography>
          <ToggleButtonGroup
            value={formData.pace}
            exclusive
            onChange={(_, value) => value && setFormData({ ...formData, pace: value })}
            sx={{
              '& .MuiToggleButton-root': {
                px: 3,
                py: 1,
                borderRadius: '8px !important',
                border: '1px solid rgba(159, 168, 218, 0.15) !important',
                mx: 0.5,
                textTransform: 'none',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(108,99,255,0.2) 0%, rgba(255,107,157,0.15) 100%)',
                  borderColor: 'rgba(108,99,255,0.4) !important',
                  color: 'primary.light',
                },
              },
            }}
          >
            <ToggleButton value="chill">🧘 Chill</ToggleButton>
            <ToggleButton value="balanced">⚖️ Balanced</ToggleButton>
            <ToggleButton value="packed">🚀 Packed</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>

      {/* Advanced Preferences */}
      <Accordion
        sx={{
          mt: 3,
          background: 'transparent',
          border: '1px solid rgba(159, 168, 218, 0.08)',
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Advanced Preferences
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="body2" sx={{ mb: 1 }}>Dietary Restrictions</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {DIETARY_OPTIONS.map((diet) => (
                  <Chip
                    key={diet}
                    label={diet}
                    size="small"
                    onClick={() => handleDietaryToggle(diet)}
                    variant={formData.dietary.includes(diet) ? 'filled' : 'outlined'}
                    sx={{
                      fontSize: '0.8rem',
                      ...(formData.dietary.includes(diet)
                        ? { background: 'rgba(0, 229, 160, 0.15)', borderColor: 'success.main', color: 'success.light' }
                        : { borderColor: 'rgba(159, 168, 218, 0.15)' }),
                    }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid size={12}>
              <Typography variant="body2" sx={{ mb: 1 }}>Walking Tolerance</Typography>
              <ToggleButtonGroup
                value={formData.walkingTolerance}
                exclusive
                size="small"
                onChange={(_, value) => value && setFormData({ ...formData, walkingTolerance: value })}
                sx={{
                  '& .MuiToggleButton-root': {
                    px: 2,
                    py: 0.5,
                    border: '1px solid rgba(159, 168, 218, 0.15) !important',
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    '&.Mui-selected': {
                      background: 'rgba(108,99,255,0.15)',
                      color: 'primary.light',
                    },
                  },
                }}
              >
                <ToggleButton value="low">Low</ToggleButton>
                <ToggleButton value="medium">Medium</ToggleButton>
                <ToggleButton value="high">High</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Must-See Items"
                placeholder="e.g., Eiffel Tower, local food markets"
                value={formData.mustSeeItems}
                onChange={(e) => setFormData({ ...formData, mustSeeItems: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                placeholder="e.g., traveling with kids, prefer public transit"
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                multiline
                rows={2}
                size="small"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Submit */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{
            px: 6,
            py: 1.5,
            fontSize: '1.1rem',
            minWidth: 240,
          }}
        >
          {isLoading ? 'Planning your trip...' : '✨ Plan My Trip'}
        </Button>
      </Box>
    </Paper>
  );
}
