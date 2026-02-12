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

    const [services, setServices] = useState([]);
    const [patients, setPatients] = useState([]);
    const [emrRecords, setEmrRecords] = useState([]);

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
        if (!supabase) {
            // Fallback for services if Supabase is disabled
            setServices([
                'AI Bot Reservation',
                'General Dentistry',
                'Cosmetic Studio',
                'AI Diagnostics',
                'Emergency Care',
                'Restorative Care',
                'Oral Surgery'
            ]);
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch Bookings
                const { data: bData, error: bError } = await supabase
                    .from('bookings')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (bError) throw bError;
                if (bData) {
                    const mappedData = bData.map(b => ({
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

                // Fetch Services
                const { data: sData, error: sError } = await supabase
                    .from('services')
                    .select('*')
                    .order('name', { ascending: true });

                if (sError) throw sError;
                if (sData) {
                    setServices(sData.map(s => s.name));
                }

                // Fetch Patients
                const { data: pData, error: pError } = await supabase
                    .from('patients')
                    .select('*')
                    .order('full_name', { ascending: true });

                if (pError) throw pError;
                if (pData) setPatients(pData);

                // Fetch EMR Records
                const { data: eData, error: eError } = await supabase
                    .from('emr_records')
                    .select('*, patients(full_name)')
                    .order('visit_date', { ascending: false });

                if (eError) throw eError;
                if (eData) setEmrRecords(eData);

            } catch (err) {
                console.log('Supabase fetch error:', err.message);
                // Fallback for services
                setServices([
                    'AI Bot Reservation',
                    'General Dentistry',
                    'Cosmetic Studio',
                    'AI Diagnostics',
                    'Emergency Care',
                    'Restorative Care',
                    'Oral Surgery'
                ]);
            }
        };

        fetchData();

        // Subscribe to real-time changes
        let bookingsSub = null, servicesSub = null, patientsSub = null, emrSub = null;

        try {
            bookingsSub = supabase
                .channel('public:bookings')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchData())
                .subscribe();

            servicesSub = supabase
                .channel('public:services')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => fetchData())
                .subscribe();

            patientsSub = supabase
                .channel('public:patients')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => fetchData())
                .subscribe();

            emrSub = supabase
                .channel('public:emr_records')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'emr_records' }, () => fetchData())
                .subscribe();

        } catch (err) {
            console.error('Supabase subscription error:', err.message);
        }

        return () => {
            if (supabase) {
                supabase.removeChannel(bookingsSub);
                supabase.removeChannel(servicesSub);
                supabase.removeChannel(patientsSub);
                supabase.removeChannel(emrSub);
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
        setBookings((prev) => [booking, ...prev]);
        if (!supabase) return;
        try {
            await supabase.from('bookings').insert([{
                patient_name: booking.name,
                service: booking.service,
                booking_date: booking.date,
                booking_time: booking.time,
                status: booking.status || 'Confirmed'
            }]);
        } catch (err) { console.error('Error saving booking:', err.message); }
    };

    const addMessage = (message) => setMessages((prev) => [message, ...prev]);

    const deleteBooking = async (id) => {
        setBookings((prev) => prev.filter(b => b.id !== id));
        if (!supabase) return;
        try { await supabase.from('bookings').delete().eq('id', id); }
        catch (err) { console.error('Error deleting booking:', err.message); }
    };

    const updateBooking = async (id, updatedFields) => {
        setBookings((prev) => prev.map(b => b.id === id ? { ...b, ...updatedFields } : b));
        if (!supabase) return;
        try {
            await supabase.from('bookings').update({
                patient_name: updatedFields.name,
                service: updatedFields.service,
                booking_date: updatedFields.date,
                booking_time: updatedFields.time,
                status: updatedFields.status
            }).eq('id', id);
        } catch (err) { console.error('Error updating booking:', err.message); }
    };

    const addService = async (name) => {
        if (!name) return;
        setServices(prev => [...prev, name].sort());
        if (!supabase) return;
        try { await supabase.from('services').insert([{ name }]); }
        catch (err) { console.error('Error adding service:', err.message); }
    };

    const updateService = async (oldName, newName) => {
        if (!oldName || !newName) return;
        setServices(prev => prev.map(s => s === oldName ? newName : s).sort());
        if (!supabase) return;
        try { await supabase.from('services').update({ name: newName }).eq('name', oldName); }
        catch (err) { console.error('Error updating service:', err.message); }
    };

    const deleteService = async (name) => {
        if (!name) return;
        setServices(prev => prev.filter(s => s !== name));
        if (!supabase) return;
        try { await supabase.from('services').delete().eq('name', name); }
        catch (err) { console.error('Error deleting service:', err.message); }
    };

    // Patient and EMR CRUD
    const addPatient = async (patient) => {
        if (!supabase) return;
        try { await supabase.from('patients').insert([patient]); }
        catch (err) { console.error('Error adding patient:', err.message); }
    };

    const updatePatient = async (id, patient) => {
        if (!supabase) return;
        try { await supabase.from('patients').update(patient).eq('id', id); }
        catch (err) { console.error('Error updating patient:', err.message); }
    };

    const deletePatient = async (id) => {
        if (!supabase) return;
        try { await supabase.from('patients').delete().eq('id', id); }
        catch (err) { console.error('Error deleting patient:', err.message); }
    };

    const addEmrRecord = async (record) => {
        if (!supabase) return;
        try { await supabase.from('emr_records').insert([record]); }
        catch (err) { console.error('Error adding emr:', err.message); }
    };

    const updateEmrRecord = async (id, record) => {
        if (!supabase) return;
        try { await supabase.from('emr_records').update(record).eq('id', id); }
        catch (err) { console.error('Error updating emr:', err.message); }
    };

    const deleteEmrRecord = async (id) => {
        if (!supabase) return;
        try { await supabase.from('emr_records').delete().eq('id', id); }
        catch (err) { console.error('Error deleting emr:', err.message); }
    };

    return (
        <BookingContext.Provider value={{
            bookings, addBooking, messages, addMessage, deleteBooking, updateBooking,
            allServices: services, addService, updateService, deleteService,
            patients, addPatient, updatePatient, deletePatient,
            emrRecords, addEmrRecord, updateEmrRecord, deleteEmrRecord
        }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBookings = () => useContext(BookingContext);
