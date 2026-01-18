import "../event.css";

function EventCard ({ event, onClick }) {
    
    //purely display purpose atp, need to include a signup/cancel button eventually. the actual event params sort later

    return (
        <div className="event-card" onClick={onClick}>
            <h3>{event.name}</h3>
            <p>{event.event_date}</p>
            <p>{event.location}</p>
        </div>
    );
}

export default EventCard;