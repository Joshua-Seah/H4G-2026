import { useState, useEffect } from "react";
import SelectTime from "./TimePicker" 
import SelectTimeDate from "./TimeDatePicker"
import DatePicker from "react-datepicker";

export default function EventDetails({onChange}) {
  const [formData, setFormData] = useState({
    "name": "",
    "details": "",
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
        <label>Name of event: </label>
        <input name="name" value={formData.name} onChange={handleChange}></input>
    </div>
    <div>
        <label>Description of event: </label>
        <input name="details" value={formData.details} onChange={handleChange} placeholder="Event Details"></input>
    </div>
    <div>
      <label>Event Start Date and Time: </label>
      <div>
        <SelectTimeDate value={formData.start_time}
            onChange={(val) => setFormData((prev) => ({ ...prev, start_time: val }))}
          />
      </div>
    </div>
    <div>
      <label>Event End Date and Time: </label>
      <div>
        <SelectTimeDate value={formData.end_time}
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
  </>)
}