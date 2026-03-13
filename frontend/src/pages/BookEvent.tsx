import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "../services/api";
import {
  formatDateToISO,
  formatTimeInTimezone,
  TIMEZONE_OPTIONS,
} from "../utils/dateUtils";

const BookEvent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [duration, setDuration] = useState<number>(30);
  const [timezone, setTimezone] = useState<string>("America/New_York");
  const [freeSlots, setFreeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleGetFreeSlots = async () => {
    if (!selectedDate) {
      setError("Please select a date");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setFreeSlots([]);

    try {
      const dateStr = formatDateToISO(selectedDate);
      const response = await api.getFreeSlots(dateStr, timezone);
      setFreeSlots(response.freeSlots);

      if (response.freeSlots.length === 0) {
        setError("No available slots for this date");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch free slots");
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (slotTime: string) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.createEvent(slotTime, duration);
      setSuccess(
        `Successfully booked appointment at ${formatTimeInTimezone(
          slotTime,
          timezone
        )}`
      );

      // Refresh slots
      setTimeout(() => {
        handleGetFreeSlots();
      }, 2000);
    } catch (err: any) {
      if (err.response?.status === 422) {
        setError(
          "This slot is already booked. Please refresh and try another slot."
        );
      } else {
        setError(err.response?.data?.error || "Failed to book appointment");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Book Appointment with Dr. John</h1>

      <div className="form-section">
        <div className="form-group">
          <label>Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            minDate={new Date()}
            dateFormat="MMMM d, yyyy"
            className="date-picker"
          />
        </div>

        <div className="form-group">
          <label>Duration (minutes):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
            min="15"
            step="15"
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Timezone:</label>
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
          onClick={handleGetFreeSlots}
          disabled={loading || !selectedDate}
          className="btn btn-primary"
        >
          {loading ? "Loading..." : "Get Free Slots"}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {freeSlots.length > 0 && (
        <div className="slots-section">
          <h2>Available Slots ({freeSlots.length})</h2>
          <div className="slots-grid">
            {freeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => handleBookSlot(slot)}
                disabled={loading}
                className="slot-button"
              >
                {formatTimeInTimezone(slot, timezone)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookEvent;
