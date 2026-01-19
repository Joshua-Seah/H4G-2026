import { useState } from "react"
import EventDetails from "./EventDetails"
import FormCreator from "./FormCreator"
import * as db from './../db/queries.jsx'
import * as gsheets from '../gsheets/sheets-api-client.js';

export default function MainStaffForm() {
    const [eventData, setEventData] = useState({});
    const [formQuestions, setFormQuestions] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState('01');
    const [selectedYear, setSelectedYear] = useState('2026');

    const startTime = eventData.start_time;
    const eventDateStr = startTime 
    ? startTime.toISOString().split('T')[0]  // "2026-01-23" from start_time
    : null;

    const buildFinalJson = () => ({
        ...eventData,
        event_date: eventDateStr,
        start_time: eventData.start_time
            ? eventData.start_time.toISOString()
            : null,
        end_time: eventData.end_time
            ? eventData.end_time.toISOString()
            : null,
        deadline: eventData.deadline
            ? eventData.deadline.toISOString()
            : null,
        questions: formQuestions
    });
    // Helper: Local "YYYY-MM-DD" for Google Sheets
    const getLocalDateString = (dateObj) => {
        if (!dateObj) return "";
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // +1 for human readable string
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Helper: Local "HH:MM AM/PM" for Google Sheets
    const getLocalTimeString = (dateObj) => {
        if (!dateObj) return "";
        return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const handleSubmit = async () => {
  const finalJson = buildFinalJson();

  // Google Sheets (unchanged)
  const gsheetEvent = {
    date: getLocalDateString(eventData.event_date),
    eventName: eventData.name,
    details: eventData.details,
    startTime: getLocalTimeString(eventData.start_time),
    endTime: getLocalTimeString(eventData.end_time),
    location: eventData.location,
    max: eventData.max,
    quota: eventData.quota,
  };
  console.log("Adding event to Google Sheets:", gsheetEvent);
  await gsheets.ensureSheetExists(
    new Date(eventData.event_date).getFullYear(),
    new Date(eventData.event_date).getMonth()
  );
  await gsheets.addEvent(gsheetEvent);

  // File upload with MM-YYYY naming from dropdowns
  if (selectedFile) {
    try {
      const autoName = `${selectedMonth}-${selectedYear}.jpg`;
      console.log('Uploading:', autoName);
      const publicUrl = await db.uploadFile(selectedFile, autoName);
      console.log('✅ Uploaded:', publicUrl);
    } catch (error) {
      console.error('❌ Upload failed:', error);
    }
    setSelectedFile(null);
  }

  console.log("FINAL JSON:", JSON.stringify(finalJson, null, 2));

  try {
    const insertedEvent = await db.addEvent(finalJson);
    console.log('Event saved to Supabase:', insertedEvent);
    setEventData({});
    setFormQuestions([]);
  } catch (error) {
    console.error('Failed to save event:', error);
  }
};


    
    return ( <div style={{
                display: 'flex',
                justifyContent: 'center', // Centers VERTICALLY (main axis) because of column direction
                alignItems: 'center',     // Centers HORIZONTALLY (cross axis) because of column direction
                height: '100vh',
                width: '100vw',           // <--- FIX: Ensures the container spans the full width of the screen
                flexDirection: 'column',
  }}>
  <div>
    <EventDetails onChange={setEventData}/>
  </div>
  
  {/* Month/Year Dropdowns */}
  <div>
    Month:
    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
      <option value="01">January</option>
      <option value="02">February</option>
      <option value="03">March</option>
      <option value="04">April</option>
      <option value="05">May</option>
      <option value="06">June</option>
      <option value="07">July</option>
      <option value="08">August</option>
      <option value="09">September</option>
      <option value="10">October</option>
      <option value="11">November</option>
      <option value="12">December</option>
    </select>
  </div>
  <div>
    Year:
    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
      <option value="2026">2026</option>
      <option value="2027">2027</option>
      <option value="2028">2028</option>
      <option value="2029">2029</option>
      <option value="2030">2030</option>
    </select>
  </div>

  {/* Your existing file input (unchanged) */}
  <div style={{
    margin: '1rem 0',
    padding: '1rem',
    border: '2px dashed #d1d5db',
    borderRadius: '0.5rem',
    textAlign: 'center',
    backgroundColor: '#f9fafb',
    cursor: 'pointer'
  }}>
    <label style={{ cursor: 'pointer', display: 'block' }}>
      <p style={{ fontSize: '0.875rem', color: '#FFFFFF', marginTop: '0.5rem' }}>
        Upload JPG here
      </p>
      <input 
        id="file-upload"
        type="file" 
        accept="image/jpeg,image/jpg,image/png,image/*"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        style={{ display: 'none' }}
      />
    </label>
    {selectedFile && (
      <p style={{ fontSize: '0.875rem', color: '#059669', marginTop: '0.5rem' }}>
        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
      </p>
    )}
  </div>

  <div>
    <FormCreator onChange={setFormQuestions}/>
  </div>
  <button onClick={handleSubmit}>Submit Everything</button>
</div>)
}