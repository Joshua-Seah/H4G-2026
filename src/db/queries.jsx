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
}

/**
 * Function to get user profile information for gsheets
 * @param {string} userId 
 * @returns json object of user profile {first_name, last_name, role}
 */
export async function getUserProfile(userId) {
    const { data, error } = await db
        .from('users')
        .select('firstname, lastname, role')
        .eq('uid', userId)
        .single();
    if (error) {
        console.error("Error fetching USER PROFILE", error.message);
        return null;
    }
    return data;
}

/**
 * Upload file directly to event-background bucket root
 * @param {File} file - File from input
 * @param {string} [customName] - Optional custom filename, else timestamp-random
 * @returns {string} Public URL or null
 */
export async function uploadFile(file, customName = null) {
  if (!file) {
    console.warn('No file provided');
    return null;
  }

  const fileExt = file.name.split('.').pop();
  const fileName = customName || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const filePath = fileName;  // Root - no folder prefix

  try {
    const { data: uploadData, error: uploadError } = await db.storage
      .from('event-background')  // Upload bucket
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // SAME bucket for URL
    const { data: urlData } = db.storage
      .from('event-background')  // ← Fix: was 'public-files'
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    return null;
  }
}
