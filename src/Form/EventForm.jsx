// this one will pull questions and info from DB to display
import { useState } from 'react';
import { db } from '../db/supabase-client.jsx';
import * as dbHelper from '../db/queries.jsx';
import * as gsheets from '../gsheets/sheets-api-client.js';
import '../event.css';

const formatTime = (isoDateString) => {
    return new Date(isoDateString).toLocaleTimeString("en-UK", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC"
    });
}

function EventForm({ event, onClose, onSubmit }) {

    const [answers, setAnswers] = useState({});

    const handleChange = (qKey, value) => {
        setAnswers((prev) => ({
            ...prev,
            [qKey]: value
        }))
    }

    const handleSubmit = async () => {

        const formatAnswers = Object.keys(answers).sort().map((key) => answers[key]); // format to what db requires

        for (const q of event.questions) {
        if (!answers[q.key] || answers[q.key].trim?.() === "") {
            alert("Please answer all questions before submitting.");
            return;
            }
        }

        const {
            data: {user},
            error: userError
        } = await db.auth.getUser();

        if (userError || !user) {
            console.log("User not authenticated");
            return;
        }

        const { error } = await db.from("forms").insert({
            eid: event.eid,
            uid: user.id,
            selected_options: formatAnswers
        });

        if (error) {
            if (error.message === "Overlap detected") {
                alert("You have signed up for existing events that overlap this event")
            } else if (error.message === "Max participants reached") {
                alert("The event is full, please try again later")
            } else {
                alert("Error submitting form, please try again")
                console.error("Error submitting forms", error);
            }
            return;
        } else {
            console.log("Successfully submitted form");
            onSubmit(); //this part is to make changes to calendar side
        }

        // We get the key of the first question from the event object to look up the answer.
        if (event.questions && event.questions.length > 0) {
            const firstQuestionKey = event.questions[0].key;
            const firstAnswer = answers[firstQuestionKey];

            // If the answer is "No", stop here and do not push to GSheets
            if (firstAnswer === "No") {
                console.log("User selected 'No'. Skipping Google Sheets update.");
                return;
            }
        }

        const {firstname, lastname, role} = await dbHelper.getUserProfile(user.id);
        const eventName = event.name;
        const eventDate = event.event_date;
        
        if (role === 'V') {
            await gsheets.addVolunteer(eventDate, eventName, `${firstname} ${lastname}`);
        } else if (role === 'P') {
            await gsheets.addParticipant(eventDate, eventName, `${firstname} ${lastname}`);
        } else {
            console.log("User role not recognized");
        }

    }

    return (
        <div className="event-form">
            
            <h2>{event.name}</h2>
            <p>{event.details}</p>
            <p>Date: {event.event_date}</p>
            <p>Start: {formatTime(event.start_time)}</p>
            <p>End: {formatTime(event.end_time)}</p>
            <p>Location: {event.location}</p>

            {event.questions?.map((q) => (
                <div key={q.key}>
                    <label>{q.question}</label>
                    
                    {/* single choice */}
                    {q.question_type === "singlechoice" && (
                        <select value={answers[q.key] || ""} onChange={(x) => handleChange(q.key, x.target.value)}>
                            <option value="" disabled>
                                Select an option
                            </option>
                            {q.options.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* open response */}
                    {q.question_type === "short_answer" && (
                        <input type="text" value={answers[q.key] || ""} onChange={(x) => handleChange(q.key, x.target.value)}/>
                    )}
                </div>
            ))}

            <button className="submit-button" onClick={handleSubmit}>
                Sign Up
            </button>
            <button className="close-button" onClick={onClose}> Close </button>
        </div>
    );
}

export default EventForm;