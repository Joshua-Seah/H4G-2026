import { useState, useEffect } from "react";
import SelectTime from "./TimePicker" 
import SelectDeadline from "./DeadlinePicker"
import DatePicker from "react-datepicker";

export default function EventDetails({onChange}) {
  const [formData, setFormData] = useState({
    "name": "",
    "details": "",
    "event_date": null,
    "start_time": null,
    "end_time": null,
    "location": "",
    "max": "",
    "quota": "",
    "deadline": null
  })

   useEffect(() => {
      if (onChange) onChange(formData);
    }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (<>
  <h1>Event Details</h1>
  <form>
    <div>
        <label>Name of staff: </label>
        <input name="name" value={formData.name} onChange={handleChange}></input>
    </div>
    <div>
        <label>Description of event: </label>
        <input name="details" value={formData.details} onChange={handleChange} placeholder="Event Details"></input>
    </div>
    <div>
      <label>Event date: </label>
      <DatePicker selected={formData.event_date} onSelect={(date) => setFormData((prev) => ({ ...prev, event_date: date }))}/>
    </div>
    <div>
      <label>Start Time: </label>
      <SelectTime
      value={formData.start_time}
            onChange={(date) => setFormData((prev) => ({ ...prev, start_time: date }))}/>
    </div>
    <div>
      <label>End Time: </label>
      <SelectTime
      value={formData.end_time}
            onChange={(date) => setFormData((prev) => ({ ...prev, end_time: date }))}
          />
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
        <SelectDeadline value={formData.deadline}
            onChange={(val) => setFormData((prev) => ({ ...prev, deadline: val }))}
          />
      </div>
    </div>
  </form>
  </>)
}