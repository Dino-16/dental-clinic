import React, { useState, useEffect } from 'react';
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
        <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Navigation */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-blue-100 py-4' : 'bg-transparent py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                            <Stethoscope size={18} />
                        </div>
                        <div>
                            <span className="text-lg font-medium tracking-tight text-gray-900">SmileCare</span>
                            <span className="block text-[9px] tracking-wide text-blue-600 -mt-1">Dental Studio</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        {['Services', 'Technology', 'Reviews', 'Bookings'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                        <div className="h-6 w-px bg-gray-200" />
                        <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                            Admin
                        </Link>
                        <button
                            onClick={() => setChatOpen(true)}
                            className="bg-gray-900 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
                        >
                            Get Started
                        </button>
                    </div>

                    <button className="md:hidden text-gray-900" onClick={() => setMobileMenuOpen(true)}>
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
                                <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white">
                                    <Stethoscope size={18} />
                                </div>
                                <span className="text-lg text-gray-900">SmileCare</span>
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
                                    className="text-2xl text-gray-900"
                                >
                                    {item}
                                </a>
                            ))}
                            <hr />
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-xl text-gray-900">Admin</Link>
                            <button
                                onClick={() => { setChatOpen(true); setMobileMenuOpen(false); }}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg"
                            >
                                Book Now
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent rounded-full blur-3xl -z-10" />

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-semibold mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                            </span>
                            AI-POWERED DENTAL CARE
                        </motion.div>

                        <motion.h1 variants={fadeIn} className="text-4xl lg:text-6xl font-normal text-gray-900 leading-[1.1] mb-6">
                            The future of <br />
                            <span className="text-blue-600">dentistry</span> is here.
                        </motion.h1>

                        <motion.p variants={fadeIn} className="text-base text-gray-600 leading-relaxed mb-8 max-w-lg">
                            Experience a new standard of dental care where advanced technology meets human touch. Our AI-driven clinic ensures seamless bookings and personalized care.
                        </motion.p>

                        <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setChatOpen(true)}
                                className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
                            >
                                Book with AI <ArrowRight size={18} />
                            </button>
                            <a href="#services" className="bg-blue-50 text-blue-600 px-5 py-2 rounded-md text-sm hover:bg-blue-100 transition-all">
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
                                <p className="text-xs text-gray-900">4.9/5 from 2,000+ patients</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-blue-50/50 rounded-full blur-[100px] animate-pulse" />
                        <div className="glass-card rounded-[32px] p-2 aspect-[4/5] lg:aspect-square overflow-hidden">
                            <div className="w-full h-full rounded-[28px] bg-slate-900 relative overflow-hidden group">
                                {/* Dashboard UI Simulation */}
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 p-6">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                        </div>
                                        <div className="px-2.5 py-0.5 rounded-full bg-white/10 text-[9px] text-white/50 tracking-wider">
                                            Live Dashboard
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="h-10 w-3/4 rounded-xl bg-white/10 animate-pulse" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="h-28 rounded-2xl bg-blue-500/20 border border-blue-500/30 p-4">
                                                <Users className="text-blue-400 mb-2" size={20} />
                                                <div className="text-xl text-white">42</div>
                                                <div className="text-[9px] text-blue-300">Today's Patients</div>
                                            </div>
                                            <div className="h-28 rounded-2xl bg-blue-500/20 border border-blue-500/30 p-4">
                                                <Calendar className="text-blue-400 mb-2" size={20} />
                                                <div className="text-xl text-white">98%</div>
                                                <div className="text-[9px] text-blue-300">Efficiency</div>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-2.5 mb-3">
                                                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                                    <Sparkles size={14} />
                                                </div>
                                                <div className="text-xs text-white">AI Assistant</div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="h-1.5 w-full bg-white/10 rounded-full" />
                                                <div className="h-1.5 w-4/5 bg-white/10 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Image overlay for visual pop */}
                                <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-4 top-1/4 glass-card p-3 rounded-xl flex items-center gap-2.5 shadow-xl"
                        >
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <CheckCircle2 size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] text-gray-500">Status</p>
                                <p className="text-xs">Booking Confirmed</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -left-8 bottom-1/4 glass-card p-4 rounded-2xl shadow-xl"
                        >
                            <div className="flex items-center gap-2 mb-1.5">
                                <MessageSquare className="text-blue-600" size={16} />
                                <span className="text-[10px] text-gray-900">AI Support</span>
                            </div>
                            <p className="text-[10px] text-gray-600 max-w-[100px]">"I've found a slot at 4:30 PM today."</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Trust Logos */}
            <section className="py-12 border-y border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-[10px] text-blue-600 tracking-wide mb-10">Trusted by leading medical associations</p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-40 grayscale">
                        {['HealthCare+', 'DentalOrg', 'SmileShield', 'BioMed', 'LifeClinic'].map((logo) => (
                            <span key={logo} className="text-xl font-black text-blue-600 tracking-tighter italic">{logo}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-24 bg-blue-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-[10px] text-blue-600 tracking-wide mb-3">Our Expertise</h2>
                        <h3 className="text-3xl md:text-4xl font-normal text-gray-900 mb-5 tracking-tight">Everything you need for a <span className="text-blue-600">perfect smile.</span></h3>
                        <p className="text-base text-gray-600">We offer a wide range of services powered by latest dental technology and a patient-first approach.</p>
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
                                color: 'bg-blue-50 text-blue-600'
                            },
                            {
                                id: 'ai-diagnostics',
                                title: 'AI Diagnostics',
                                desc: 'Precision imaging and AI-assisted analysis for faster, more accurate results.',
                                icon: <Shield size={32} />,
                                color: 'bg-blue-50 text-blue-600'
                            },
                            {
                                id: 'emergency-care',
                                title: 'Emergency Care',
                                desc: 'Same-day appointments for urgent dental issues and pain relief.',
                                icon: <Clock size={32} />,
                                color: 'bg-blue-50 text-blue-600'
                            },
                            {
                                id: 'restorative-care',
                                title: 'Restorative Care',
                                desc: 'Premium implants, crowns, and bridges to restore your natural look.',
                                icon: <CheckCircle2 size={32} />,
                                color: 'bg-blue-50 text-blue-600'
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
                                whileHover={{ y: -5 }}
                                className="group p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-blue-100/30 transition-all duration-300"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {React.cloneElement(service.icon, { size: 28 })}
                                </div>
                                <h4 className="text-lg font-normal text-gray-900 mb-3">{service.title}</h4>
                                <p className="text-gray-600 text-xs leading-relaxed mb-5 flex-1">{service.desc}</p>
                                <div className="flex items-center gap-2.5 pt-4 border-t border-gray-50">
                                    <button
                                        onClick={() => setChatOpen(true)}
                                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-[10px] hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                                    >
                                        Book Now <ArrowRight size={12} />
                                    </button>
                                    <Link
                                        to={`/service/${service.id}`}
                                        className="flex-1 py-2 rounded-lg text-[10px] text-gray-600 hover:bg-gray-50 transition-all text-center border border-gray-100"
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
                            <h2 className="text-[10px] text-blue-600 tracking-wide mb-3">Precision Technology</h2>
                            <h3 className="text-3xl md:text-4xl font-normal text-gray-900 mb-6 tracking-tight">The intersection of <span className="text-blue-600">AI and medicine.</span></h3>
                            <p className="text-base text-gray-600 mb-8 leading-relaxed">We've pioneered a patient-first workflow that leverages artificial intelligence to predict outcomes, minimize pain, and automate the tedious parts of healthcare.</p>

                            <div className="space-y-4">
                                {[
                                    { title: 'AI Diagnostics', desc: 'Neural networks detect issues 40% faster than traditional methods.', icon: <Sparkles className="text-blue-600" /> },
                                    { title: 'Digital Scanning', desc: 'No more messy molds. 3D intraoral scans in under 60 seconds.', icon: <CheckCircle2 className="text-blue-600" /> },
                                    { title: 'Guided Surgeries', desc: 'Robotic precision for dental implants and restorative work.', icon: <Shield className="text-blue-600" /> }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-gray-900">{item.title}</h4>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-10 bg-blue-50/50 rounded-full blur-[100px] animate-pulse" />
                            <div className="relative glass-card rounded-[32px] p-6 border border-gray-200">
                                <div className="aspect-video bg-slate-900 rounded-[24px] overflow-hidden relative shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-500/20 mix-blend-overlay" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
                                            <Play fill="white" size={24} />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-white">
                                        <div className="text-[9px] font-bold uppercase tracking-widest mb-0.5 opacity-60">Now Watching</div>
                                        <div className="text-xs font-bold">The AI Clinic Experience</div>
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                        <div className="text-xl font-black text-blue-600">0.5mm</div>
                                        <div className="text-[9px] font-bold text-blue-700 uppercase tracking-wider">Scanning Precision</div>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                        <div className="text-xl font-black text-blue-600">60sec</div>
                                        <div className="text-[9px] font-bold text-blue-700 uppercase tracking-wider">Booking Speed</div>
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
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-[10px] text-blue-600 tracking-wide mb-3">Live Updates</h2>
                            <h3 className="text-3xl font-normal text-gray-900 tracking-tight">Recent Reservations</h3>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                            <div className="px-3 py-1.5 bg-white rounded-lg text-xs text-gray-900">
                                {bookings.length} Total
                            </div>
                            <div className="flex items-center gap-1 pr-3 text-[9px] text-blue-600 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                LIVE
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookings.length === 0 ? (
                            <div className="col-span-full py-20 border-2 border-dashed border-blue-200 rounded-[40px] text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                                    <Calendar size={32} />
                                </div>
                                <p className="text-blue-300 font-medium">No bookings yet. Start AI chat to book!</p>
                            </div>
                        ) : (
                            bookings.slice(0, 6).map((booking) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={booking.id}
                                    className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="px-2 py-0.5 rounded-full bg-white text-[9px] text-blue-600 border border-blue-100">
                                                {booking.service}
                                            </div>
                                            <div className="text-[9px] text-gray-400">ID: {String(booking.id || '').slice(0, 8)}</div>
                                        </div>
                                        <div className="text-base text-gray-900 mb-1">{booking.name}</div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar size={12} />
                                            {booking.date}
                                        </div>
                                    </div>
                                    <div className="mt-5 pt-3 border-t border-gray-200/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-gray-900">
                                            <Clock size={12} className="text-blue-600" />
                                            {booking.time}
                                        </div>
                                        <div className="text-[9px] text-blue-600 flex items-center gap-1">
                                            <CheckCircle2 size={10} />
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
            <section id="reviews" className="py-24 bg-white text-slate-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-[1fr_1.5fr] gap-20 items-center">
                        <div>
                            <h2 className="text-[10px] text-blue-600 tracking-wide mb-5">Patient Stories</h2>
                            <h3 className="text-4xl font-normal mb-6 leading-tight">Loved by the community.</h3>
                            <p className="text-slate-600 text-base mb-8">We pride ourselves on providing exceptional care that leaves our patients smiling.</p>

                            <div className="flex gap-10">
                                <div>
                                    <div className="text-3xl mb-0.5">4.9/5</div>
                                    <div className="text-[10px] text-slate-500 tracking-wider">Average Rating</div>
                                </div>
                                <div>
                                    <div className="text-3xl mb-0.5">2k+</div>
                                    <div className="text-[10px] text-slate-500 tracking-wider">Happy Patients</div>
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
                                <div key={i} className="p-8 rounded-[40px] bg-white border border-slate-200">
                                    <div className="flex text-amber-500 mb-6">
                                        {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill="currentColor" />)}
                                    </div>
                                    <p className="text-slate-600 mb-8 italic leading-relaxed">"{t.text}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-200 p-0.5 border border-slate-300">
                                            <img src={`https://i.pravatar.cc/150?u=${i + 10}`} className="w-full h-full rounded-full" alt="" />
                                        </div>
                                        <div>
                                            <div>{t.name}</div>
                                            <div className="text-[10px] text-blue-600 tracking-wider">{t.role}</div>
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
                    <div className="relative rounded-[60px] bg-blue-50 p-12 md:p-20 overflow-hidden text-center border border-slate-200">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-normal text-slate-900 mb-6 tracking-tight">Ready for a better <br /> dental experience?</h2>
                            <p className="text-slate-600 text-base mb-10 max-w-xl mx-auto">Join thousands of patients who have switched to a smarter way of caring for their smiles.</p>
                            <div className="flex flex-wrap justify-center gap-5">
                                <button
                                    onClick={() => setChatOpen(true)}
                                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all active:scale-95 text-base"
                                >
                                    Book Your Appointment
                                </button>
                                <a
                                    href="tel:5551234567"
                                    className="w-full md:w-auto flex items-center justify-center gap-3 text-slate-900 transition-colors"
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
            <footer className="py-20 bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-20">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                    <Stethoscope size={24} />
                                </div>
                                <span className="text-2xl font-black text-gray-900 tracking-tight">SmileCare</span>
                            </div>
                            <p className="text-gray-500 max-w-sm leading-relaxed mb-8 font-medium">
                                Modernizing dentistry through AI-assisted operations and patient-centric design. Experience the future of oral healthcare today.
                            </p>
                            <div className="flex gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-colors cursor-pointer">
                                        <Sparkles size={18} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-gray-900 mb-8 tracking-wide text-xs">Resources</h4>
                            <ul className="space-y-4">
                                {['About Us', 'Services', 'Our Team', 'AI Lab', 'Contact'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-gray-900 mb-8 tracking-wide text-xs">Contact</h4>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-600">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-400">Support</div>
                                        <a href="tel:5551234567" className="text-sm text-gray-900 hover:text-blue-600 transition-colors">(555) 123-4567</a>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex-shrink-0 flex items-center justify-center text-emerald-600">
                                        <MessageSquare size={18} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-400">Email</div>
                                        <a href="mailto:hello@smilecare.ai" className="text-sm text-gray-900 hover:text-blue-600 transition-colors">hello@smilecare.ai</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-gray-400 text-sm font-medium">© 2026 SmileCare Dental Studio. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a href="#" className="text-gray-400 hover:text-gray-900 text-sm font-medium">Privacy Policy</a>
                            <a href="#" className="text-gray-400 hover:text-gray-900 text-sm font-medium">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>

            <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
    );
}

export default LandingPage;
