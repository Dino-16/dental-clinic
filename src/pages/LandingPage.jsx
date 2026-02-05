import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Shield,
    Sparkles,
    MessageSquare,
    ArrowRight,
    CheckCircle2,
    Star,
    Users,
    Clock,
    Phone,
    Menu,
    X,
    Stethoscope,
    ChevronRight,
    Play
} from 'lucide-react';
import ChatBot from '../components/ChatBot';
import { useBookings } from '../context/BookingContext';
import { Link } from 'react-router-dom';

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

function LandingPage() {
    const [chatOpen, setChatOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { bookings } = useBookings();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen font-sans selection:bg-sky-100 selection:text-sky-900">
            {/* Navigation */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-4' : 'bg-transparent py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200 group-hover:scale-110 transition-transform">
                            <Stethoscope size={24} />
                        </div>
                        <div>
                            <span className="text-xl font-extrabold tracking-tight text-slate-900">SmileCare</span>
                            <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-sky-600 -mt-1">DENTAL STUDIO</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        {['Services', 'Technology', 'Reviews', 'Bookings'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                        <div className="h-6 w-px bg-slate-200" />
                        <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">
                            Admin
                        </Link>
                        <button
                            onClick={() => setChatOpen(true)}
                            className="bg-slate-950 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                        >
                            Get Started
                        </button>
                    </div>

                    <button className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(true)}>
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 z-[60] bg-white p-6 md:hidden"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white">
                                    <Stethoscope size={20} />
                                </div>
                                <span className="text-lg font-bold">SmileCare</span>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-6">
                            {['Services', 'Technology', 'Reviews', 'Bookings'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-2xl font-bold text-slate-900"
                                >
                                    {item}
                                </a>
                            ))}
                            <hr />
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-slate-900">Admin</Link>
                            <button
                                onClick={() => { setChatOpen(true); setMobileMenuOpen(false); }}
                                className="w-full bg-sky-600 text-white py-4 rounded-2xl font-bold"
                            >
                                Book Now
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-sky-50/50 to-transparent rounded-full blur-3xl -z-10" />

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                            </span>
                            AI-POWERED DENTAL CARE
                        </motion.div>

                        <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8">
                            The future of <br />
                            <span className="text-gradient">dentistry</span> is here.
                        </motion.h1>

                        <motion.p variants={fadeIn} className="text-lg text-slate-600 leading-relaxed mb-10 max-w-xl">
                            Experience a new standard of dental care where advanced technology meets human touch. Our AI-driven clinic ensures seamless bookings and personalized care.
                        </motion.p>

                        <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setChatOpen(true)}
                                className="btn-primary gap-2"
                            >
                                Book with AI <ArrowRight size={18} />
                            </button>
                            <a href="#services" className="btn-secondary gap-2">
                                Explore Services <Play size={16} fill="currentColor" />
                            </a>
                        </motion.div>

                        <motion.div variants={fadeIn} className="mt-12 flex items-center gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex text-amber-500 mb-0.5">
                                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <p className="text-xs font-bold text-slate-900">4.9/5 from 2,000+ patients</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-tr from-sky-200 to-indigo-200 blur-2xl opacity-30 -z-10 rounded-[40px]" />
                        <div className="glass-card rounded-[40px] p-2 aspect-[4/5] lg:aspect-square overflow-hidden">
                            <div className="w-full h-full rounded-[34px] bg-slate-900 relative overflow-hidden group">
                                {/* Dashboard UI Simulation */}
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 p-8">
                                    <div className="flex justify-between items-center mb-10">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-rose-500" />
                                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-white/10 text-[10px] text-white/50 font-bold uppercase tracking-wider">
                                            Live Dashboard
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="h-12 w-3/4 rounded-2xl bg-white/10 animate-pulse" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-32 rounded-3xl bg-sky-500/20 border border-sky-500/30 p-4">
                                                <Users className="text-sky-400 mb-2" size={24} />
                                                <div className="text-2xl font-bold text-white">42</div>
                                                <div className="text-[10px] text-sky-300 font-bold uppercase">Today's Patients</div>
                                            </div>
                                            <div className="h-32 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 p-4">
                                                <Calendar className="text-emerald-400 mb-2" size={24} />
                                                <div className="text-2xl font-bold text-white">98%</div>
                                                <div className="text-[10px] text-emerald-300 font-bold uppercase">Efficiency</div>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                                                    <Sparkles size={16} />
                                                </div>
                                                <div className="text-sm font-bold text-white">AI Assistant</div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-2 w-full bg-white/10 rounded-full" />
                                                <div className="h-2 w-4/5 bg-white/10 rounded-full" />
                                                <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Image overlay for visual pop */}
                                <div className="absolute inset-0 bg-sky-600/10 mix-blend-overlay" />
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-8 top-1/4 glass-card p-4 rounded-2xl flex items-center gap-3 shadow-2xl"
                        >
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                                <p className="text-sm font-extrabold">Booking Confirmed</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -left-12 bottom-1/4 glass-card p-5 rounded-3xl shadow-2xl"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="text-sky-600" size={20} />
                                <span className="text-xs font-extrabold text-slate-900">AI Support</span>
                            </div>
                            <p className="text-xs text-slate-600 max-w-[120px]">"I've found a slot at 4:30 PM today."</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Trust Logos */}
            <section className="py-12 border-y border-slate-100 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-10">Trusted by leading medical associations</p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-40 grayscale">
                        {['HealthCare+', 'DentalOrg', 'SmileShield', 'BioMed', 'LifeClinic'].map((logo) => (
                            <span key={logo} className="text-xl font-black text-slate-900 tracking-tighter italic">{logo}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-sm font-bold text-sky-600 uppercase tracking-widest mb-4">Our Expertise</h2>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Everything you need for a <span className="text-sky-600">perfect smile.</span></h3>
                        <p className="text-lg text-slate-600">We offer a wide range of services powered by the latest dental technology and a patient-first approach.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                id: 'general-dentistry',
                                title: 'General Dentistry',
                                desc: 'Comprehensive exams, cleanings, and preventive care for the whole family.',
                                icon: <Stethoscope size={32} />,
                                color: 'bg-blue-50 text-blue-600'
                            },
                            {
                                id: 'cosmetic-studio',
                                title: 'Cosmetic Studio',
                                desc: 'Invisalign, veneers, and teeth whitening for a confident, radiant smile.',
                                icon: <Sparkles size={32} />,
                                color: 'bg-indigo-50 text-indigo-600'
                            },
                            {
                                id: 'ai-diagnostics',
                                title: 'AI Diagnostics',
                                desc: 'Precision imaging and AI-assisted analysis for faster, more accurate results.',
                                icon: <Shield size={32} />,
                                color: 'bg-sky-50 text-sky-600'
                            },
                            {
                                id: 'emergency-care',
                                title: 'Emergency Care',
                                desc: 'Same-day appointments for urgent dental issues and pain relief.',
                                icon: <Clock size={32} />,
                                color: 'bg-rose-50 text-rose-600'
                            },
                            {
                                id: 'restorative-care',
                                title: 'Restorative Care',
                                desc: 'Premium implants, crowns, and bridges to restore your natural look.',
                                icon: <CheckCircle2 size={32} />,
                                color: 'bg-emerald-50 text-emerald-600'
                            },
                            {
                                id: 'oral-surgery',
                                title: 'Oral Surgery',
                                desc: 'Gentle, expert surgical procedures with advanced sedation options.',
                                icon: <Calendar size={32} />,
                                color: 'bg-slate-50 text-slate-600'
                            }
                        ].map((service, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="group p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-100/50 transition-all duration-300"
                            >
                                <div className={`w-16 h-16 rounded-3xl ${service.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                    {service.icon}
                                </div>
                                <h4 className="text-xl font-extrabold text-slate-900 mb-4">{service.title}</h4>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">{service.desc}</p>
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                                    <button
                                        onClick={() => setChatOpen(true)}
                                        className="flex-1 bg-slate-950 text-white py-3 rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        Book Now <ArrowRight size={14} />
                                    </button>
                                    <Link
                                        to={`/service/${service.id}`}
                                        className="flex-1 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all text-center border border-slate-100"
                                    >
                                        Details
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section id="technology" className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-sm font-bold text-sky-600 uppercase tracking-widest mb-4">Precision Technology</h2>
                            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 tracking-tight">The intersection of <span className="text-sky-600">AI and medicine.</span></h3>
                            <p className="text-lg text-slate-600 mb-10 leading-relaxed">We've pioneered a patient-first workflow that leverages artificial intelligence to predict outcomes, minimize pain, and automate the tedious parts of healthcare.</p>

                            <div className="space-y-6">
                                {[
                                    { title: 'AI Diagnostics', desc: 'Neural networks detect issues 40% faster than traditional methods.', icon: <Sparkles className="text-sky-600" /> },
                                    { title: 'Digital Scanning', desc: 'No more messy molds. 3D intraoral scans in under 60 seconds.', icon: <CheckCircle2 className="text-sky-600" /> },
                                    { title: 'Guided Surgeries', desc: 'Robotic precision for dental implants and restorative work.', icon: <Shield className="text-sky-600" /> }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{item.title}</h4>
                                            <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-10 bg-sky-100/50 rounded-full blur-[100px] animate-pulse" />
                            <div className="relative glass-card rounded-[40px] p-8 border border-slate-200">
                                <div className="aspect-video bg-slate-900 rounded-[30px] overflow-hidden relative shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 mix-blend-overlay" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
                                            <Play fill="white" size={32} />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-white">
                                        <div className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60">Now Watching</div>
                                        <div className="text-sm font-bold">The AI Clinic Experience</div>
                                    </div>
                                </div>
                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
                                        <div className="text-2xl font-black text-sky-600">0.5mm</div>
                                        <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">Scanning Precision</div>
                                    </div>
                                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                        <div className="text-2xl font-black text-emerald-600">60sec</div>
                                        <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Booking Speed</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bookings Feed */}
            <section id="bookings" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div>
                            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-4">Live Updates</h2>
                            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">Recent Reservations</h3>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                            <div className="px-4 py-2 bg-white rounded-xl shadow-sm text-sm font-bold text-slate-900">
                                {bookings.length} Total
                            </div>
                            <div className="flex items-center gap-1.5 pr-4 text-[10px] font-bold text-emerald-600 animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                LIVE
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookings.length === 0 ? (
                            <div className="col-span-full py-20 border-2 border-dashed border-slate-200 rounded-[40px] text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                                    <Calendar size={32} />
                                </div>
                                <p className="text-slate-500 font-medium">No bookings yet. Start the AI chat to book!</p>
                            </div>
                        ) : (
                            bookings.slice(0, 6).map((booking) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={booking.id}
                                    className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="px-3 py-1 rounded-full bg-white text-[10px] font-bold text-sky-600 uppercase border border-sky-100">
                                                {booking.service}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400">ID: {String(booking.id || '').slice(0, 8)}</div>
                                        </div>
                                        <div className="text-lg font-bold text-slate-900 mb-1">{booking.name}</div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Calendar size={14} />
                                            {booking.date}
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                            <Clock size={14} className="text-sky-600" />
                                            {booking.time}
                                        </div>
                                        <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                            <CheckCircle2 size={12} />
                                            CONFIRMED
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="reviews" className="py-24 bg-slate-950 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-[1fr_1.5fr] gap-20 items-center">
                        <div>
                            <h2 className="text-sm font-bold text-sky-400 uppercase tracking-widest mb-6">Patient Stories</h2>
                            <h3 className="text-5xl font-extrabold mb-8 leading-tight">Loved by the <span className="text-sky-400">community.</span></h3>
                            <p className="text-slate-400 text-lg mb-10">We pride ourselves on providing exceptional care that leaves our patients smiling.</p>

                            <div className="flex gap-12">
                                <div>
                                    <div className="text-4xl font-bold mb-1">4.9/5</div>
                                    <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Average Rating</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold mb-1">2k+</div>
                                    <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Happy Patients</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    text: "The AI booking tool is a game-changer. I booked my appointment in seconds at 11 PM!",
                                    name: "Sarah Miller",
                                    role: "Client"
                                },
                                {
                                    text: "Most professional dental clinic I've ever visited. The technology they use is mind-blowing.",
                                    name: "David Chen",
                                    role: "Client"
                                },
                                {
                                    text: "Gentle care and very transparent pricing. The dashboard makes everything so easy.",
                                    name: "Elena Rodriguez",
                                    role: "Client"
                                },
                                {
                                    text: "Highly recommend SmileCare for anyone who is anxious about dental visits.",
                                    name: "James Wilson",
                                    role: "Client"
                                }
                            ].map((t, i) => (
                                <div key={i} className="p-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <div className="flex text-amber-500 mb-6 font-bold">
                                        {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill="currentColor" />)}
                                    </div>
                                    <p className="text-slate-300 mb-8 italic leading-relaxed">"{t.text}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-800 p-0.5 border border-white/20">
                                            <img src={`https://i.pravatar.cc/150?u=${i + 10}`} className="w-full h-full rounded-full" alt="" />
                                        </div>
                                        <div>
                                            <div className="font-bold">{t.name}</div>
                                            <div className="text-[10px] text-sky-400 font-bold uppercase">{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white relative">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="relative rounded-[60px] bg-sky-600 p-12 md:p-20 overflow-hidden text-center shadow-2xl shadow-sky-200">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">Ready for a better <br /> dental experience?</h2>
                            <p className="text-sky-100 text-lg mb-12 max-w-2xl mx-auto">Join thousands of patients who have switched to a smarter way of caring for their smiles.</p>
                            <div className="flex flex-wrap justify-center gap-6">
                                <button
                                    onClick={() => setChatOpen(true)}
                                    className="px-10 py-5 bg-white text-sky-600 rounded-3xl font-extrabold hover:bg-sky-50 transition-all shadow-xl shadow-black/10 active:scale-95 text-lg"
                                >
                                    Book Your Appointment
                                </button>
                                <a
                                    href="tel:5551234567"
                                    className="w-full md:w-auto flex items-center justify-center gap-3 text-white font-bold hover:text-sky-100 transition-colors"
                                >
                                    <Phone size={20} />
                                    <span>Or call (555) 123-4567</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-20">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white">
                                    <Stethoscope size={24} />
                                </div>
                                <span className="text-2xl font-black text-slate-900 tracking-tight">SmileCare</span>
                            </div>
                            <p className="text-slate-500 max-w-sm leading-relaxed mb-8 font-medium">
                                Modernizing dentistry through AI-assisted operations and patient-centric design. Experience the future of oral healthcare today.
                            </p>
                            <div className="flex gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-sky-600 transition-colors cursor-pointer">
                                        <Sparkles size={18} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">Resources</h4>
                            <ul className="space-y-4">
                                {['About Us', 'Services', 'Our Team', 'AI Lab', 'Contact'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-slate-500 hover:text-sky-600 font-bold text-sm transition-colors">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">Contact</h4>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-sky-50 flex-shrink-0 flex items-center justify-center text-sky-600">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Support</div>
                                        <a href="tel:5551234567" className="text-sm font-bold text-slate-900 hover:text-sky-600 transition-colors">(555) 123-4567</a>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex-shrink-0 flex items-center justify-center text-emerald-600">
                                        <MessageSquare size={18} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Email</div>
                                        <a href="mailto:hello@smilecare.ai" className="text-sm font-bold text-slate-900 hover:text-sky-600 transition-colors">hello@smilecare.ai</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-400 text-sm font-medium">© 2026 SmileCare Dental Studio. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a href="#" className="text-slate-400 hover:text-slate-900 text-sm font-medium">Privacy Policy</a>
                            <a href="#" className="text-slate-400 hover:text-slate-900 text-sm font-medium">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>

            <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
    );
}

export default LandingPage;
