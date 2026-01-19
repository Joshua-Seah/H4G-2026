import { db } from "../db/supabase-client";
import * as dbHelper from "../db/queries.jsx";
import * as gsheets from "../gsheets/sheets-api-client.js";
import "../event.css";

function SignedEventForm({ event, onClose, onCancel }) {
    
    const handleCancel = async () => {
        const { data: { user }} = await db.auth.getUser();
        if (!user) return;

        await db.from("forms").delete().eq("eid", event.eid).eq("uid", user.id);

        const {firstname, lastname, role} = await dbHelper.getUserProfile(user.id);
        const name = `${firstname} ${lastname}`

        console.log("Cancelling signup for", name, role);
    
        if (role === 'V') {
            await gsheets.removeVolunteer(event.event_date, event.name, name);
        } else if (role === 'P') {
            await gsheets.removeParticipant(event.event_date, event.name, name);
        } else {
            console.log("User role not recognized");
        }

        onCancel();
    };

    return (
        <div className="event-form">
        <h2>{event.name}</h2>
        <p>{event.details}</p>
        <p>{event.event_date}</p>
        <p>{event.start_time}</p>
        <p>{event.end_time}</p>
        <p>{event.location}</p>

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