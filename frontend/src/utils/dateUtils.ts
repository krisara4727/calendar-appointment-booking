import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

/**
 * Format a date object to YYYY-MM-DD
 */
export const formatDateToISO = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Format a date object to readable date string
 */
export const formatDateReadable = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

/**
 * Format ISO datetime string to readable time in specified timezone
 */
export const formatTimeInTimezone = (
  isoString: string,
  timezone: string
): string => {
  try {
    const date = parseISO(isoString);
    return formatInTimeZone(date, timezone, 'h:mm a');
  } catch (error) {
    return isoString;
  }
};

/**
 * Format ISO datetime string to readable datetime in specified timezone
 */
export const formatDateTimeInTimezone = (
  isoString: string,
  timezone: string
): string => {
  try {
    const date = parseISO(isoString);
    return formatInTimeZone(date, timezone, 'MMM dd, yyyy h:mm a');
  } catch (error) {
    return isoString;
  }
};

/**
 * Common timezone options for dropdown
 */
export const TIMEZONE_OPTIONS = [
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
  { value: 'Europe/London', label: 'British Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
];
