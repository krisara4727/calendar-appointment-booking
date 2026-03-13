import { Request, Response } from 'express';
import { SlotService } from '../services/slotService';
import { EventService } from '../services/eventService';

const slotService = new SlotService();
const eventService = new EventService();

export const getFreeSlots = async (req: Request, res: Response) => {
  try {
    const { date, timezone } = req.query;

    if (!date || typeof date !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid "date" query parameter (format: YYYY-MM-DD)',
      });
    }

    if (!timezone || typeof timezone !== 'string') {
      return res.status(400).json({
        error:
          'Missing or invalid "timezone" query parameter (e.g., America/New_York)',
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        error: 'Invalid date format. Expected YYYY-MM-DD',
      });
    }

    const bookedEvents = await eventService.getEventsForDate(date);

    const freeSlots = slotService.generateFreeSlots(
      date,
      timezone,
      bookedEvents
    );

    return res.status(200).json({
      date,
      timezone,
      freeSlots,
      totalSlots: freeSlots.length,
    });
  } catch (error: any) {
    console.error('Error fetching free slots:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};
