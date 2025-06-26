// 📁 src/components/MonthlyCalendar.jsx

import React from "react";

const MonthlyCalendar = ({ selectedDate, setSelectedDate }) => {
  const today = new Date();
  const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

  const dates = [];

  // Add empty slots before the first day of the month to align weekdays
  const startDay = start.getDay();
  for (let i = 0; i < startDay; i++) {
    dates.push(null);
  }

  for (let i = 1; i <= end.getDate(); i++) {
    dates.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i));
  }

  const getProgress = (date) => {
    if (!date) return 0;
    const key = date.toISOString().split("T")[0];
    const stored = JSON.parse(localStorage.getItem(key));
    if (!stored) return 0;
    const done = stored.done?.length || 0;
    const total = (stored.todo?.length || 0) + (stored.inProgress?.length || 0) + done;
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  const handleDateSelect = (date) => {
    if (!date) return;
    const key = date.toISOString().split("T")[0];
    const stored = JSON.parse(localStorage.getItem(key));
    if (!stored) {
      localStorage.setItem(key, JSON.stringify({ todo: [], inProgress: [], done: [] }));
    }
    setSelectedDate(date);
  };

  return (
    <div className="monthly-calendar">
      <h2>{selectedDate.toLocaleString("default", { month: "long" })}</h2>
      <div className="calendar-grid">
        {dates.map((date, index) => {
          const isSelected =
            date && date.toDateString() === selectedDate.toDateString();
          const progress = getProgress(date);
          return (
            <div
              key={index}
              className={`calendar-cell ${isSelected ? "selected" : ""} ${!date ? "empty" : ""}`}
              onClick={() => handleDateSelect(date)}
            >
              {date && (
                <>
                  <div className="date-number">{date.getDate()}</div>
                  <div className="progress-ring">
                    <svg width="36" height="36">
                      <circle
                        cx="18"
                        cy="18"
                        r="15"
                        stroke="#ffb347"
                        fill="none"
                        strokeWidth="4"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15"
                        stroke="#f57c00"
                        fill="none"
                        strokeWidth="4"
                        strokeDasharray={2 * Math.PI * 15}
                        strokeDashoffset={
                          (1 - progress / 100) * 2 * Math.PI * 15
                        }
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyCalendar;