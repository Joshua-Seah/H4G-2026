import { useState } from "react"
import EventDetails from "./EventDetails"
import FormCreator from "./FormCreator"

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

    const handleSubmit = () => {
        const finalJson = buildFinalJson();

        console.log(
            "FINAL JSON:",
            JSON.stringify(finalJson, null, 2)
        );
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