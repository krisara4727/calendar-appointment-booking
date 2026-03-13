import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api, Event } from "../services/api";
import {
  formatDateToISO,
  formatDateTimeInTimezone,
  TIMEZONE_OPTIONS,
} from "../utils/dateUtils";

const ShowEvents: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [timezone, setTimezone] = useState<string>("America/New_York");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleGetEvents = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    if (startDate > endDate) {
      setError("Start date must be before end date");
      return;
    }

    setLoading(true);
    setError("");
    setEvents([]);

    try {
      const startDateStr = formatDateToISO(startDate);
      const endDateStr = formatDateToISO(endDate);
      const response = await api.getEvents(startDateStr, endDateStr);
      setEvents(response.events);

      if (response.events.length === 0) {
        setError("No events found in this date range");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>View Scheduled Appointments</h1>

      <div className="form-section">
        <div className="form-group">
          <label>Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="MMMM d, yyyy"
            className="date-picker"
          />
        </div>

        <div className="form-group">
          <label>End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate ?? undefined}
            dateFormat="MMMM d, yyyy"
            className="date-picker"
          />
        </div>

        <div className="form-group">
          <label>Display Timezone:</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="select-field"
          >
            {TIMEZONE_OPTIONS.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGetEvents}
          disabled={loading || !startDate || !endDate}
          className="btn btn-primary"
        >
          {loading ? "Loading..." : "Get Events"}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {events.length > 0 && (
        <div className="events-section">
          <h2>Scheduled Appointments ({events.length})</h2>
          <div className="events-list">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-time">
                  <strong>
                    {formatDateTimeInTimezone(event.startDateTime, timezone)}
                  </strong>
                </div>
                <div className="event-details">
                  <span>Duration: {event.durationMinutes} minutes</span>
                  <span className="event-end">
                    Ends:{" "}
                    {formatDateTimeInTimezone(event.endDateTime, timezone)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowEvents;
