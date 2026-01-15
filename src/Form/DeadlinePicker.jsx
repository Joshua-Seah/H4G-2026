import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SelectDeadline() {
  const [selectedDateTime, setSelectedDateTime] = useState(
    new Date()
  );
  return <DatePicker
    selected={selectedDateTime}
    onChange={setSelectedDateTime}
    showTimeSelect
    timeFormat="HH:mm"
    timeIntervals={15}
    timeCaption="time"
    dateFormat="MMMM d, yyyy h:mm aa"
  />;
};