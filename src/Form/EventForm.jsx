// this one will pull questions and info from DB to display

function EventForm({ event, onClose, onSubmit }) {

    return (
        <div className="event-form">
            <button className="close-button" onClick={onClose}> Close </button>
            <h2>{event.title}</h2>
            <p>Remaining event stuff</p>

            <button className="submit-button" onClick={onSubmit}>
                Sign Up
            </button>
        </div>
    );
}

export default EventForm;