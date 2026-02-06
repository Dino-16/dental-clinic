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
    Trash2,
    Sparkles,
    ArrowRight,
    X,
    ShieldCheck,
    Menu
} from 'lucide-react';
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
    const [viewMode, setViewMode] = useState('calendar');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [activeTab, setActiveTab] = useState('Overview');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const auth = localStorage.getItem('smilecare_auth');
        if (!auth) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('smilecare_auth');
        navigate('/login');
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
                    { label: 'Total Bookings', value: bookings.length, icon: <CalendarIcon size={20} />, color: 'bg-blue-50 text-blue-600' },
                    {
                        label: 'Confirmed Today',
                        value: bookings.filter(b => {
                            try {
                                if (!b.date) return false;
                                let bookingDate;
                                const dateStr = String(b.date).trim();

                                if (dateStr.includes('-') && dateStr.split('-').length === 3) {
                                    const [y, m, d] = dateStr.split('-').map(Number);
                                    bookingDate = new Date(y, m - 1, d);
                                } else {
                                    bookingDate = new Date(dateStr);
                                }

                                if (isNaN(bookingDate.getTime())) {
                                    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                                    const match = dateStr.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d+)/i);
                                    if (match) {
                                        const monthIdx = months.indexOf(match[1].toLowerCase().substring(0, 3));
                                        const dayNum = parseInt(match[2]);
                                        bookingDate = new Date(new Date().getFullYear(), monthIdx, dayNum);
                                    }
                                }

                                return isSameDay(bookingDate, new Date());
                            } catch (e) {
                                return false;
                            }
                        }).length,
                        icon: <CheckCircle2 size={20} />,
                        color: 'bg-blue-50 text-blue-600'
                    },
                    { label: 'Total Patients', value: new Set(bookings.map(b => b.name)).size, icon: <Users size={20} />, color: 'bg-teal-50 text-teal-600' },
                    { label: 'AI Responses', value: '48', icon: <Sparkles size={20} />, color: 'bg-amber-50 text-amber-600' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300">
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="mt-1 text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                        </div>
                        <div className={`h-11 w-11 rounded-xl ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>{stat.icon}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Recent Activity</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Real-time AI stream</p>
                        </div>
                        <button onClick={() => setActiveTab('Appointments')} className="text-[10px] font-bold text-blue-600 flex items-center gap-1 uppercase tracking-widest">View Schedule <ChevronRight size={12} /></button>
                    </div>
                    <div className="space-y-4">
                        {bookings.length === 0 ? (
                            <p className="text-slate-400 text-xs font-medium italic p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">No activity recorded today.</p>
                        ) : bookings.slice(0, 4).map((b, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Clock size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-900">New reservation: <span className="text-blue-600">{b.service}</span></p>
                                    <p className="text-[10px] text-slate-500 font-bold">{b.name} · {b.date}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-widest">Confirmed</div>
                                    <button
                                        onClick={() => deleteBooking(b.id)}
                                        className="p-1.5 text-slate-300 hover:text-rose-600 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-3xl text-white shadow-xl shadow-slate-200 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 border border-white/10">
                            <TrendingUp size={24} className="text-blue-400" />
                        </div>
                        <h3 className="text-xl font-extrabold tracking-tight">Clinic Growth</h3>
                        <p className="mt-3 text-slate-400 text-xs leading-relaxed font-medium">
                            Your AI assistant has handled <span className="text-white font-bold">{bookings.length}</span> appointments this cycle with a 100% conversion rate.
                        </p>
                    </div>
                    <div className="mt-8 p-5 rounded-2xl bg-white/5 border border-white/10 relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Success Rate</span>
                            <span className="text-xs font-black text-blue-400">98.2%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '98.2%' }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderPatients = () => {
        const uniquePatients = Array.from(new Set(bookings.map(b => b.name || 'Unknown'))).map(name => {
            const patientBookings = bookings.filter(b => (b.name || 'Unknown') === name);
            if (patientBookings.length === 0) return null;
            return {
                name,
                lastVisit: patientBookings[0]?.date || 'No Date',
                totalVisits: patientBookings.length,
                service: patientBookings[0]?.service || 'General'
            };
        }).filter(Boolean);

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-blue-100 overflow-hidden shadow-sm shadow-blue-100/50"
            >
                <div className="p-6 border-b border-blue-100 flex items-center justify-between bg-white">
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Patient Database</h3>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
                            <input type="text" placeholder="Search patients..." className="bg-blue-50 border border-blue-100 rounded-xl py-2 pl-9 pr-4 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-56 font-medium placeholder:text-blue-400" />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-blue-600 text-[9px] font-bold text-white uppercase tracking-widest">
                                <th className="px-8 py-4 first:rounded-tl-xl">Patient Identifier</th>
                                <th className="px-8 py-4">Visit Count</th>
                                <th className="px-8 py-4">Last Session</th>
                                <th className="px-8 py-4">Primary Goal</th>
                                <th className="px-8 py-4 text-right last:rounded-tr-xl">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-100 text-[13px] bg-white">
                            {uniquePatients.map((p, i) => (
                                <tr key={i} className="hover:bg-blue-50 transition group bg-white">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-blue-600 group-hover:bg-blue-200 transition-colors">
                                                {p.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-900">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4"><span className="bg-blue-100 px-2 py-0.5 rounded-lg text-[11px] font-bold text-blue-700">{p.totalVisits} sess.</span></td>
                                    <td className="px-8 py-4 text-slate-600 font-medium">{p.lastVisit}</td>
                                    <td className="px-8 py-4">
                                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest">{p.service}</span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedPatient(p)}
                                            className="text-blue-600 font-bold text-[11px] hover:underline inline-flex items-center gap-1 cursor-pointer uppercase tracking-widest hover:text-blue-700 transition-colors"
                                        >
                                            Details <ExternalLink size={11} />
                                        </button>
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
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">AI Communication Hub</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Real-time patient chat logs</p>
                    </div>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{messages.length} Active</span>
                </div>
                {messages.length === 0 ? (
                    <div className="bg-white p-16 rounded-3xl border border-dashed border-slate-200 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <MessageSquare size={32} />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 mb-1">Inbox is empty</h3>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium leading-relaxed">AI-initiated patient conversations will stream here automatically.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {messages.map((msg) => (
                            <motion.div
                                whileHover={{ scale: 1.005 }}
                                key={msg.id}
                                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Sparkles size={18} />
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{msg.type}</span>
                                            <span className="text-[10px] font-bold text-slate-400">{msg.date} · {msg.timestamp}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-colors"><Bell size={14} /></button>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed font-semibold italic">"{msg.text}"</p>
                                <div className="mt-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="px-4 py-2 bg-slate-950 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Reply</button>
                                    <button className="px-4 py-2 border border-slate-100 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all">Archive</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        );
    };

    const renderSettings = () => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <Stethoscope size={22} />
                    </div>
                    <div>
                        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Clinic Core Settings</h3>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Manage your profile & accessibility</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="col-span-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Enterprise Name</label>
                            <input type="text" defaultValue="SmileCare Dental Studio" className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-[13px] font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                        </div>
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Opening Cycle</label>
                            <input type="text" defaultValue="08:30 AM" className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-[13px] font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                        </div>
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Closing Cycle</label>
                            <input type="text" defaultValue="07:00 PM" className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-[13px] font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                        </div>
                    </div>
                    <button className="bg-slate-950 text-white px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 shadow-md shadow-slate-100 transition-all active:scale-95">Update Profiles</button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <h4 className="text-base font-extrabold text-slate-900 tracking-tight">Autonomous Agent</h4>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">AI bot handles all primary reservations</p>
                    </div>
                    <div className="h-7 w-12 bg-blue-500 rounded-full flex items-center px-1 shadow-inner">
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
            <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm shadow-slate-100">
                <div className="flex items-center justify-between p-6 bg-white border-b border-slate-50">
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{format(currentMonth, 'MMMM yyyy')}</h3>
                    <div className="flex items-center gap-2.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 bg-white shadow-sm border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"><ChevronLeft size={16} /></button>
                        <button onClick={() => setCurrentMonth(new Date())} className="px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Today</button>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 bg-white shadow-sm border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"><ChevronRight size={16} /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 border-b border-slate-50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="py-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {calendarDays.map((day, idx) => {
                        const localBookings = bookings.filter(b => {
                            try {
                                if (!b.date) return false;

                                let bookingDate;
                                const dateStr = String(b.date).trim();

                                // 1. Handle YYYY-MM-DD (prevents timezone shifts)
                                if (dateStr.includes('-') && dateStr.split('-').length === 3) {
                                    const [y, m, d] = dateStr.split('-').map(Number);
                                    bookingDate = new Date(y, m - 1, d);
                                } else {
                                    bookingDate = new Date(dateStr);
                                }

                                // 2. Fallback for natural language like "Feb 6 this week"
                                if (isNaN(bookingDate.getTime())) {
                                    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                                    const match = dateStr.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d+)/i);

                                    if (match) {
                                        const monthIdx = months.indexOf(match[1].toLowerCase().substring(0, 3));
                                        const dayNum = parseInt(match[2]);
                                        bookingDate = new Date(new Date().getFullYear(), monthIdx, dayNum);
                                    }
                                }

                                if (isNaN(bookingDate.getTime())) return false;
                                return isSameDay(bookingDate, day);
                            } catch (e) {
                                return false;
                            }
                        });

                        return (
                            <div key={idx} className={`min-h-[120px] p-3 border-r border-b border-slate-50 transition-colors ${!isSameMonth(day, monthStart) ? 'bg-slate-50/20 opacity-40' : 'bg-white hover:bg-slate-50/50'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[11px] font-black tracking-tight ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-lg shadow-lg shadow-blue-200' : 'text-slate-400'}`}>
                                        {format(day, 'd')}
                                    </span>
                                </div>
                                <div className="space-y-1.5">
                                    {localBookings.map(b => (
                                        <div
                                            key={b.id}
                                            className="px-2 py-1.5 text-[8px] bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-black uppercase tracking-widest leading-none group relative overflow-hidden"
                                            title={`${b.service} - ${b.name}`}
                                        >
                                            <div className="flex flex-col gap-0.5 relative z-10">
                                                <span>{b.name}</span>
                                                <span className="text-[7px] opacity-60 font-bold">{b.time}</span>
                                            </div>
                                            <div className="absolute top-0 right-0 w-0.5 h-full bg-blue-500" />
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

    const renderPatientModal = () => {
        if (!selectedPatient) return null;
        const patientBookings = bookings.filter(b => (b.name || 'Unknown') === selectedPatient.name);

        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl"
                >
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xl">
                                {selectedPatient.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedPatient.name}</h3>
                                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Medical History</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedPatient(null)}
                            className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-950 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-8 max-h-[60vh] overflow-y-auto space-y-8">
                        <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Quick Stats</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                                    <div className="text-xl font-black text-slate-900">{selectedPatient.totalVisits}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">Total Sessions</div>
                                </div>
                                <div className="p-4 rounded-3xl bg-blue-50 border border-blue-100">
                                    <div className="text-xl font-black text-blue-600">{selectedPatient.service}</div>
                                    <div className="text-[10px] font-bold text-blue-600 uppercase">Primary Goal</div>
                                </div>
                                <div className="p-4 rounded-3xl bg-teal-50 border border-teal-100">
                                    <div className="text-xl font-black text-teal-600">Active</div>
                                    <div className="text-[10px] font-bold text-teal-600 uppercase">Status</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Appointment History</h4>
                            <div className="space-y-4">
                                {patientBookings.map((b, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 rounded-3xl border border-slate-100 hover:border-blue-100 transition-colors bg-white shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <CalendarIcon size={18} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{b.date}</div>
                                                <div className="text-xs text-slate-400">{b.service}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-slate-900">{b.time}</div>
                                            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{b.status || 'Verified'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-end">
                        <button
                            onClick={() => setSelectedPatient(null)}
                            className="px-12 py-4 rounded-2xl border border-slate-200 font-bold bg-white hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full bg-blue-300 border-r border-slate-100 z-50 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} hidden lg:block`}>
                <div className="flex flex-col h-full">
                    {/* Compact Logo Section */}
                    <div className="p-5 flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100 group">
                            <Stethoscope size={20} className="group-hover:scale-110 transition-transform" />
                        </div>
                        {isSidebarOpen && (
                            <div className="font-black text-slate-900 leading-none">
                                <span className="text-lg tracking-tight">SMILE</span>
                                <span className="text-blue-600">CARE</span>
                            </div>
                        )}
                    </div>

                    {/* Compact Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => setActiveTab(item.name)}
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group relative
                                    ${activeTab === item.name
                                        ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                                    }`}
                            >
                                <div className={`${activeTab === item.name ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'} transition-colors`}>
                                    {item.icon}
                                </div>
                                {isSidebarOpen && <span>{item.name}</span>}
                                {activeTab === item.name && isSidebarOpen && (
                                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-600 shadow-lg shadow-blue-200" />
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Compact Bottom Section */}
                    <div className="p-4 mt-auto border-t border-slate-50">
                        <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 mt-4 text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors rounded-xl ${!isSidebarOpen && 'justify-center'}`}>
                            <LogOut size={18} />
                            {isSidebarOpen && <span>Logout</span>}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 z-[60] w-72 flex flex-col bg-white lg:hidden"
                        >
                            <div className="p-8 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                        <Stethoscope size={24} />
                                    </div>
                                    <div>
                                        <span className="text-xl font-black text-slate-900 tracking-tight block leading-none">SmileCare</span>
                                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Admin Cloud</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMobileSidebarOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-900"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <nav className="flex-1 space-y-2 px-4">
                                {navItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            setActiveTab(item.name);
                                            setIsMobileSidebarOpen(false);
                                        }}
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
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <button
                                onClick={() => setIsMobileSidebarOpen(true)}
                                className="lg:hidden h-11 w-11 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-500 shadow-sm transition-all hover:text-blue-600 hover:bg-slate-50 active:scale-95 mr-2"
                            >
                                <Menu size={20} />
                            </button>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{activeTab}</h2>
                            {activeTab === 'Appointments' && (
                                <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                                    <button
                                        onClick={() => setViewMode('calendar')}
                                        className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'calendar' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Calendar
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Activity
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 mr-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Autonomous Sync Online</span>
                            </div>
                            <button
                                onClick={() => setActiveTab('Overview')}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 shadow-sm transition-all hover:text-blue-600 hover:bg-slate-50 active:scale-95"
                            >
                                <Bell size={16} />
                            </button>
                            <div className="w-px h-6 bg-slate-100 mx-1" />
                            <div className="flex items-center gap-2.5 pl-1">
                                <div className="hidden sm:block text-right">
                                    <p className="text-[11px] font-black text-slate-900 leading-none">Admin</p>
                                    <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Master Studio</p>
                                </div>
                                <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-slate-200">A</div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10 max-w-[1600px] mx-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === 'Overview' && <motion.div key="overview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderOverview()}</motion.div>}
                        {activeTab === 'Appointments' && (
                            <motion.div key="appointments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                {viewMode === 'calendar' ? renderCalendar() : (
                                    <div className="bg-white rounded-[40px] border border-blue-100 p-8 shadow-sm shadow-blue-100/50">
                                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-8">AI Reservation Ledger</h3>
                                        <div className="overflow-hidden rounded-2xl border border-blue-100">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                                                        <th className="px-8 py-5">Patient Name</th>
                                                        <th className="px-8 py-5">Required Service</th>
                                                        <th className="px-8 py-5">Scheduled Date</th>
                                                        <th className="px-8 py-5">Time Slot</th>
                                                        <th className="px-8 py-5">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-blue-100 text-sm bg-white">
                                                    {bookings.length === 0 ? (
                                                        <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium italic bg-white">Empty ledger. No bookings yet.</td></tr>
                                                    ) : bookings.map((booking) => (
                                                        <tr key={booking.id} className="hover:bg-blue-50 transition-colors bg-white">
                                                            <td className="px-8 py-5 font-black text-slate-900">{booking.name}</td>
                                                            <td className="px-8 py-5">
                                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">{booking.service}</span>
                                                            </td>
                                                            <td className="px-8 py-5 text-slate-600 font-medium">{booking.date}</td>
                                                            <td className="px-8 py-5 font-bold text-slate-900">{booking.time}</td>
                                                            <td className="px-8 py-5">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
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
                            </motion.div>
                        )}
                        {activeTab === 'Patients' && <motion.div key="patients" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderPatients()}</motion.div>}
                        {activeTab === 'Messages' && <motion.div key="messages" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderMessages()}</motion.div>}
                        {activeTab === 'Settings' && <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderSettings()}</motion.div>}
                    </AnimatePresence>
                </div>
            </main>
            {renderPatientModal()}
        </div>
    );
}

export default Dashboard;
