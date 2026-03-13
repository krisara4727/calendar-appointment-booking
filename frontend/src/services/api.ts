import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export interface FreeSlot {
  date: string;
  timezone: string;
  freeSlots: string[];
  totalSlots: number;
}

export interface Event {
  id: string;
  startDateTime: string;
  endDateTime: string;
  durationMinutes: number;
  createdAt: string;
}

export interface EventsResponse {
  startDate: string;
  endDate: string;
  events: Event[];
  totalEvents: number;
}

export const api = {
  /**
   * Get free slots for a given date and timezone
   */
  async getFreeSlots(date: string, timezone: string): Promise<FreeSlot> {
    const response = await axios.get(`${API_BASE_URL}/slots/free`, {
      params: { date, timezone },
    });
    return response.data;
  },

  /**
   * Create a new event
   */
  async createEvent(dateTime: string, duration: number): Promise<Event> {
    const response = await axios.post(`${API_BASE_URL}/events`, {
      dateTime,
      duration,
    });
    return response.data.event;
  },

  /**
   * Get events within a date range
   */
  async getEvents(startDate: string, endDate: string): Promise<EventsResponse> {
    const response = await axios.get(`${API_BASE_URL}/events`, {
      params: { startDate, endDate },
    });
    return response.data;
  },
};
