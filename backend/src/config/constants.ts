export const AVAILABILITY_CONFIG = {
  START_HOUR: 8,
  END_HOUR: 17,
  SLOT_DURATION_MINUTES: 30,
  DEFAULT_TIMEZONE: 'America/New_York',
} as const;

export const FIRESTORE_COLLECTIONS = {
  EVENTS: 'events',
} as const;
