import { useNavigate } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Calendar as CalendarIcon,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    RefreshCw,
    Plus,
    ChevronLeft,
    ChevronRight,
    Stethoscope,
    Bell,
    Search,
    CheckCircle2,
    Clock,
    TrendingUp,
    ExternalLink,
    Trash2
} from 'lucide-react';
import { initGoogleApi, syncBookingToGoogleCalendar, listUpcomingEvents } from '../utils/googleCalendar';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    parseISO
} from 'date-fns';

function Dashboard() {
    const { bookings, deleteBooking } = useBookings();
    const navigate = useNavigate();
    const [isSyncing, setIsSyncing] = useState(false);
    const [apiReady, setApiReady] = useState(false);
    const [googleEvents, setGoogleEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [viewMode, setViewMode] = useState('calendar');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [activeTab, setActiveTab] = useState('Overview');

    useEffect(() => {
        const auth = localStorage.getItem('smilecare_auth');
        if (!auth) {
            navigate('/login');
        }

        initGoogleApi()
            .then(() => {
                setApiReady(true);
                listUpcomingEvents()
                    .then(events => setGoogleEvents(events || []))
                    .catch(e => console.error('Initial fetch failed:', e));
            })
            .catch((err) => console.error('Error initializing Google API:', err));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('smilecare_auth');
        navigate('/login');
    };

    const fetchGoogleEvents = async () => {
        if (!apiReady) return;
        setLoadingEvents(true);
        try {
            const events = await listUpcomingEvents();
            setGoogleEvents(events || []);
        } catch (err) {
            console.error('Failed to fetch events:', err);
        } finally {
            setLoadingEvents(false);
        }
    };

    const syncToGoogleCalendar = async () => {
        if (!apiReady) return;
        if (bookings.length === 0) return;

        setIsSyncing(true);
        try {
            await syncBookingToGoogleCalendar(bookings[0]);
            fetchGoogleEvents();
        } catch (err) {
            console.error('Sync failed:', err);
        } finally {
            setIsSyncing(false);
        }
    };

    const navItems = [
        { name: 'Overview', icon: <LayoutDashboard size={20} /> },
        { name: 'Appointments', icon: <CalendarIcon size={20} /> },
        { name: 'Patients', icon: <Users size={20} /> },
        { name: 'Messages', icon: <MessageSquare size={20} /> },
        { name: 'Settings', icon: <Settings size={20} /> },
    ];

    const renderOverview = () => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Bookings', value: bookings.length, icon: <CalendarIcon size={24} />, color: 'bg-blue-50 text-blue-600' },
                    { label: 'Cloud Events', value: googleEvents.length, icon: <RefreshCw size={24} />, color: 'bg-sky-50 text-sky-600' },
                    { label: 'Total Patients', value: new Set(bookings.map(b => b.name)).size, icon: <Users size={24} />, color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'Live Queries', value: '2', icon: <MessageSquare size={24} />, color: 'bg-indigo-50 text-indigo-600' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-lg hover:shadow-slate-100 transition-all duration-300">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                            <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                        </div>
                        <div className={`h-14 w-14 rounded-2xl ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>{stat.icon}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Activity</h3>
                            <p className="text-sm text-slate-400 font-medium">Real-time AI booking stream</p>
                        </div>
                        <button className="text-xs font-bold text-sky-600 flex items-center gap-1">View All <ChevronRight size={14} /></button>
                    </div>
                    <div className="space-y-6">
                        {bookings.length === 0 ? (
                            <p className="text-slate-400 text-sm font-medium italic">No activity recorded today.</p>
                        ) : bookings.slice(0, 4).map((b, i) => (
                            <div key={i} className="flex items-center gap-5 p-4 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="h-12 w-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
                                    <Clock size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900">New reservation: <span className="text-sky-600">{b.service}</span></p>
                                    <p className="text-xs text-slate-500 font-medium">Patient: {b.name} · {b.date}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">Confirmed</div>
                                    <button
                                        onClick={() => deleteBooking(b.id)}
                                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                        title="Delete Booking"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-950 p-8 rounded-[40px] text-white shadow-2xl shadow-slate-200 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8 border border-white/10">
                            <TrendingUp size={28} className="text-sky-400" />
                        </div>
                        <h3 className="text-2xl font-extrabold tracking-tight">Cloud Sync Optimize</h3>
                        <p className="mt-4 text-slate-400 text-sm leading-relaxed font-medium">
                            Keep your Google Calendar in sync to avoid scheduling conflicts and automate patient reminders.
                        </p>
                    </div>
                    <button
                        onClick={syncToGoogleCalendar}
                        disabled={isSyncing}
                        className="mt-10 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 transition-all px-8 py-4 rounded-2xl text-sm font-black text-center flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 relative z-10"
                    >
                        {isSyncing ? <RefreshCw size={20} className="animate-spin" /> : <ExternalLink size={20} />}
                        {isSyncing ? 'Syncing...' : 'Run Optimize'}
                    </button>
                </div>
            </div>
        </motion.div>
    );

    const renderPatients = () => {
        const uniquePatients = Array.from(new Set(bookings.map(b => b.name))).map(name => {
            const patientBookings = bookings.filter(b => b.name === name);
            return {
                name,
                lastVisit: patientBookings[0].date,
                totalVisits: patientBookings.length,
                service: patientBookings[0].service
            };
        });

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm shadow-slate-100"
            >
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Patient Database</h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search patients..." className="bg-slate-50 border border-slate-100 rounded-full py-2.5 pl-10 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500 w-64" />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                <th className="px-10 py-6">Patient Identifier</th>
                                <th className="px-10 py-6">Visit Count</th>
                                <th className="px-10 py-6">Last Session</th>
                                <th className="px-10 py-6">Primary Goal</th>
                                <th className="px-10 py-6">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {uniquePatients.map((p, i) => (
                                <tr key={i} className="hover:bg-slate-50/70 transition group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                                                {p.name.charAt(0)}
                                            </div>
                                            <span className="font-extrabold text-slate-900">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6"><span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold text-slate-600">{p.totalVisits} sess.</span></td>
                                    <td className="px-10 py-6 text-slate-500 font-medium">{p.lastVisit}</td>
                                    <td className="px-10 py-6">
                                        <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-[10px] font-bold uppercase tracking-wider">{p.service}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <button className="text-sky-600 font-black text-xs hover:underline flex items-center gap-1">Details <ExternalLink size={12} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        );
    };

    const renderMessages = () => {
        const { messages } = useBookings();
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">AI Communication Hub</h3>
                        <p className="text-sm text-slate-400 font-medium">Real-time patient chat logs</p>
                    </div>
                    <span className="bg-sky-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{messages.length} Active</span>
                </div>
                {messages.length === 0 ? (
                    <div className="bg-white p-24 rounded-[40px] border border-dashed border-slate-200 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                            <MessageSquare size={40} />
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Inbox is empty</h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">AI-initiated patient conversations will stream here automatically.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {messages.map((msg) => (
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                key={msg.id}
                                className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-sky-500" />
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                                            <Sparkles size={20} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{msg.type}</span>
                                            <span className="text-xs font-bold text-slate-400">{msg.date} · {msg.timestamp}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-sky-600 hover:bg-sky-50 transition-colors"><Bell size={16} /></button>
                                    </div>
                                </div>
                                <p className="text-base text-slate-700 leading-relaxed font-semibold italic">"{msg.text}"</p>
                                <div className="mt-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="px-6 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Reply</button>
                                    <button className="px-6 py-2.5 border border-slate-100 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all">Archive</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        );
    };

    const renderSettings = () => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-8">
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-100">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600">
                        <Stethoscope size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Clinic Core Settings</h3>
                        <p className="text-sm text-slate-400 font-medium">Manage your clinic profile & availability</p>
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Enterprise Name</label>
                            <input type="text" defaultValue="SmileCare Dental Studio" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Opening Cycle</label>
                            <input type="text" defaultValue="08:30 AM" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Closing Cycle</label>
                            <input type="text" defaultValue="07:00 PM" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all" />
                        </div>
                    </div>
                    <button className="bg-slate-950 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all">Update Profiles</button>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <h4 className="text-lg font-extrabold text-slate-900 tracking-tight">Autonomous Agent</h4>
                        <p className="text-xs text-slate-400 font-medium">AI bot handles all primary reservations</p>
                    </div>
                    <div className="h-8 w-14 bg-emerald-500 rounded-full flex items-center px-1.5 shadow-inner">
                        <div className="h-5 w-5 bg-white rounded-full ml-auto shadow-md" />
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderCalendar = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm shadow-slate-100">
                <div className="flex items-center justify-between p-8 bg-white border-b border-slate-50">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{format(currentMonth, 'MMMM yyyy')}</h3>
                    <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-600"><ChevronLeft size={18} /></button>
                        <button onClick={() => setCurrentMonth(new Date())} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Today</button>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-600"><ChevronRight size={18} /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 border-b border-slate-50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="py-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {calendarDays.map((day, idx) => {
                        const dayEvents = googleEvents.filter(event =>
                            isSameDay(parseISO(event.start.dateTime || event.start.date), day)
                        );
                        const localBookings = bookings.filter(b => {
                            try { return isSameDay(new Date(b.date), day); } catch (e) { return false; }
                        });

                        return (
                            <div key={idx} className={`min-h-[140px] p-4 border-r border-b border-slate-50 transition-colors ${!isSameMonth(day, monthStart) ? 'bg-slate-50/20 opacity-40' : 'bg-white hover:bg-slate-50/50'}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`text-xs font-black tracking-tight ${isSameDay(day, new Date()) ? 'bg-sky-600 text-white w-7 h-7 flex items-center justify-center rounded-xl shadow-lg shadow-sky-200' : 'text-slate-400'}`}>
                                        {format(day, 'd')}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {dayEvents.map(event => (
                                        <div key={event.id} className="px-2.5 py-1.5 text-[9px] bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 truncate font-bold uppercase tracking-wider leading-none" title={event.summary}>
                                            {event.summary}
                                        </div>
                                    ))}
                                    {localBookings.map(b => (
                                        <div key={b.id} className="px-2.5 py-1.5 text-[9px] bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 truncate font-bold uppercase tracking-wider leading-none" title={`${b.service} - ${b.name}`}>
                                            {b.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-sky-100 selection:text-sky-900">
            {/* Sidebar */}
            <aside className="hidden w-72 flex-col bg-white border-r border-slate-100 lg:flex sticky top-0 h-screen">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
                            <Stethoscope size={24} />
                        </div>
                        <div>
                            <span className="text-xl font-black text-slate-900 tracking-tight block leading-none">SmileCare</span>
                            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">Admin Cloud</span>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 space-y-2 px-4">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold tracking-tight transition-all active:scale-[0.98] ${activeTab === item.name
                                ? 'bg-slate-950 text-white shadow-xl shadow-slate-200'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            {item.icon}
                            {item.name}
                        </button>
                    ))}
                </nav>
                <div className="p-6 border-t border-slate-50">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-[0.98]"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{activeTab}</h2>
                            {activeTab === 'Appointments' && (
                                <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                                    <button
                                        onClick={() => setViewMode('calendar')}
                                        className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'calendar' ? 'bg-white shadow-md text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Calendar
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Activity
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 mr-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Online</span>
                            </div>
                            <button
                                onClick={fetchGoogleEvents}
                                disabled={loadingEvents || !apiReady}
                                className={`h-11 w-11 flex items-center justify-center rounded-2xl border border-slate-100 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-sky-600 active:scale-95 ${loadingEvents ? 'opacity-50' : ''}`}
                                title="Refresh Google Calendar"
                            >
                                <RefreshCw size={18} className={loadingEvents ? 'animate-spin' : ''} />
                            </button>
                            <button
                                onClick={() => setActiveTab('Overview')}
                                className="h-11 w-11 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-500 shadow-sm transition-all hover:text-sky-600 hover:bg-slate-50 active:scale-95"
                            >
                                <Bell size={18} />
                            </button>
                            <div className="w-px h-8 bg-slate-100 mx-2" />
                            <div className="flex items-center gap-3 pl-2">
                                <div className="text-right">
                                    <p className="text-xs font-black text-slate-900 leading-none">Admin</p>
                                    <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">Master Studio</p>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-slate-200">A</div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10 max-w-[1600px] mx-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === 'Overview' && <div key="overview">{renderOverview()}</div>}
                        {activeTab === 'Appointments' && (
                            <div key="appointments">
                                {viewMode === 'calendar' ? renderCalendar() : (
                                    <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-8">AI Reservation Ledger</h3>
                                        <div className="overflow-hidden rounded-3xl border border-slate-50">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                                        <th className="px-8 py-5">Patient Name</th>
                                                        <th className="px-8 py-5">Required Service</th>
                                                        <th className="px-8 py-5">Scheduled Date</th>
                                                        <th className="px-8 py-5">Time Slot</th>
                                                        <th className="px-8 py-5">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 text-sm">
                                                    {bookings.length === 0 ? (
                                                        <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium italic">Empty ledger. No bookings yet.</td></tr>
                                                    ) : bookings.map((booking) => (
                                                        <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-8 py-5 font-black text-slate-900">{booking.name}</td>
                                                            <td className="px-8 py-5">
                                                                <span className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-bold uppercase tracking-wider">{booking.service}</span>
                                                            </td>
                                                            <td className="px-8 py-5 text-slate-500 font-medium">{booking.date}</td>
                                                            <td className="px-8 py-5 font-bold text-slate-900">{booking.time}</td>
                                                            <td className="px-8 py-5">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                                                                        <CheckCircle2 size={12} />
                                                                        Verified
                                                                    </div>
                                                                    <button
                                                                        onClick={() => deleteBooking(booking.id)}
                                                                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'Patients' && <div key="patients">{renderPatients()}</div>}
                        {activeTab === 'Messages' && <div key="messages">{renderMessages()}</div>}
                        {activeTab === 'Settings' && <div key="settings">{renderSettings()}</div>}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
