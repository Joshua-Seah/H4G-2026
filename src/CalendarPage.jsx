import {useState} from 'react';
import Calendar from 'react-calendar';
import Modal from 'react-modal';
import 'react-calendar/dist/Calendar.css';
import './CalendarPage.css'

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

    const handleSelectDate = (date) => {
        setSelectedDate(date);
        setSelectedEvent(null); //refresh event selection

        const fetchedEvents = [
            //sample data (remember event is retrieved via date)
            {
                id: 'event1',
                title: 'testtitle1',
                date: 'testdate1',
                location: 'testloc1'
            },
            {
                id: 'event2',
                title: 'testtitle2',
                date: 'testdate2',
                location: 'testloc2'
            },
            
        ]; //!!!fetch from db using date db.fetch(date) or smth
        setEvents(fetchedEvents);

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
    */
}

export default CalendarPage;