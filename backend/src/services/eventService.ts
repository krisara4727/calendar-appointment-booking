import { Timestamp } from 'firebase-admin/firestore';
import { DateTime } from 'luxon';
import { getFirestore } from '../config/firebase';
import { FIRESTORE_COLLECTIONS, AVAILABILITY_CONFIG } from '../config/constants';
import { Event, CreateEventRequest } from '../types';

export class EventService {
  private get db() {
    return getFirestore();
  }

  private get eventsCollection() {
    return this.db.collection(FIRESTORE_COLLECTIONS.EVENTS);
  }

  /**
   * Create a new event
   * @param eventData - Event creation request data
   * @returns Created event with ID
   */
  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    // Parse the incoming dateTime (handle both ISO strings and timestamps)
    let startDateTime: DateTime;

    if (typeof eventData.dateTime === 'string') {
      // Try parsing as ISO string first
      startDateTime = DateTime.fromISO(eventData.dateTime, {
        zone: AVAILABILITY_CONFIG.DEFAULT_TIMEZONE,
      });

      // If invalid, try parsing as timestamp
      if (!startDateTime.isValid) {
        const timestamp = parseInt(eventData.dateTime, 10);
        if (!isNaN(timestamp)) {
          startDateTime = DateTime.fromMillis(timestamp, {
            zone: AVAILABILITY_CONFIG.DEFAULT_TIMEZONE,
          });
        }
      }
    } else {
      startDateTime = DateTime.fromMillis(eventData.dateTime as any, {
        zone: AVAILABILITY_CONFIG.DEFAULT_TIMEZONE,
      });
    }

    if (!startDateTime.isValid) {
      throw new Error('Invalid dateTime format');
    }

    // Calculate end time
    const endDateTime = startDateTime.plus({
      minutes: eventData.duration,
    });

    // Convert to Firestore Timestamps
    const startTimestamp = Timestamp.fromMillis(startDateTime.toMillis());
    const endTimestamp = Timestamp.fromMillis(endDateTime.toMillis());

    const event: Omit<Event, 'id'> = {
      startDateTime: startTimestamp,
      endDateTime: endTimestamp,
      durationMinutes: eventData.duration,
      createdAt: Timestamp.now(),
    };

    const docRef = await this.eventsCollection.add(event);

    return {
      id: docRef.id,
      ...event,
    };
  }

  /**
   * Get events for a specific date
   * @param date - Date string in YYYY-MM-DD format
   * @returns List of events on that date
   */
  async getEventsForDate(date: string): Promise<Event[]> {
    const startOfDay = DateTime.fromISO(date, {
      zone: AVAILABILITY_CONFIG.DEFAULT_TIMEZONE,
    }).startOf('day');

    const endOfDay = startOfDay.endOf('day');

    const startTimestamp = Timestamp.fromMillis(startOfDay.toMillis());
    const endTimestamp = Timestamp.fromMillis(endOfDay.toMillis());

    const snapshot = await this.eventsCollection
      .where('startDateTime', '>=', startTimestamp)
      .where('startDateTime', '<', endTimestamp)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[];
  }

  /**
   * Get events within a date range
   * @param startDate - Start date in YYYY-MM-DD format
   * @param endDate - End date in YYYY-MM-DD format
   * @returns List of events within the range
   */
  async getEventsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<Event[]> {
    const start = DateTime.fromISO(startDate, {
      zone: AVAILABILITY_CONFIG.DEFAULT_TIMEZONE,
    }).startOf('day');

    const end = DateTime.fromISO(endDate, {
      zone: AVAILABILITY_CONFIG.DEFAULT_TIMEZONE,
    }).endOf('day');

    if (!start.isValid || !end.isValid) {
      throw new Error('Invalid date format');
    }

    const startTimestamp = Timestamp.fromMillis(start.toMillis());
    const endTimestamp = Timestamp.fromMillis(end.toMillis());

    const snapshot = await this.eventsCollection
      .where('startDateTime', '>=', startTimestamp)
      .where('startDateTime', '<=', endTimestamp)
      .orderBy('startDateTime', 'asc')
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[];
  }

  /**
   * Check if an event exists at a specific time
   * @param startDateTime - DateTime object
   * @param durationMinutes - Duration in minutes
   * @returns true if conflict exists, false otherwise
   */
  async checkConflict(
    startDateTime: DateTime,
    durationMinutes: number
  ): Promise<boolean> {
    const endDateTime = startDateTime.plus({ minutes: durationMinutes });

    const startTimestamp = Timestamp.fromMillis(startDateTime.toMillis());
    const endTimestamp = Timestamp.fromMillis(endDateTime.toMillis());

    // Check for any overlapping events
    const snapshot = await this.eventsCollection
      .where('startDateTime', '<', endTimestamp)
      .where('endDateTime', '>', startTimestamp)
      .limit(1)
      .get();

    return !snapshot.empty;
  }
}
