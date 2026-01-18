
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SelectDeadline({value, onChange}) {

  return <DatePicker
    selected={value}
    onChange={onChange}
    showTimeSelect
    timeFormat="HH:mm"
    timeIntervals={15}
    timeCaption="time"
    dateFormat="MMMM d, yyyy h:mm aa"
  />;
};