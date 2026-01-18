import EventCard from "./EventCard";
import "../event.css";

function EventList({ events, signedEventIds, onEventClick }) {

    return (
        <div className="event-list">
            { events.length === 0 ? (
                <p>No events for today</p>
            ) : (
                events.map(event => (
                    <EventCard
                        key={event.eid}
                        event={event}
                        signed={signedEventIds.includes(event.eid)}
                        onClick={() => onEventClick(event)}/>
                ))
            )}
        </div>
    );
}

export default EventList;