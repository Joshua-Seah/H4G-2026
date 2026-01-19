import { useState, useEffect } from "react";
import SelectTime from "./TimePicker" 
import SelectTimeDate from "./TimeDatePicker"
import DatePicker from "react-datepicker";

export default function EventDetails({onChange}) {
  const [formData, setFormData] = useState({
    "name": "",
    "details": "",
    "event_date": null,
    "start_time": null,
    "end_time": null,
    "location": "",
    "max": 0,
    "quota": 0,
    "deadline": null
  })

  const combineDateTime = (eventDate, timeDate) => {
    if (!eventDate || !timeDate) return null;
    const year = eventDate.getFullYear();
    const month = eventDate.getMonth();
    const day = eventDate.getDate();
    const hours = timeDate.getHours();
    const minutes = timeDate.getMinutes();
    return new Date(year, month, day, hours, minutes); // LOCAL timezone
  };

   useEffect(() => {
  const fullData = {
    ...formData,
    start_time: combineDateTime(formData.event_date, formData.start_time),
    end_time: combineDateTime(formData.event_date, formData.end_time),
    // deadline passes through unchanged (already full datetime)
  };
  if (onChange) onChange(fullData);
}, [formData.event_date, formData.start_time, formData.end_time, formData.deadline]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (<div>
  <form style={{
                    display: 'flex',
                    flexDirection: 'column', // Stacks inputs vertically
                    alignItems: 'center',    // <--- THIS fixes the button alignment
                    gap: '0.5px'     }}>
    <div>
        <label>Name of event: </label>
        <input name="name" value={formData.name} onChange={handleChange}></input>
    </div>
    <div>
        <label>Description of event: </label>
        <input name="details" value={formData.details} onChange={handleChange}></input>
    </div>
    <div>
      <label>Event Date: </label>
      <div>
        <DatePicker selected={formData.event_date}
            onChange={(val) => setFormData((prev) => ({ ...prev, event_date: val }))}
          />
      </div>
    </div>
    <div>
      <label>Start Time: </label>
      <div>
        <SelectTime value={formData.start_time}
            onChange={(val) => setFormData((prev) => ({ ...prev, start_time: val }))}
          />
      </div>
    </div>
    <div>
      <label>End Time: </label>
      <div>
        <SelectTime value={formData.end_time}
            onChange={(val) => setFormData((prev) => ({ ...prev, end_time: val }))}
          />
      </div>
    </div>
    <div>
      <label>Location: </label>
      <input name="location" value={formData.location} onChange={handleChange} />
    </div>
    <div>
      <label>Max number of participants: </label>
      <input name="max"
            type="number"
            value={formData.max}
            onChange={handleChange}></input>
    </div>
    <div>
      <label>Quota: </label>
      <input name="quota"
            type="number"
            value={formData.quota}
            onChange={handleChange}></input>
    </div>
    <div>
      <label>Sign-up deadline:</label>
      <div>
        <SelectTimeDate value={formData.deadline}
            onChange={(val) => setFormData((prev) => ({ ...prev, deadline: val }))}
          />
      </div>
    </div>
  </form>
  </div>)
}