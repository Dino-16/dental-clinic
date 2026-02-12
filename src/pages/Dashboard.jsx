import { useNavigate } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Calendar as CalendarIcon,
    Users,
    Settings,
    LogOut,
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
    Pencil,
    Sparkles,
    X,
    Menu,
    FileText,
    Plus,
    History,
    UserPlus,
    User
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
    subMonths
} from 'date-fns';

function Dashboard() {
    const {
        bookings, deleteBooking, addBooking, updateBooking,
        allServices, addService, updateService, deleteService,
        patients, addPatient, updatePatient, deletePatient,
        emrRecords, addEmrRecord, updateEmrRecord, deleteEmrRecord
    } = useBookings();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('calendar');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [activeTab, setActiveTab] = useState('Overview');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
    const [isEmrModalOpen, setIsEmrModalOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [editingEmr, setEditingEmr] = useState(null);
    const [editingService, setEditingService] = useState(null);
    const [serviceFormName, setServiceFormName] = useState('');
    const [editingBooking, setEditingBooking] = useState(null);
    const [formName, setFormName] = useState('');
    const [formService, setFormService] = useState('');
    const [formDate, setFormDate] = useState('');
    const [formTime, setFormTime] = useState('');

    // Patient Form State
    const [patientForm, setPatientForm] = useState({
        full_name: '', email: '', phone: '', date_of_birth: '', gender: 'Other', address: '', medical_history: ''
    });

    // EMR Form State
    const [emrForm, setEmrForm] = useState({
        patient_id: '', visit_date: new Date().toISOString().split('T')[0], tooth_number: '', diagnosis: '', treatment_done: '', notes: '', dentist_name: ''
    });

    const handleServiceSubmit = (e) => {
        e.preventDefault();
        if (!serviceFormName.trim()) return;

        if (editingService) {
            updateService(editingService, serviceFormName.trim());
        } else {
            addService(serviceFormName.trim());
        }

        setIsServiceModalOpen(false);
        setServiceFormName('');
        setEditingService(null);
    };

    const openAddServiceModal = () => {
        setEditingService(null);
        setServiceFormName('');
        setIsServiceModalOpen(true);
    };

    const openEditServiceModal = (name) => {
        setEditingService(name);
        setServiceFormName(name);
        setIsServiceModalOpen(true);
    };

    const handleAddManual = (e) => {
        e?.preventDefault?.();
        if (!formName || !formService || !formDate || !formTime) return;
        const newBooking = {
            id: Date.now(),
            name: formName,
            service: formService,
            date: formDate,
            time: formTime,
            status: 'Confirmed'
        };
        addBooking(newBooking);
        resetForm();
        setIsAddModalOpen(false);
    };

    const handleEditManual = (e) => {
        e?.preventDefault?.();
        if (!editingBooking || !formName || !formService || !formDate || !formTime) return;
        updateBooking(editingBooking.id, {
            name: formName,
            service: formService,
            date: formDate,
            time: formTime,
            status: editingBooking.status || 'Confirmed'
        });
        resetForm();
        setIsEditModalOpen(false);
    };

    const resetForm = () => {
        setFormName('');
        setFormService('');
        setFormDate('');
        setFormTime('');
        setEditingBooking(null);
    };

    const openEditModal = (booking) => {
        setEditingBooking(booking);
        setFormName(booking.name);
        setFormService(booking.service);
        setFormDate(booking.date);
        setFormTime(booking.time);
        setIsEditModalOpen(true);
    };

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
        { name: 'Services', icon: <Stethoscope size={20} /> },
        { name: 'Patients', icon: <Users size={20} /> },
        { name: 'EMR', icon: <FileText size={20} /> },
        { name: 'Settings', icon: <Settings size={20} /> },
    ];

    const renderOverview = () => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {(() => {
                    const todayCount = bookings.filter(b => {
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
                    }).length;
                    const uniquePatients = new Set(bookings.map(b => b.name)).size;
                    const uniqueServices = new Set(bookings.map(b => b.service)).size;
                    const upcoming = bookings.filter(b => {
                        try {
                            if (!b.date) return false;
                            const dateStr = String(b.date).trim();
                            let d;
                            if (dateStr.includes('-') && dateStr.split('-').length === 3) {
                                const [y, m, day] = dateStr.split('-').map(Number);
                                d = new Date(y, m - 1, day);
                            } else {
                                d = new Date(dateStr);
                            }
                            return d.getTime() >= startOfWeek(new Date()).getTime();
                        } catch {
                            return false;
                        }
                    }).length;
                    const stats = [
                        { label: 'Upcoming Appointments', value: upcoming, icon: <CalendarIcon size={20} />, color: 'bg-blue-50 text-blue-600' },
                        { label: 'Today’s Bookings', value: todayCount, icon: <CheckCircle2 size={20} />, color: 'bg-blue-50 text-blue-600' },
                        { label: 'Unique Patients', value: uniquePatients, icon: <Users size={20} />, color: 'bg-blue-50 text-blue-600' },
                        { label: 'Services Active', value: uniqueServices, icon: <Stethoscope size={20} />, color: 'bg-blue-50 text-blue-600' },
                    ];
                    return stats.map((stat) => (
                        <div key={stat.label} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">{stat.icon}</div>
                            <div className="min-w-0">
                                <div className="text-xl text-slate-900 tracking-tight">{stat.value}</div>
                                <div className="text-[9px] text-slate-500 uppercase tracking-widest truncate">{stat.label}</div>
                            </div>
                        </div>
                    ));
                })()}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {(() => {
                    const weekStart = startOfWeek(new Date());
                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const dayCounts = new Array(7).fill(0);
                    bookings.forEach(b => {
                        try {
                            const dateStr = String(b.date || '').trim();
                            let d;
                            if (dateStr && dateStr.includes('-') && dateStr.split('-').length === 3) {
                                const [y, m, day] = dateStr.split('-').map(Number);
                                d = new Date(y, m - 1, day);
                            } else if (dateStr) {
                                d = new Date(dateStr);
                            } else {
                                d = new Date();
                            }
                            if (d.getTime() >= weekStart.getTime() && d.getTime() < endOfWeek(weekStart).getTime()) {
                                dayCounts[d.getDay()] += 1;
                            }
                        } catch { }
                    });
                    const maxDay = Math.max(1, ...dayCounts);
                    return (
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-normal text-slate-900 tracking-tight">Graph Analytics</h3>
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Live</span>
                            </div>
                            <div className="grid grid-cols-1 gap-8">
                                <div>
                                    <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-3">Appointments This Week</p>
                                    <div className="flex items-end gap-3 h-32 px-2">
                                        {dayCounts.map((c, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                                <div className="w-8 rounded-lg bg-slate-200" style={{ height: `${(c / maxDay) * 100}%` }} />
                                                <span className="text-[10px] text-slate-500">{days[i]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-normal text-slate-900 tracking-tight">Today Overview</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Bookings and status at a glance</p>
                        </div>
                        <button onClick={() => setActiveTab('Appointments')} className="text-[10px] text-blue-600 flex items-center gap-1 uppercase tracking-widest">View Schedule <ChevronRight size={12} /></button>
                    </div>
                    <div className="space-y-4">
                        {bookings.length === 0 ? (
                            <p className="text-slate-400 text-xs font-medium italic p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">No appointments booked today.</p>
                        ) : bookings.slice(0, 4).map((b, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                                    <Clock size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-900">New reservation: <span className="text-blue-600">{b.service}</span></p>
                                    <p className="text-[10px] text-slate-500">{b.name} · {b.date}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-[9px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-widest">Confirmed</div>
                                    <button
                                        onClick={() => openEditModal(b)}
                                        className="p-1.5 text-slate-300 hover:text-blue-600 transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => deleteBooking(b.id)}
                                        className="p-1.5 text-slate-300 hover:text-rose-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                                <TrendingUp size={20} />
                            </div>
                            <h3 className="text-lg font-normal text-slate-900 tracking-tight">AI Performance</h3>
                        </div>
                        <span className="text-xs text-slate-500">Live metrics</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Handled Appointments</span>
                            <span className="text-sm text-blue-600">{bookings.length}</span>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Success Rate</span>
                                <span className="text-xs text-blue-600">98.2%</span>
                            </div>
                            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
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
            </div>
        </motion.div>
    );

    const handlePatientSubmit = (e) => {
        e.preventDefault();
        if (editingPatient) {
            updatePatient(editingPatient.id, patientForm);
        } else {
            addPatient(patientForm);
        }
        setIsPatientModalOpen(false);
    };

    const handleEmrSubmit = (e) => {
        e.preventDefault();
        if (editingEmr) {
            updateEmrRecord(editingEmr.id, emrForm);
        } else {
            addEmrRecord(emrForm);
        }
        setIsEmrModalOpen(false);
    };

    const renderPatients = () => {
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
                        <h3 className="text-lg font-normal text-slate-900 tracking-tight">Patient Records</h3>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
                                <input type="text" placeholder="Search records..." className="bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-56 font-medium placeholder:text-slate-400" />
                            </div>
                            <button
                                onClick={() => { setEditingPatient(null); setPatientForm({ full_name: '', email: '', phone: '', date_of_birth: '', gender: 'Other', address: '', medical_history: '' }); setIsPatientModalOpen(true); }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                            >
                                <UserPlus size={14} /> Add Patient
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-100 text-[9px] text-slate-700 uppercase tracking-widest">
                                    <th className="px-8 py-4">Patient Name</th>
                                    <th className="px-8 py-4">Contact Info</th>
                                    <th className="px-8 py-4">Gender</th>
                                    <th className="px-8 py-4">Age</th>
                                    <th className="px-8 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-[13px] bg-white">
                                {patients.length === 0 ? (
                                    <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 italic">No patient records found.</td></tr>
                                ) : patients.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition group bg-white">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                                                    {p.full_name?.charAt(0)}
                                                </div>
                                                <span className="text-slate-900 font-medium">{p.full_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-slate-600 font-medium">{p.email || 'No Email'}</span>
                                                <span className="text-[11px] text-slate-400 font-bold tracking-tight">{p.phone || 'No Phone'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-slate-600 font-medium">{p.gender}</td>
                                        <td className="px-8 py-4 text-slate-600 font-medium">
                                            {p.date_of_birth ? Math.floor((new Date() - new Date(p.date_of_birth)) / 31557600000) : 'N/A'}
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditingPatient(p); setPatientForm(p); setIsPatientModalOpen(true); }}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => { if (window.confirm('Delete this patient?')) deletePatient(p.id); }}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderEMR = () => {
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                                <History size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-normal text-slate-900 tracking-tight">Electronic Medical Records</h3>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">Clinical History & Treatments</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setEditingEmr(null); setEmrForm({ patient_id: '', visit_date: new Date().toISOString().split('T')[0], tooth_number: '', diagnosis: '', treatment_done: '', notes: '', dentist_name: '' }); setIsEmrModalOpen(true); }}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                            <Plus size={14} /> New EMR Entry
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-100 text-[9px] text-slate-700 uppercase tracking-widest">
                                    <th className="px-8 py-4">Date</th>
                                    <th className="px-8 py-4">Patient</th>
                                    <th className="px-8 py-4">Tooth #</th>
                                    <th className="px-8 py-4">Treatment</th>
                                    <th className="px-8 py-4">Dentist</th>
                                    <th className="px-8 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-[13px] bg-white">
                                {emrRecords.length === 0 ? (
                                    <tr><td colSpan="6" className="px-8 py-20 text-center text-slate-400 italic">No medical records found. Create an entry to get started.</td></tr>
                                ) : emrRecords.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-50 transition group bg-white">
                                        <td className="px-8 py-4 text-slate-600 font-medium">{r.visit_date}</td>
                                        <td className="px-8 py-4">
                                            <span className="text-slate-900 font-bold">{r.patients?.full_name || 'Removed Patient'}</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            {r.tooth_number ? (
                                                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[11px] text-slate-600 border border-slate-200">
                                                    {r.tooth_number}
                                                </span>
                                            ) : <span className="text-slate-300">-</span>}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col max-w-xs">
                                                <span className="text-blue-600 font-bold uppercase text-[10px] tracking-wider">{r.treatment_done}</span>
                                                <span className="text-[11px] text-slate-500 line-clamp-1">{r.diagnosis}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-slate-600 italic">Dr. {r.dentist_name}</td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingEmr(r); setEmrForm(r); setIsEmrModalOpen(true); }}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => { if (window.confirm('Delete this record?')) deleteEmrRecord(r.id); }}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderServices = () => {
        const items = allServices.map(s => {
            const count = bookings.filter(b => (b.service || '').trim().toLowerCase() === s.toLowerCase()).length;
            return { name: s, count };
        });
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
                    <h3 className="text-lg font-normal text-slate-900 tracking-tight">Clinic Services</h3>
                    <button
                        onClick={openAddServiceModal}
                        className="px-4 py-2 text-[10px] bg-blue-600 text-white rounded-xl uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Add New Service
                    </button>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((svc) => (
                        <div key={svc.name} className="p-5 rounded-2xl bg-white border border-slate-100 hover:shadow-sm transition-all min-h-[140px] flex flex-col justify-between group">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            <Stethoscope size={18} />
                                        </div>
                                        <div className="text-slate-900 font-medium">{svc.name}</div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-700 text-[10px] border border-slate-200">{svc.count}</span>
                                </div>
                                <div className="text-[11px] text-slate-500 leading-relaxed">Available for booking through AI assistant and manual entry.</div>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEditServiceModal(svc.name)}
                                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                    title="Edit Service"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm(`Are you sure you want to delete "${svc.name}"?`)) {
                                            deleteService(svc.name);
                                        }
                                    }}
                                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                                    title="Delete Service"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    };

    const renderAddModal = () => {
        if (!isAddModalOpen) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-white rounded-[28px] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100"
                >
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
                        <h3 className="text-lg text-slate-900">Add Appointment</h3>
                        <button
                            onClick={() => { setIsAddModalOpen(false); resetForm(); }}
                            className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <form onSubmit={handleAddManual} className="p-6 grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="Patient Name"
                            required
                            className="bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm"
                        />
                        <div>
                            <label className="block text-[10px] text-slate-400 uppercase tracking-widest ml-1 mb-2">Service</label>
                            <select
                                value={formService}
                                onChange={(e) => setFormService(e.target.value)}
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm"
                            >
                                <option value="" disabled>Select a service</option>
                                {allServices.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="date"
                                value={formDate}
                                onChange={(e) => setFormDate(e.target.value)}
                                required
                                className="bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm"
                            />
                            <input
                                type="time"
                                value={formTime}
                                onChange={(e) => setFormTime(e.target.value)}
                                required
                                className="bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => { setIsAddModalOpen(false); resetForm(); }}
                                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                                Add
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        );
    };

    const renderEditModal = () => {
        if (!isEditModalOpen) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-white rounded-[28px] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100"
                >
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
                        <h3 className="text-lg text-slate-900">Edit Appointment</h3>
                        <button
                            onClick={() => { setIsEditModalOpen(false); resetForm(); }}
                            className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <form onSubmit={handleEditManual} className="p-6 grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="Patient Name"
                            required
                            className="bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm"
                        />
                        <div>
                            <label className="block text-[10px] text-slate-400 uppercase tracking-widest ml-1 mb-2">Service</label>
                            <select
                                value={formService}
                                onChange={(e) => setFormService(e.target.value)}
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm"
                            >
                                <option value="" disabled>Select a service</option>
                                {allServices.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="date"
                                value={formDate}
                                onChange={(e) => setFormDate(e.target.value)}
                                required
                                className="bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm"
                            />
                            <input
                                type="time"
                                value={formTime}
                                onChange={(e) => setFormTime(e.target.value)}
                                required
                                className="bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => { setIsEditModalOpen(false); resetForm(); }}
                                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        );
    };

    const renderSettings = () => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                        <Stethoscope size={22} />
                    </div>
                    <div>
                        <h3 className="text-lg font-normal text-slate-900 tracking-tight">Clinic Core Settings</h3>
                        <p className="text-[11px] text-slate-400 uppercase tracking-widest">Manage your profile & accessibility</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="col-span-2">
                            <label className="text-[9px] text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Enterprise Name</label>
                            <input type="text" defaultValue="SmileCare Dental Studio" className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-[13px] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                        </div>
                        <div>
                            <label className="text-[9px] text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Opening Cycle</label>
                            <input type="text" defaultValue="08:30 AM" className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-[13px] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                        </div>
                        <div>
                            <label className="text-[9px] text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Closing Cycle</label>
                            <input type="text" defaultValue="07:00 PM" className="w-full p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-[13px] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                        </div>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-3.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-sm transition-all active:scale-95">Update Profiles</button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-200/30 rounded-full blur-2xl" />
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <h4 className="text-base font-normal text-slate-900 tracking-tight">Autonomous Agent</h4>
                        <p className="text-[11px] text-slate-400 uppercase tracking-widest">AI bot handles all primary reservations</p>
                    </div>
                    <div className="h-7 w-12 bg-slate-900 rounded-full flex items-center px-1 shadow-inner">
                        <div className="h-5 w-5 bg-slate-200 rounded-full ml-auto shadow-md" />
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
            <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-6 bg-white border-b border-slate-50">
                    <h3 className="text-lg font-normal text-slate-900 tracking-tight">{format(currentMonth, 'MMMM yyyy')}</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
                            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 bg-white shadow-sm border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"><ChevronLeft size={16} /></button>
                            <button onClick={() => setCurrentMonth(new Date())} className="px-3.5 py-1.5 text-[9px] uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Today</button>
                            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 bg-white shadow-sm border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"><ChevronRight size={16} /></button>
                        </div>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2 text-xs rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                            Add Appointment
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 border-b border-slate-50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="py-4 text-center text-[10px] text-slate-400 uppercase tracking-[0.2em]">{day}</div>
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
                            <div key={idx} className={`min-h-[120px] p-3 border-r border-b border-slate-100 transition-colors ${!isSameMonth(day, monthStart) ? 'bg-slate-50/40 opacity-40' : 'bg-white hover:bg-slate-50'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[11px] tracking-tight ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-lg shadow-sm' : 'text-slate-400'}`}>
                                        {format(day, 'd')}
                                    </span>
                                </div>
                                <div className="space-y-1.5">
                                    {localBookings.map(b => (
                                        <div
                                            key={b.id}
                                            className="px-2 py-1.5 text-[8px] bg-slate-50 text-slate-700 rounded-lg border border-slate-200 uppercase tracking-widest leading-none group relative overflow-hidden"
                                            title={`${b.service} - ${b.name}`}
                                        >
                                            <div className="flex flex-col gap-0.5 relative z-10">
                                                <span>{b.name}</span>
                                                <span className="text-[7px] opacity-60">{b.time}</span>
                                            </div>
                                            <div className="absolute top-0 right-0 w-0.5 h-full bg-slate-400" />
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
        if (!isPatientModalOpen) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xl text-slate-900 font-bold tracking-tight">{editingPatient ? 'Update Patient Record' : 'Create New Patient'}</h3>
                        <button onClick={() => setIsPatientModalOpen(false)} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                    </div>
                    <form onSubmit={handlePatientSubmit} className="p-8 grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">Full Identity</label>
                            <input type="text" value={patientForm.full_name} onChange={e => setPatientForm({ ...patientForm, full_name: e.target.value })} placeholder="Patient Full Name" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">Email Address</label>
                            <input type="email" value={patientForm.email} onChange={e => setPatientForm({ ...patientForm, email: e.target.value })} placeholder="example@mail.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">Phone Number</label>
                            <input type="text" value={patientForm.phone} onChange={e => setPatientForm({ ...patientForm, phone: e.target.value })} placeholder="+1 234 567 890" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">Birth Date</label>
                            <input type="date" value={patientForm.date_of_birth} onChange={e => setPatientForm({ ...patientForm, date_of_birth: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">Gender</label>
                            <select value={patientForm.gender} onChange={e => setPatientForm({ ...patientForm, gender: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">Medical History Notes</label>
                            <textarea value={patientForm.medical_history} onChange={e => setPatientForm({ ...patientForm, medical_history: e.target.value })} placeholder="Known allergies, previous treatments, chronic conditions..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-medium h-24 resize-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                        </div>
                        <div className="col-span-2 flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setIsPatientModalOpen(false)} className="px-6 py-3 border border-slate-100 text-slate-500 rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-slate-50 transition-all">Cancel</button>
                            <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Save Record</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        );
    };

    const renderEmrModal = () => {
        if (!isEmrModalOpen) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                        <h3 className="text-xl text-slate-900 font-bold tracking-tight">{editingEmr ? 'Update EMR Entry' : 'New Clinical Entry'}</h3>
                        <button onClick={() => setIsEmrModalOpen(false)} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleEmrSubmit} className="p-8 grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">Select Patient</label>
                            <select value={emrForm.patient_id} onChange={e => setEmrForm({ ...emrForm, patient_id: e.target.value })} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                                <option value="">Select a patient</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">Visit Date</label>
                            <input type="date" value={emrForm.visit_date} onChange={e => setEmrForm({ ...emrForm, visit_date: e.target.value })} required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">Tooth Number</label>
                            <input type="text" value={emrForm.tooth_number} onChange={e => setEmrForm({ ...emrForm, tooth_number: e.target.value })} placeholder="e.g. 14, 26" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">Treatment Performed</label>
                            <input type="text" value={emrForm.treatment_done} onChange={e => setEmrForm({ ...emrForm, treatment_done: e.target.value })} placeholder="e.g. Root Canal" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">Dentist Name</label>
                            <input type="text" value={emrForm.dentist_name} onChange={e => setEmrForm({ ...emrForm, dentist_name: e.target.value })} placeholder="Dr. Smith" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">Diagnosis & Notes</label>
                            <textarea value={emrForm.diagnosis} onChange={e => setEmrForm({ ...emrForm, diagnosis: e.target.value })} placeholder="Detailed clinical findings and further notes..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-medium h-24 resize-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                        </div>
                        <div className="col-span-2 flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setIsEmrModalOpen(false)} className="px-6 py-3 border border-slate-100 text-slate-500 rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-slate-50 transition-all">Cancel</button>
                            <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Finalize Entry</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        );
    };

    const renderServiceModal = () => {
        if (!isServiceModalOpen) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-white rounded-[28px] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100"
                >
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
                        <h3 className="text-lg text-slate-900 font-normal tracking-tight">
                            {editingService ? 'Edit Service' : 'Add New Service'}
                        </h3>
                        <button
                            onClick={() => setIsServiceModalOpen(false)}
                            className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <form onSubmit={handleServiceSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-[10px] text-slate-400 uppercase tracking-widest ml-1 mb-2">Service Name</label>
                            <input
                                type="text"
                                value={serviceFormName}
                                onChange={(e) => setServiceFormName(e.target.value)}
                                placeholder="e.g. Tooth Extraction"
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsServiceModalOpen(false)}
                                className="px-5 py-2.5 border border-slate-100 text-slate-500 rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                            >
                                {editingService ? 'Save Changes' : 'Create Service'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full bg-slate-50 border-r border-slate-100 z-50 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} hidden lg:block`}>
                <div className="flex flex-col h-full">
                    {/* Compact Logo Section */}
                    <div className="p-5 flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100 group">
                            <Stethoscope size={20} className="group-hover:scale-110 transition-transform" />
                        </div>
                        {isSidebarOpen && (
                            <div className="text-slate-900 leading-none">
                                <span className="text-black tracking-tight">SMILE</span>
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
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 group relative
                                    ${activeTab === item.name
                                        ? 'bg-white text-blue-600 shadow-sm border border-slate-100'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
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
                        <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 mt-4 text-xs text-slate-400 hover:text-rose-600 transition-colors rounded-xl ${!isSidebarOpen && 'justify-center'}`}>
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
                            className="fixed top-0 left-0 bottom-0 z-[60] w-72 flex flex-col bg-slate-50 lg:hidden"
                        >
                            <div className="p-8 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                        <Stethoscope size={24} />
                                    </div>
                                    <div>
                                        <span className="text-xl text-slate-900 tracking-tight block leading-none">SmileCare</span>
                                        <span className="text-[10px] text-blue-600 uppercase tracking-widest">Admin Cloud</span>
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
                                        className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm tracking-tight transition-all active:scale-[0.98] ${activeTab === item.name
                                            ? 'bg-white text-blue-600 border border-slate-100 shadow-sm'
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
                                    className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-[0.98]"
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
                                className="lg:hidden h-11 w-11 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-500 shadow-sm transition-all hover:text-slate-900 hover:bg-slate-50 active:scale-95 mr-2"
                            >
                                <Menu size={20} />
                            </button>
                            <h2 className="text-2xl font-normal text-slate-900 tracking-tight">{activeTab}</h2>
                            {activeTab === 'Appointments' && (
                                <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                                    <button
                                        onClick={() => setViewMode('calendar')}
                                        className={`px-6 py-2 text-xs uppercase tracking-widest rounded-xl transition-all ${viewMode === 'calendar' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Calendar
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`px-6 py-2 text-xs uppercase tracking-widest rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Activity
                                    </button>
                                    {/* Add Appointment button moved into Appointments views */}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 mr-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[9px] text-slate-400 uppercase tracking-widest">Autonomous Sync Online</span>
                            </div>
                            <button
                                onClick={() => setActiveTab('Overview')}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 shadow-sm transition-all hover:text-slate-900 hover:bg-slate-50 active:scale-95"
                            >
                                <Bell size={16} />
                            </button>
                            <div className="w-px h-6 bg-slate-100 mx-1" />
                            <div className="flex items-center gap-2.5 pl-1">
                                <div className="hidden sm:block text-right">
                                    <p className="text-[11px] text-slate-900 leading-none">Admin</p>
                                    <p className="text-[9px] text-blue-600 uppercase tracking-widest">Master Studio</p>
                                </div>
                                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs shadow-sm">A</div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10 max-w-[1600px] mx-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === 'Overview' && <motion.div key="overview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderOverview()}</motion.div>}
                        {activeTab === 'Patients' && <motion.div key="patients" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderPatients()}</motion.div>}
                        {activeTab === 'EMR' && <motion.div key="emr" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderEMR()}</motion.div>}
                        {activeTab === 'Services' && <motion.div key="services" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderServices()}</motion.div>}
                        {activeTab === 'Settings' && <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderSettings()}</motion.div>}
                        {activeTab === 'Appointments' && (
                            <motion.div key="appointments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                {viewMode === 'calendar' ? renderCalendar() : (
                                    <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-xl text-slate-900 tracking-tight">AI Reservation Ledger</h3>
                                            <button
                                                onClick={() => setIsAddModalOpen(true)}
                                                className="px-4 py-2 text-xs rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                            >
                                                Add Appointment
                                            </button>
                                        </div>
                                        <div className="overflow-hidden rounded-2xl border border-slate-100">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-slate-100 text-[10px] uppercase tracking-[0.2em] text-slate-700">
                                                        <th className="px-8 py-5">Patient Name</th>
                                                        <th className="px-8 py-5">Required Service</th>
                                                        <th className="px-8 py-5">Scheduled Date</th>
                                                        <th className="px-8 py-5">Time Slot</th>
                                                        <th className="px-8 py-5">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 text-sm bg-white">
                                                    {bookings.length === 0 ? (
                                                        <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium italic bg-white">Empty ledger. No bookings yet.</td></tr>
                                                    ) : bookings.map((booking) => (
                                                        <tr key={booking.id} className="hover:bg-slate-50 transition-colors bg-white">
                                                            <td className="px-8 py-5 text-slate-900">{booking.name}</td>
                                                            <td className="px-8 py-5">
                                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] uppercase tracking-wider">{booking.service}</span>
                                                            </td>
                                                            <td className="px-8 py-5 text-slate-600 font-medium">{booking.date}</td>
                                                            <td className="px-8 py-5 text-slate-900">{booking.time}</td>
                                                            <td className="px-8 py-5">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-1.5 text-blue-600 text-[10px] uppercase tracking-widest">
                                                                        <CheckCircle2 size={12} />
                                                                        Verified
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            onClick={() => openEditModal(booking)}
                                                                            className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                                            title="Edit"
                                                                        >
                                                                            <Pencil size={16} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => deleteBooking(booking.id)}
                                                                            className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                                            title="Delete"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
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
                    </AnimatePresence>
                </div>
            </main>
            <AnimatePresence>
                {renderAddModal()}
                {renderEditModal()}
                {renderServiceModal()}
                {renderPatientModal()}
                {renderEmrModal()}
            </AnimatePresence>
        </div>
    );
}

export default Dashboard;
