import SelectDate from "./EventDurationPicker"
import SelectTime from "./TimePicker" 
import SelectDeadline from "./DeadlinePicker"

export default function StaffForm() {
  return (<>
  <h1>Staff Form</h1>
  <form>
    <div>
        <label>Name of staff: </label>
        <input name="name"></input>
    </div>
    <div>
        <label>Description of event: </label>
        <input name="description"></input>
    </div>
    <div>
      <label>Duration of event:</label>
      <div>
      <SelectDate/>
      </div>
    </div>
    <div>
      <label>Start Time: </label>
      <SelectTime/>
    </div>
    <div>
      <label>End Time: </label>
      <SelectTime/>
    </div>
    <div>
      <label>Location: </label>
      <input name="location"></input>
    </div>
    <div>
      <label>Max number of participants: </label>
      <input name="max_number" type="number"></input>
    </div>
    <div>
      <label>Sign-up deadline:</label>
      <div>
        <SelectDeadline/>
      </div>
    </div>

  </form>
  </>)
}