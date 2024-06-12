import React from "react";

interface TimeFormatterProps {
  dateString: string;
}

const TimeFormatter: React.FC<TimeFormatterProps> = ({ dateString }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formattedDate = date.toLocaleString("en-US", options);
    const [datePart, timePart] = formattedDate.split(", ");

    if (!datePart || !timePart) {
      return formattedDate;
    }

    return `${datePart} at ${timePart.toLowerCase()}`;
  };

  return <span>{formatDate(dateString)}</span>;
};

export default TimeFormatter;
