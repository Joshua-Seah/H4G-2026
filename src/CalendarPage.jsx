import {useState} from 'react';
import Calendar from 'react-calendar';
import Modal from 'react-modal';
import 'react-calendar/dist/Calendar.css';
import './CalendarPage.css'

import { db } from './db/supabase-client.jsx';

import EventList from './components/EventList';
import EventForm from './Form/EventForm';

Modal.setAppElement("#root");

//this needs to be retrieved from staff side input for calendar month design
const overlayTemp = {
    0: null //this is fine for now as it is still january, need to rework this logic to cater to monthly(and by year) update to calendar
};

function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

    const handleSelectDate = async (date) => {
        setSelectedDate(date);
        setSelectedEvent(null); //refresh event selection

        const formattedDate = date.toLocaleDateString(); //date is in YYYY-MM-DD
        console.log(formattedDate);

        const { data, error } = await db.from("events").select("*").eq("event_date", formattedDate);

        if (error) {
            console.error("Error fetching event", error);
            setEvents([]); 
        } else {
            setEvents(data);
        }

        setIsModalOpen(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        setSelectedDate(null);
        console.log('success closed modal, end of line')
    }

    //match overlay by month, need to match by month year eventually!!!!!! hash feat (reexplore if image changes according to month shown)
    const overlay = overlayTemp[currentMonth] || "/assets/default-background.jpg";

    return (
        <div 
            className="calendar-container"
            style={{
                backgroundImage: `url(${overlay})`
                }}
        >
            
            <Calendar 
                onClickDay={handleSelectDate}
                showNeighboringMonth={false}
                //tileContent={tileContent}
                onActiveStartDateChange={({ activeStartDate }) => 
                    setCurrentMonth(activeStartDate.getMonth()) // this will return 0-11 index to be used for imaging later (might to to extend year as well?)
                }
            />

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="modal"
                overlayClassName="overlay">
                    {!selectedEvent ? (
                        <EventList
                            date={selectedDate}
                            events={events}
                            onEventClick={handleSelectEvent}/>
                    ) : (
                        <EventForm
                            event={selectedEvent}
                            onClose={closeModal}
                            onSubmit={() => {
                                //submission logic here (like pins and whatnot ~~~ need to rework pin logic) 
                                console.log('submit form success')
                                closeModal();
                            }}/>

                    )}
            </Modal>
        </div>
    );

    /* TODO: 
    1. on dateclick pull data date dependent from backend and display for that date
    2. month overlay needs to be month/year specific, correct overlay shld popup, use default if none exist (replace asset img on each submit for month/year)
    3. check pin works correctly
    4. Error message when request to check if able to signup (clashing dates) -> on try to signup, db check fail return error
    5. Need to make sure cannot sign up for event later than today
    */
}

export default CalendarPage;