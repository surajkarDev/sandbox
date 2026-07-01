'use client';

import React, { useState } from 'react';

interface DatePickerSelectProps {
  label?: string;
  onDateChange?: (date: { day: string; month: string; year: string }) => void;
  initialDate?: { day: string; month: string; year: string };
}

const DatePickerSelect: React.FC<DatePickerSelectProps> = ({
  label = 'Date Of Birth',
  onDateChange,
  initialDate = { day: '01', month: 'Jan', year: '1997' },
}) => {
  const [day, setDay] = useState(initialDate.day);
  const [month, setMonth] = useState(initialDate.month);
  const [year, setYear] = useState(initialDate.year);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const days = Array.from({ length: 31 }, (_, i) => 
    String(i + 1).padStart(2, '0')
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => 
    String(currentYear - i)
  );

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDay = e.target.value;
    setDay(newDay);
    onDateChange?.({ day: newDay, month, year });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    setMonth(newMonth);
    onDateChange?.({ day, month: newMonth, year });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    setYear(newYear);
    onDateChange?.({ day, month, year: newYear });
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      
      <div className="flex gap-3 datePickerSelect">
        {/* Day Select */}
        <select
          value={day}
          onChange={handleDayChange}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Day</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Month Select */}
        <select
          value={month}
          onChange={handleMonthChange}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Month</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Year Select */}
        <select
          value={year}
          onChange={handleYearChange}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DatePickerSelect;
