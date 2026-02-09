import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [bookings, setBookings] = useState(() => {
        try {
            const savedBookings = localStorage.getItem('smilecare_bookings');
            return savedBookings ? JSON.parse(savedBookings) : [];
        } catch (e) {
            console.error('Failed to parse bookings from localStorage', e);
            return [];
        }
    });

    const [messages, setMessages] = useState(() => {
        try {
            const savedMessages = localStorage.getItem('smilecare_messages');
            return savedMessages ? JSON.parse(savedMessages) : [];
        } catch (e) {
            console.error('Failed to parse messages from localStorage', e);
            return [];
        }
    });

    // Fetch from Supabase on load
    useEffect(() => {
        if (!supabase) return;

        const fetchBookings = async () => {
            try {
                const { data, error } = await supabase
                    .from('bookings')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) {
                    // Map snake_case from DB to consistent camelCase for UI
                    const mappedData = data.map(b => ({
                        id: b.id,
                        name: b.patient_name,
                        service: b.service,
                        date: b.booking_date,
                        time: b.booking_time,
                        status: b.status,
                        timestamp: b.created_at
                    }));
                    setBookings(mappedData);
                }
            } catch (err) {
                console.log('Supabase fetch error (likely table not created yet):', err.message);
            }
        };

        fetchBookings();

        // Subscribe to real-time changes
        let subscription = null;
        try {
            subscription = supabase
                .channel('public:bookings')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, payload => {
                    const newBooking = {
                        id: payload.new.id,
                        name: payload.new.patient_name,
                        service: payload.new.service,
                        date: payload.new.booking_date,
                        time: payload.new.booking_time,
                        status: payload.new.status,
                        timestamp: payload.new.created_at
                    };
                    setBookings(prev => [newBooking, ...prev]);
                })
                .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'bookings' }, payload => {
                    setBookings(prev => prev.filter(b => b.id !== payload.old.id));
                })
                .subscribe();
        } catch (err) {
            console.error('Supabase subscription error:', err.message);
        }

        return () => {
            if (supabase && subscription) {
                supabase.removeChannel(subscription);
            }
        };
    }, []);

    // Also keep localStorage as a fallback/cache
    useEffect(() => {
        localStorage.setItem('smilecare_bookings', JSON.stringify(bookings));
    }, [bookings]);

    useEffect(() => {
        localStorage.setItem('smilecare_messages', JSON.stringify(messages));
    }, [messages]);

    const addBooking = async (booking) => {
        // Optimized for local feel
        setBookings((prev) => [booking, ...prev]);

        if (!supabase) return;

        // Persist to Supabase
        try {
            const { error } = await supabase
                .from('bookings')
                .insert([{
                    patient_name: booking.name,
                    service: booking.service,
                    booking_date: booking.date,
                    booking_time: booking.time,
                    status: booking.status || 'Confirmed'
                }]);

            if (error) throw error;
        } catch (err) {
            console.error('Error saving to Supabase:', err.message);
        }
    };

    const addMessage = (message) => {
        setMessages((prev) => [message, ...prev]);
    };

    const deleteBooking = async (id) => {
        // Optimistic update
        setBookings((prev) => prev.filter(b => b.id !== id));

        if (!supabase) return;

        try {
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error('Error deleting from Supabase:', err.message);
        }
    };

    const updateBooking = async (id, updatedFields) => {
        // Optimistic update
        setBookings((prev) => prev.map(b => b.id === id ? { ...b, ...updatedFields } : b));

        if (!supabase) return;

        try {
            const { error } = await supabase
                .from('bookings')
                .update({
                    patient_name: updatedFields.name,
                    service: updatedFields.service,
                    booking_date: updatedFields.date,
                    booking_time: updatedFields.time,
                    status: updatedFields.status
                })
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error('Error updating in Supabase:', err.message);
        }
    };

    const allServices = [
        'AI Bot Reservation',
        'General Dentistry',
        'Cosmetic Studio',
        'AI Diagnostics',
        'Emergency Care',
        'Restorative Care',
        'Oral Surgery'
    ];

    return (
        <BookingContext.Provider value={{ bookings, addBooking, messages, addMessage, deleteBooking, updateBooking, allServices }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBookings = () => useContext(BookingContext);
