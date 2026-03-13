import { Timestamp } from 'firebase-admin/firestore';

export interface Event {
  id?: string;
  startDateTime: Timestamp;
  endDateTime: Timestamp;
  durationMinutes: number;
  createdAt: Timestamp;
}

export interface CreateEventRequest {
  dateTime: string; // ISO 8601 format or timestamp
  duration: number; // Duration in minutes
}

export interface FreeSlotsRequest {
  date: string; // YYYY-MM-DD format
  timezone: string; // IANA timezone string
}

export interface GetEventsRequest {
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
}
