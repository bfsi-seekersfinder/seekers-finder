import { useEffect, useState } from "react";

export default function DateSelector({ selectDate, index = null }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    if (endDate && newStartDate > endDate) {
      setEndDate(newStartDate);
    }

    selectDate(newStartDate, endDate, index);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);

    if (startDate && newEndDate < startDate) {
      setStartDate(newEndDate);
    }

    selectDate(startDate, newEndDate, index);
  };

  useEffect(() => {
    selectDate(startDate, endDate, index);
  }, [startDate, endDate]);

  return (
    <div className="flex flex-col gap-4">
      {/* Start Date Selector */}
      <div className="flex flex-col">
        <label className="text-sm font-medium">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="border border-gray-300 p-2 rounded-md"
        />
      </div>

      {/* End Date Selector */}
      <div className="flex flex-col">
        <label className="text-sm font-medium">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          min={startDate} // Prevent selecting a date before start date
          className="border border-gray-300 p-2 rounded-md"
        />
      </div>
    </div>
  );
}
