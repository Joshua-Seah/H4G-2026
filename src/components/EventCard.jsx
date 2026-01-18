import "../event.css";

function EventCard ({ event, signed, onClick }) {
    
    //purely display purpose atp, need to include a signup/cancel button eventually. the actual event params sort later

    return (
        <div className="event-card" onClick={onClick}>
            <h3>{event.name}</h3>
            <p>{event.event_date}</p>
            {/* include formatted time in hrs and mins */}
            <p>{event.location}</p>

            {signed && <span className="signed-label">Registered</span>}
        </div>
    );
}

export default EventCard;