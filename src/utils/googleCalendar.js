/**
 * Google Calendar Integration Utility
 * This utility handles the OAuth2 flow and event creation for Google Calendar.
 * To use this in production, you must provide your own CLIENT_ID and API_KEY.
 */

const CLIENT_ID = '114088548200-1fsmnqbttqsjmko217jbghs5i63m2ks3.apps.googleusercontent.com'; // Replace with your Client ID
const API_KEY = 'AIzaSyA_9QSnaE_ndMZSzYt0Kwumwcd95jATNBI';   // Fixed: Removed leading 'Y'
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

let tokenClient;
let gapiInited = false;
let gisInited = false;

export const initGoogleApi = () => {
    return new Promise((resolve, reject) => {
        try {
            // Initialize GAPI
            window.gapi.load('client', async () => {
                await window.gapi.client.init({
                    apiKey: API_KEY,
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                });
                gapiInited = true;
                checkBeforeResolve(resolve);
            });

            // Initialize GSI
            tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: '', // defined later
            });
            gisInited = true;
            checkBeforeResolve(resolve);
        } catch (err) {
            reject(err);
        }
    });
};

const checkBeforeResolve = (resolve) => {
    if (gapiInited && gisInited) resolve();
};

export const syncBookingToGoogleCalendar = async (booking) => {
    return new Promise((resolve, reject) => {
        try {
            tokenClient.callback = async (resp) => {
                if (resp.error !== undefined) {
                    reject(resp);
                    return;
                }

                // Token acquired, now create event
                const event = {
                    'summary': `Dental Appointment: ${booking.service}`,
                    'location': 'SmileCare Dental Clinic',
                    'description': `Appointment for ${booking.name}. ID: ${booking.id}`,
                    'start': {
                        'dateTime': formatDateTime(booking.date, booking.time),
                        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
                    },
                    'end': {
                        'dateTime': formatDateTime(booking.date, booking.time, 1), // 1 hour later
                        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
                    },
                };

                try {
                    const request = window.gapi.client.calendar.events.insert({
                        'calendarId': 'primary',
                        'resource': event,
                    });
                    request.execute((event) => {
                        console.log('Event created: ' + event.htmlLink);
                        resolve(event);
                    });
                } catch (err) {
                    reject(err);
                }
            };

            if (window.gapi.client.getToken() === null) {
                // Prompt the user to select a Google Account and ask for consent to share their data
                // when establishing a new session.
                tokenClient.requestAccessToken({ prompt: 'consent' });
            } else {
                // Skip display of account chooser and consent dialog for an existing session.
                tokenClient.requestAccessToken({ prompt: '' });
            }
        } catch (err) {
            reject(err);
        }
    });
};

export const listUpcomingEvents = async () => {
    return new Promise((resolve, reject) => {
        try {
            tokenClient.callback = async (resp) => {
                if (resp.error !== undefined) {
                    reject(resp);
                    return;
                }

                try {
                    const response = await window.gapi.client.calendar.events.list({
                        'calendarId': 'primary',
                        'timeMin': (new Date()).toISOString(),
                        'showDeleted': false,
                        'singleEvents': true,
                        'maxResults': 10,
                        'orderBy': 'startTime',
                    });
                    const events = response.result.items;
                    resolve(events);
                } catch (err) {
                    reject(err);
                }
            };

            if (window.gapi.client.getToken() === null) {
                tokenClient.requestAccessToken({ prompt: 'consent' });
            } else {
                tokenClient.requestAccessToken({ prompt: '' });
            }
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * Helper to format date and time into ISO string
 */
function formatDateTime(dateStr, timeStr, addHours = 0) {
    // Simple parsing of "Month Day, Year" and "H:MM AM/PM"
    // Note: For a production app, use a library like date-fns or moment
    try {
        const dateTimeStr = `${dateStr} ${timeStr}`;
        const date = new Date(dateTimeStr);
        if (isNaN(date.getTime())) {
            // Fallback for demo if parsing fails
            const fallback = new Date();
            fallback.setHours(fallback.getHours() + addHours);
            return fallback.toISOString();
        }
        date.setHours(date.getHours() + addHours);
        return date.toISOString();
    } catch (e) {
        return new Date().toISOString();
    }
}
