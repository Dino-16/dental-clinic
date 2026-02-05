import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [bookings, setBookings] = useState(() => {
        const savedBookings = localStorage.getItem('smilecare_bookings');
        return savedBookings ? JSON.parse(savedBookings) : [];
    });

    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('smilecare_messages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });

    // Fetch from Supabase on load
    useEffect(() => {
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
        const subscription = supabase
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

        return () => {
            supabase.removeChannel(subscription);
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

    return (
        <BookingContext.Provider value={{ bookings, addBooking, messages, addMessage, deleteBooking }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBookings = () => useContext(BookingContext);
