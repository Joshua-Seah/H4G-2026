import {useState} from 'react';
import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import Modal from 'react-modal';
import 'react-calendar/dist/Calendar.css';
import './CalendarPage.css'

import { db } from './db/supabase-client.jsx';

import EventList from './components/EventList';
import EventForm from './Form/EventForm';
import SignedEventForm from './Form/SignedEventForm.jsx';

Modal.setAppElement("#root");

function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const [dateWithSignups, setDateWithSignups] = useState([]);
    const [signedEventIds, setSignedEventIds] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [overlay, setOverlay] = useState("/assets/default-background.jpg");
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSignedEventsAndDates = async () => {
            const {
                data: { user }
            } = await db.auth.getUser();

            if (!user) return;

            const { data: forms } = await db.from("forms").select("eid").eq("uid", user.id);
            if (!forms) return;

            const eids = forms.map(f => f.eid);
            setSignedEventIds(eids);

            const { data: eventsData } = await db.from("events").select("event_date, eid").in("eid", eids);
            if (!eventsData) return;

            const uniqueDates = [...new Set(eventsData  .map(e => e.event_date))];
            setDateWithSignups(uniqueDates);

        };

        fetchSignedEventsAndDates();
    }, []);

    const handleSelectDate = async (date) => {
        setSelectedDate(date);
        setSelectedEvent(null); //refresh event selection

        const formattedDate = date.toLocaleDateString('en-CA'); //date is in YYYY-MM-DD
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

    // Attempt to fetch overlay by month year naming from public asset
    const getOverlay = async (month, year) => {
        const mth = String(month + 1).padStart(2, "0"); //month index starts from 0 so +1, pad left with 0 if single digit
        const filename = `/assets/${mth}-${year}.jpg`;

        try {
            const res = await fetch(filename, {method: "HEAD"});
            return res.ok ? filename : "/assets/default-background.jpg"
        } catch {
            return "/assets/default-background.jpg";
        }
    }

    useEffect(() => {
        getOverlay(currentMonth, currentYear).then(setOverlay);
    }, [currentMonth, currentYear]);

    return (
        <div 
            className="calendar-container"
            style={{
                backgroundImage: `url(${overlay}), url(/assets/default-background.jpg)` //fallback if cannot fetch original
                }}
        >
            
            <Calendar 
                onClickDay={handleSelectDate}
                showNeighboringMonth={false}
                onActiveStartDateChange={({ activeStartDate }) => {
                    setCurrentMonth(activeStartDate.getMonth()); 
                    setCurrentYear(activeStartDate.getFullYear());
                }}
                tileClassName={({date, view}) => {
                    if (view === "month") {
                        const formatted = date.toLocaleDateString("en-CA");
                        if (dateWithSignups.includes(formatted)) {
                            return "signed-date";
                        }}
                        return null;
                    }}
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
                            signedEventIds={signedEventIds}
                            onEventClick={handleSelectEvent}/>
                    ) : (
                        signedEventIds.includes(selectedEvent.eid) ? (
                            <SignedEventForm
                                event={selectedEvent}
                                onClose={closeModal}
                                onCancel={()=> {
                                    setSignedEventIds(prev => 
                                        prev.filter(id => id !== selectedEvent.eid)
                                    );
                                    setDateWithSignups(prev => {
                                        const formattedDate = selectedEvent.event_date;
                                        const remainingSignedDate = events.filter(
                                            e => e.event_date === formattedDate && signedEventIds.includes(e.eid) && e.eid !== selectedEvent.eid
                                        );

                                        if (remainingSignedDate.length === 0) {
                                            return prev.filter(d => d !== formattedDate)
                                        }
                                        return prev;
                                    });
                                    closeModal();
                                }}
                            />
                        ) : (
                            <EventForm
                            event={selectedEvent}
                            onClose={closeModal}
                            onSubmit={() => {
                                console.log('submit form success')
                                setSignedEventIds(prev => [...prev, selectedEvent.eid]);
                                setDateWithSignups(prev => {
                                    const formattedDate = selectedEvent.event_date;
                                    if (!prev.includes(formattedDate)) {
                                        return [...prev, formattedDate];
                                    }
                                    return prev;
                                });
                                closeModal();
                            }}/>
                        )
                        

                    )}
            </Modal>
            {/* <button onClick={() => navigate('/staff-form')}>Create Event</button> */}
        </div>
    );

    /* TODO: 
    1. Need to format date into something readable
    2. month overlay needs to be month/year specific, correct overlay shld popup, use default if none exist (replace asset img on each submit for month/year)
    3. need to readjust the specs so overlay matches exact (pixel specific template?)
    4. Error message when request to check if able to signup (clashing dates) -> on try to signup, db check fail return error
    5. Need to make sure cannot sign up for event later than today
    */
}

export default CalendarPage;