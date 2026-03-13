import { DateTime } from 'luxon';
import { AVAILABILITY_CONFIG } from '../config/constants';
import { Event } from '../types';

export class SlotService {
  /**
   * Generate all available time slots for a given date in the requested timezone
   * @param date - Date string in YYYY-MM-DD format
   * @param requestedTimezone - IANA timezone string (e.g., 'America/New_York', 'Asia/Kolkata')
   * @param bookedEvents - List of events already booked
   * @returns Array of ISO 8601 datetime strings representing free slots
   */
  generateFreeSlots(
    date: string,
    requestedTimezone: string,
    bookedEvents: Event[]
  ): string[] {
    const startOfDay = DateTime.fromISO(date, {
      zone: AVAILABILITY_CONFIG.DEFAULT_TIMEZONE,
    }).set({
      hour: AVAILABILITY_CONFIG.START_HOUR,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    const endOfDay = DateTime.fromISO(date, {
      zone: AVAILABILITY_CONFIG.DEFAULT_TIMEZONE,
    }).set({
      hour: AVAILABILITY_CONFIG.END_HOUR,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    if (!startOfDay.isValid || !endOfDay.isValid) {
      throw new Error('Invalid date provided');
    }
    const allSlots: DateTime[] = [];
    let currentSlot = startOfDay;

    while (currentSlot < endOfDay) {
      allSlots.push(currentSlot);
      currentSlot = currentSlot.plus({
        minutes: AVAILABILITY_CONFIG.SLOT_DURATION_MINUTES,
      });
    }

    // Filter out slots that conflict with booked events
    const freeSlots = allSlots.filter((slot) => {
      return !this.isSlotBooked(slot, bookedEvents);
    });

    // Convert free slots to requested timezone and return as ISO strings
    return freeSlots
      .map((slot) =>
        slot.setZone(requestedTimezone).toISO({ suppressMilliseconds: true })
      )
      .filter((isoString): isoString is string => isoString !== null);
  }

  /**
   * Check if a slot conflicts with any booked events
   * @param slot - DateTime object representing the slot
   * @param bookedEvents - List of events to check against
   * @returns true if slot is booked, false otherwise
   */
  private isSlotBooked(slot: DateTime, bookedEvents: Event[]): boolean {
    const slotEnd = slot.plus({
      minutes: AVAILABILITY_CONFIG.SLOT_DURATION_MINUTES,
    });

    return bookedEvents.some((event) => {
      const eventStart = DateTime.fromMillis(event.startDateTime.toMillis(), {
        zone: AVAILABILITY_CONFIG.DEFAULT_TIMEZONE,
      });
      const eventEnd = DateTime.fromMillis(event.endDateTime.toMillis(), {
        zone: AVAILABILITY_CONFIG.DEFAULT_TIMEZONE,
      });

      // Check for overlap: slot overlaps if it starts before event ends AND ends after event starts
      return slot < eventEnd && slotEnd > eventStart;
    });
  }

  /**
   * Check if a new event conflicts with existing events
   * @param startDateTime - Start time of the new event
   * @param durationMinutes - Duration of the new event
   * @param existingEvents - List of existing events
   * @returns true if there's a conflict, false otherwise
   */
  checkEventConflict(
    startDateTime: DateTime,
    durationMinutes: number,
    existingEvents: Event[]
  ): boolean {
    const newEventEnd = startDateTime.plus({ minutes: durationMinutes });

    return existingEvents.some((event) => {
      const eventStart = DateTime.fromMillis(event.startDateTime.toMillis(), {
        zone: AVAILABILITY_CONFIG.DEFAULT_TIMEZONE,
      });
      const eventEnd = DateTime.fromMillis(event.endDateTime.toMillis(), {
        zone: AVAILABILITY_CONFIG.DEFAULT_TIMEZONE,
      });

      // Check for overlap
      return startDateTime < eventEnd && newEventEnd > eventStart;
    });
  }
}
