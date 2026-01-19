// const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

// if (!GOOGLE_SCRIPT_URL) {
//   throw new Error("Missing Google Sheets URL in environment variables.");
// }

// const sendToSheet = async (payload) => {
//   await fetch(GOOGLE_SCRIPT_URL, {
//     method: "POST",
//     mode: "no-cors",
//     body: JSON.stringify(payload),
//   });
// };

// export const ensureSheetExists = async (y, m) => {
//     await sendToSheet({
//         action: "ensure_month",
//         year: y,
//         month: m
//     });
//     console.log("Sent command to ensure sheet exists.");
// }

// // 1. ADD EVENT
// export const addEvent = async (eventData) => {
//   // eventData expects: { date: "2026-02-06", eventName, location, details, startTime, endTime, max, quota }
//   await sendToSheet({
//     action: "add_event",
//     ...eventData
//   });
// };

// // 2. REMOVE EVENT
// export const removeEvent = async (date, eventName) => {
//   await sendToSheet({
//     action: "remove_event",
//     date: date,
//     eventName: eventName
//   });
// };

// // 3, 4, 5, 6. ADD/REMOVE PERSON
// // Combined into one function for simplicity, but you can wrap them if you prefer.
// export const updatePerson = async (mode, date, eventName, personName, key) => {
//   // mode: "add" or "remove"
//   // key: "V" (Volunteer) or "P" (Participant)
//   await sendToSheet({
//     action: "update_person",
//     mode: mode,
//     date: date,
//     eventName: eventName,
//     personName: personName,
//     key: key
//   });
// };

// // --- WRAPPERS FOR SPECIFIC REQUESTS ---
// export const addVolunteer = (date, event, name) => updatePerson("add", date, event, name, "V");
// export const removeVolunteer = (date, event, name) => updatePerson("remove", date, event, name, "V");
// export const addParticipant = (date, event, name) => updatePerson("add", date, event, name, "P");
// export const removeParticipant = (date, event, name) => updatePerson("remove", date, event, name, "P");