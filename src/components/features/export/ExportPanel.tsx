'use client';

import React, { useState } from 'react';
import { Box, Button, Stack, Snackbar, Alert, Typography, Paper } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DescriptionIcon from '@mui/icons-material/Description';
import PrintIcon from '@mui/icons-material/Print';
import { Itinerary } from '@/lib/types';

interface ExportPanelProps {
  itinerary: Itinerary;
}

function itineraryToPlainText(itinerary: Itinerary): string {
  let text = `✈️ Trip to ${itinerary.tripProfile.destinations.join(', ')}\n`;
  text += `📅 ${itinerary.tripProfile.startDate} → ${itinerary.tripProfile.endDate}\n`;
  text += `💰 Estimated total: $${itinerary.totalEstimatedCost}\n`;
  text += `\n${itinerary.summary}\n\n`;
  text += '─'.repeat(50) + '\n\n';

  itinerary.days.forEach((day) => {
    const dateStr = new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });
    text += `📍 DAY ${day.dayIndex + 1} — ${dateStr} ($${day.dailyBudget})\n\n`;

    if (day.morningActivities.length > 0) {
      text += '  🌅 Morning:\n';
      day.morningActivities.forEach((a) => {
        text += `    • ${a.name} — ${a.neighborhood} (${a.duration}min, $${a.costEstimate})\n`;
        text += `      ${a.description}\n`;
      });
      text += '\n';
    }
    if (day.afternoonActivities.length > 0) {
      text += '  🌤 Afternoon:\n';
      day.afternoonActivities.forEach((a) => {
        text += `    • ${a.name} — ${a.neighborhood} (${a.duration}min, $${a.costEstimate})\n`;
        text += `      ${a.description}\n`;
      });
      text += '\n';
    }
    if (day.eveningActivities.length > 0) {
      text += '  🌙 Evening:\n';
      day.eveningActivities.forEach((a) => {
        text += `    • ${a.name} — ${a.neighborhood} (${a.duration}min, $${a.costEstimate})\n`;
        text += `      ${a.description}\n`;
      });
      text += '\n';
    }
    text += '─'.repeat(50) + '\n\n';
  });

  return text;
}

function itineraryToMarkdown(itinerary: Itinerary): string {
  let md = `# ✈️ Trip to ${itinerary.tripProfile.destinations.join(', ')}\n\n`;
  md += `**Dates:** ${itinerary.tripProfile.startDate} → ${itinerary.tripProfile.endDate}  \n`;
  md += `**Estimated Total:** $${itinerary.totalEstimatedCost}  \n`;
  md += `**Pace:** ${itinerary.tripProfile.pace}  \n\n`;
  md += `> ${itinerary.summary}\n\n---\n\n`;

  itinerary.days.forEach((day) => {
    const dateStr = new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });
    md += `## Day ${day.dayIndex + 1} — ${dateStr}\n\n`;
    md += `**Daily Budget:** $${day.dailyBudget}\n\n`;

    const sections = [
      { title: '🌅 Morning', activities: day.morningActivities },
      { title: '🌤 Afternoon', activities: day.afternoonActivities },
      { title: '🌙 Evening', activities: day.eveningActivities },
    ];

    sections.forEach(({ title, activities }) => {
      if (activities.length > 0) {
        md += `### ${title}\n\n`;
        activities.forEach((a) => {
          md += `- **${a.name}** — ${a.neighborhood}  \n`;
          md += `  ${a.description}  \n`;
          md += `  ⏱ ${a.duration}min · 💰 $${a.costEstimate} · 🏷 ${a.tags.join(', ')}\n\n`;
        });
      }
    });

    md += '---\n\n';
  });

  return md;
}

export default function ExportPanel({ itinerary }: ExportPanelProps) {
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackMessage(`Copied as ${format}!`);
      setSnackOpen(true);
    } catch {
      setSnackMessage('Failed to copy to clipboard');
      setSnackOpen(true);
    }
  };

  const handlePrint = () => {
    const printContent = itineraryToPlainText(itinerary);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Trip to ${itinerary.tripProfile.destinations.join(', ')}</title>
            <style>
              body { font-family: 'Inter', 'Georgia', serif; max-width: 700px; margin: 40px auto; padding: 20px; color: #1a1a1a; line-height: 1.6; }
              pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; }
            </style>
          </head>
          <body><pre>${printContent}</pre></body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(108,99,255,0.05) 0%, rgba(255,107,157,0.03) 100%)',
        border: '1px solid rgba(159, 168, 218, 0.08)',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary' }}>
        Export & Share
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Button
          startIcon={<ContentCopyIcon />}
          variant="outlined"
          size="small"
          onClick={() => copyToClipboard(itineraryToPlainText(itinerary), 'plain text')}
          sx={{ borderColor: 'rgba(159, 168, 218, 0.2)', color: 'text.secondary', flex: 1 }}
        >
          Copy as Text
        </Button>
        <Button
          startIcon={<DescriptionIcon />}
          variant="outlined"
          size="small"
          onClick={() => copyToClipboard(itineraryToMarkdown(itinerary), 'Markdown')}
          sx={{ borderColor: 'rgba(159, 168, 218, 0.2)', color: 'text.secondary', flex: 1 }}
        >
          Copy as Markdown
        </Button>
        <Button
          startIcon={<PrintIcon />}
          variant="outlined"
          size="small"
          onClick={handlePrint}
          sx={{ borderColor: 'rgba(159, 168, 218, 0.2)', color: 'text.secondary', flex: 1 }}
        >
          Print View
        </Button>
      </Stack>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackOpen(false)} sx={{ borderRadius: 2 }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
