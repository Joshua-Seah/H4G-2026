import { useState } from "react"
import EventDetails from "./EventDetails"
import FormCreator from "./FormCreator"
import * as db from './../db/queries.jsx'

export default function MainStaffForm() {
    const [eventData, setEventData] = useState({});
    const [formQuestions, setFormQuestions] = useState([]);

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

    const handleSubmit = async () => {
        const finalJson = buildFinalJson();

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