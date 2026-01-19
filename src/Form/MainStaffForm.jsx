import { useState } from "react"
import EventDetails from "./EventDetails"
import FormCreator from "./FormCreator"
import * as db from './../db/queries.jsx'
import * as gsheets from '../gsheets/sheets-api-client.js';

export default function MainStaffForm() {
    const [eventData, setEventData] = useState({});
    const [formQuestions, setFormQuestions] = useState([]);

    const buildFinalJson = () => ({
        ...eventData,
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

        // Prepare Google Sheet Payload (Human Readable)
        const gsheetEvent = {
            date: getLocalDateString(eventData.event_date), // "2026-02-06"
            eventName: eventData.name,
            details: eventData.details, // Pass the description too!
            // Use original Date objects for formatting, NOT the ISO strings in finalJson
            startTime: getLocalTimeString(eventData.start_time), // "2:30 PM"
            endTime: getLocalTimeString(eventData.end_time),     // "4:30 PM"
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

        console.log(
            "FINAL JSON:",
            JSON.stringify(finalJson, null, 2)
        );

        try {
            const insertedEvent = await db.addEvent(finalJson);
            console.log('Event saved to Supabase:', insertedEvent);
            
            // Optional: reset form or show success
            setEventData({});
            setFormQuestions([]);
            
        } catch (error) {
            console.error('Failed to save event:', error);
        }
        //Call finalJson to SUPABASE :D
    }
    
    return (<>
    <div>
        <EventDetails onChange={setEventData}/>
    </div>
    <div>
        <FormCreator onChange={setFormQuestions}/>
    </div>
    <button onClick={handleSubmit}>Submit Everything</button>
     </>)
}