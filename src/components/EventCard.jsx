import "../event.css";

const formatTime = (isoDateString) => {
    return new Date(isoDateString).toLocaleTimeString("en-UK", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC"
    });
}

function EventCard ({ event, signed, onClick }) {
    
    //purely display purpose atp, need to include a signup/cancel button eventually. the actual event params sort later

    return (
        <div className="event-card" onClick={onClick}>
            <h3>{event.name}</h3>
            <p>Date: {event.event_date}</p>
            <p>Start: {formatTime(event.start_time)}</p>
            <p>End: {formatTime(event.end_time)}</p>
            <p>Location: {event.location}</p>

            {signed && <span className="signed-label">Registered</span>}
        </div>
    );
}

export default EventCard;