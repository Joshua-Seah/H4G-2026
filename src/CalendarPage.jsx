import {useState} from 'react';
import Calendar from 'react-calendar';
import Modal from 'react-modal';
import 'react-calendar/dist/Calendar.css';
import './CalendarPage.css'

Modal.setAppElement("#root");

//this needs to be retrieved from staff side input for calendar month design
const overlayTemp = {
    0: null
};

function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [pinnedDates, setPinnedDates] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

    const handleSelectDate = (date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    }

    const handleSignup = () => {
        if (!selectedDate) return;
        
        const dateString = selectedDate.toDateString();

        setPinnedDates(prev => 
            prev.includes(dateString) ? prev : [...prev, dateString]
        );

        setIsModalOpen(false);
    }

    const tileContent = ({ date, view }) => {
        if (view === "month" && pinnedDates.includes(date.toDateString())) {
            return <div className="pinned-dot"></div>;
        }
        return null;
    };

    //match overlay by month, need to match by month year eventually!!!!!! hash feat
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
                tileContent={tileContent}
                onActiveStartDateChange={({ activeStartDate }) => 
                    setCurrentMonth(activeStartDate.getMonth())
                }
            />

            <Modal
                //modal is popup, need to include more details, can separate if need be
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="modal"
                overlayClassName="overlay">

                <h1>Content temp</h1>
                <button onClick={handleSignup}> Sign Up </button>
                <button onClick={() => setIsModalOpen(false)}> X </button>
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