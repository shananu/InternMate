// 📁 src/components/MonthView.jsx
import React from "react";

const getMonthDates = (date) => {
  const monthDates = [];
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0); // Last date of the month

  const totalDays = lastDay.getDate();

  for (let day = 1; day <= totalDays; day++) {
    monthDates.push(new Date(year, month, day));
  }

  return monthDates;
};

const MonthView = ({ selectedDate, setSelectedDate }) => {
  const month = getMonthDates(selectedDate);

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", { day: "numeric", weekday: "short" });

  return (
    <div className="month-view">
      {month.map((day, idx) => {
        const isSelected = day.toDateString() === selectedDate.toDateString();
        return (
          <div
            key={idx}
            className={`calendar-day ${isSelected ? "selected" : ""}`}
            onClick={() => setSelectedDate(day)}
          >
            <span>{formatDate(day)}</span>
            <div className="progress-ring">
              <svg width="40" height="40">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="#ffcaa6"
                  fill="none"
                  strokeWidth="4"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MonthView;
