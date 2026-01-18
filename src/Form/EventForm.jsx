// this one will pull questions and info from DB to display
import { useState } from 'react';
import { db } from '../db/supabase-client.jsx';
import '../event.css';

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

        console.log("Answers to insert:", formatAnswers);


        if (error) {
            console.error("Error submitting forms", error);
        } else {
            console.log("Successfully submitted form");
            onSubmit(); //this part is to make changes to calendar side
        }

    }

    return (
        <div className="event-form">
            <button className="close-button" onClick={onClose}> Close </button>
            <h2>{event.name}</h2>
            <p>{event.details}</p>
            <p>{event.event_date}</p>
            <p>{event.start_time}</p>
            <p>{event.end_time}</p>
            <p>{event.location}</p>

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
        </div>
    );
}

export default EventForm;