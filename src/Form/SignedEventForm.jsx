import { db } from "../db/supabase-client";
import "../event.css";

const formatTime = (isoDateString) => {
    return new Date(isoDateString).toLocaleTimeString("en-UK", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC"
    });
}

function SignedEventForm({ event, onClose, onCancel }) {
    
    const handleCancel = async () => {
        const { data: { user }} = await db.auth.getUser();
        if (!user) return;

        await db.from("forms").delete().eq("eid", event.eid).eq("uid", user.id);

        onCancel();
    };

    return (
        <div className="event-form">
        <h2>{event.name}</h2>
        <p>{event.details}</p>
        <p>Date: {event.event_date}</p>
        <p>Start: {formatTime(event.start_time)}</p>
        <p>End: {formatTime(event.end_time)}</p>
        <p>Location: {event.location}</p>

        <button className="submit-button" onClick={handleCancel}>
            Cancel Sign Up
        </button>

        <button className="close-button" onClick={onClose}>
            Close
        </button>
      </div>
    );
}

export default SignedEventForm;