import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { EventService } from '../services/eventService';
import { AVAILABILITY_CONFIG } from '../config/constants';
import { CreateEventRequest } from '../types';

const eventService = new EventService();

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { dateTime, duration }: CreateEventRequest = req.body;

    if (!dateTime) {
      return res.status(400).json({
        error: 'Missing "dateTime" field in request body',
      });
    }

    if (!duration || typeof duration !== 'number' || duration <= 0) {
      return res.status(400).json({
        error:
          'Missing or invalid "duration" field (must be a positive number in minutes)',
      });
    }

    let startDateTime: DateTime;

    if (typeof dateTime === 'string') {
      startDateTime = DateTime.fromISO(dateTime, {
        zone: AVAILABILITY_CONFIG.DEFAULT_TIMEZONE,
      });

      if (!startDateTime.isValid) {
        const timestamp = parseInt(dateTime, 10);
        if (!isNaN(timestamp)) {
          startDateTime = DateTime.fromMillis(timestamp, {
            zone: AVAILABILITY_CONFIG.DEFAULT_TIMEZONE,
          });
        }
      }
    } else {
      startDateTime = DateTime.fromMillis(dateTime as any, {
        zone: AVAILABILITY_CONFIG.DEFAULT_TIMEZONE,
      });
    }

    if (!startDateTime.isValid) {
      return res.status(400).json({
        error: 'Invalid dateTime format. Use ISO 8601 string or Unix timestamp',
      });
    }

    const hasConflict = await eventService.checkConflict(
      startDateTime,
      duration
    );

    if (hasConflict) {
      return res.status(422).json({
        error: 'Event conflict: This time slot is already booked',
      });
    }

    const createdEvent = await eventService.createEvent({ dateTime, duration });

    return res.status(200).json({
      message: 'Event created successfully',
      event: {
        id: createdEvent.id,
        startDateTime: createdEvent.startDateTime.toDate().toISOString(),
        endDateTime: createdEvent.endDateTime.toDate().toISOString(),
        durationMinutes: createdEvent.durationMinutes,
        createdAt: createdEvent.createdAt.toDate().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || typeof startDate !== 'string') {
      return res.status(400).json({
        error:
          'Missing or invalid "startDate" query parameter (format: YYYY-MM-DD)',
      });
    }

    if (!endDate || typeof endDate !== 'string') {
      return res.status(400).json({
        error:
          'Missing or invalid "endDate" query parameter (format: YYYY-MM-DD)',
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return res.status(400).json({
        error: 'Invalid date format. Expected YYYY-MM-DD',
      });
    }

    const events = await eventService.getEventsByDateRange(startDate, endDate);

    const formattedEvents = events.map((event) => ({
      id: event.id,
      startDateTime: event.startDateTime.toDate().toISOString(),
      endDateTime: event.endDateTime.toDate().toISOString(),
      durationMinutes: event.durationMinutes,
      createdAt: event.createdAt.toDate().toISOString(),
    }));

    return res.status(200).json({
      startDate,
      endDate,
      events: formattedEvents,
      totalEvents: formattedEvents.length,
    });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};
