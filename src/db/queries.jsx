import { db } from './supabase-client.jsx';

/**
 * Function to get all events from the database
 * @returns json array of all events, each event can be accessed via index
 */
export async function getAllEvents() {
    const { data, error } = await db.from('events').select('*');
    if (error) {
        console.error("Error fetching ALL EVENTS", error.message);
    }
    console.log('Fetched all events:', data);
    return data;
}

/**
 * Function to get events for a specific date
 * @param {string} date - The date to filter events by (format: 'YYYY-MM-DD')
 * @returns json array of events for the specified date
 */
export async function getEventsByDate(date) {
    const { data, error } = await db
        .from('events')
        .select('*')
        .eq('event_date', date);
    if (error) {
        console.error("Error fetching EVENTS BY DATE", error.message);
    }
    console.log(`Fetched events for date ${date}:`, data);
    return data;
}

/**
 * Function to add a new event to the database
 * @param {object} event - The event object to add
 * @returns json object of the added event
 */
export async function addEvent(event) {
    const { data, error } = await db
        .from('events')
        .insert(event)
        .select()
        .single();
    if (error) {
        console.error("Error adding EVENT", error.message);
    }
    console.log('Added event:', data);
    return data;
}

/**
 * Function to delete an event from the database
 * @param {string} eventId 
 */
export async function deleteEvent(eventId) {
    const { data, error } = await db
        .from('events')
        .delete()
        .eq('id', eventId);
    if (error) {
        console.error("Error deleting EVENT", error.message);
    }
    console.log('Deleted event with ID:', eventId);
}
