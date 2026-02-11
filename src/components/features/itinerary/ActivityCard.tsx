'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import ParkIcon from '@mui/icons-material/Park';
import MuseumIcon from '@mui/icons-material/Museum';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HotelIcon from '@mui/icons-material/Hotel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PlaceIcon from '@mui/icons-material/Place';
import { Activity } from '@/lib/types';

const CATEGORY_CONFIG: Record<Activity['category'], { icon: React.ReactNode; color: string; gradient: string }> = {
  food: {
    icon: <RestaurantIcon />,
    color: '#FF6B9D',
    gradient: 'linear-gradient(135deg, rgba(255,107,157,0.15) 0%, rgba(255,107,157,0.05) 100%)',
  },
  sight: {
    icon: <PhotoCameraIcon />,
    color: '#6C63FF',
    gradient: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(108,99,255,0.05) 100%)',
  },
  activity: {
    icon: <DirectionsWalkIcon />,
    color: '#00E5A0',
    gradient: 'linear-gradient(135deg, rgba(0,229,160,0.15) 0%, rgba(0,229,160,0.05) 100%)',
  },
  nightlife: {
    icon: <NightlifeIcon />,
    color: '#B388FF',
    gradient: 'linear-gradient(135deg, rgba(179,136,255,0.15) 0%, rgba(179,136,255,0.05) 100%)',
  },
  nature: {
    icon: <ParkIcon />,
    color: '#69F0AE',
    gradient: 'linear-gradient(135deg, rgba(105,240,174,0.15) 0%, rgba(105,240,174,0.05) 100%)',
  },
  culture: {
    icon: <MuseumIcon />,
    color: '#FFB547',
    gradient: 'linear-gradient(135deg, rgba(255,181,71,0.15) 0%, rgba(255,181,71,0.05) 100%)',
  },
  shopping: {
    icon: <ShoppingBagIcon />,
    color: '#FF80AB',
    gradient: 'linear-gradient(135deg, rgba(255,128,171,0.15) 0%, rgba(255,128,171,0.05) 100%)',
  },
  rest: {
    icon: <HotelIcon />,
    color: '#80DEEA',
    gradient: 'linear-gradient(135deg, rgba(128,222,234,0.15) 0%, rgba(128,222,234,0.05) 100%)',
  },
};

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const config = CATEGORY_CONFIG[activity.category] || CATEGORY_CONFIG.activity;

  return (
    <Card
      sx={{
        background: config.gradient,
        borderLeft: `3px solid ${config.color}`,
        borderColor: `${config.color}33`,
        '&:hover': {
          borderLeftColor: config.color,
          borderColor: `${config.color}55`,
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Box
            sx={{
              mt: 0.3,
              color: config.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 2,
              background: `${config.color}15`,
              flexShrink: 0,
            }}
          >
            {config.icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontSize: '0.95rem', mb: 0.5, lineHeight: 1.3 }}>
              {activity.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 1, lineHeight: 1.5 }}>
              {activity.description}
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <PlaceIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {activity.neighborhood}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {activity.duration >= 60 
                    ? `${Math.floor(activity.duration / 60)}h${activity.duration % 60 ? ` ${activity.duration % 60}m` : ''}`
                    : `${activity.duration}m`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <AttachMoneyIcon sx={{ fontSize: 14, color: 'success.main' }} />
                <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                  {activity.costEstimate === 0 ? 'Free' : `$${activity.costEstimate}`}
                </Typography>
              </Box>
            </Stack>
            {activity.tags.length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {activity.tags.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      background: 'rgba(159, 168, 218, 0.08)',
                      borderColor: 'transparent',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
