import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SelectTime() {
  const [selectedDateTime, setSelectedDateTime] = useState(
    new Date(),
  );

  return (
    <DatePicker
      selected={selectedDateTime}
      onChange={setSelectedDateTime}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="h:mm aa"
    />
  );
};
