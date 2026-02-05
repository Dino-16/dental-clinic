import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Stethoscope,
    Sparkles,
    Shield,
    Clock,
    CheckCircle2,
    Calendar,
    ArrowLeft,
    ChevronRight,
    Star,
    ShieldCheck,
    Zap,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ChatBot from '../components/ChatBot';

const servicesData = {
    'general-dentistry': {
        title: 'General Dentistry',
        tagline: 'Comprehensive care for your family\'s oral health.',
        miniDesc: 'Maintaining your natural smile through preventive care and expert diagnostics.',
        icon: <Stethoscope size={48} />,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
        description: 'Our general dentistry services are the foundation of a healthy smile. We focus on preventive care, early detection, and personalized treatment plans to ensure long-term oral health for patients of all ages. Regular check-ups are essential for catching issues before they become painful and expensive.',
        process: [
            { step: 'Comprehensive Exam', detail: 'A thorough inspection of teeth, gums, and oral tissues using intraoral cameras and AI analysis.' },
            { step: 'Digital Imaging', desc: 'Precision X-rays to identify hidden decay, bone loss, or structural issues.' },
            { step: 'Ultrasonic Cleaning', detail: 'Removal of plaque and tartar using advanced ultrasonic scaling technology for a deeper clean.' },
            { step: 'Prevention Plan', detail: 'A customized roadmap for your home care, tailored to your specific oral health needs.' }
        ],
        features: [
            { title: 'Routine Cleanings', desc: 'Professional scaling and polishing to remove plaque and tartar.' },
            { title: 'Digital X-Rays', desc: 'Ultra-low radiation imaging for precise diagnostics.' },
            { title: 'Oral Cancer Screenings', desc: 'Early detection procedures as part of every exam.' },
            { title: 'Pediatric Care', desc: 'Gentle dentistry specifically tailored for our younger patients.' }
        ],
        benefits: ['Prevent tooth decay', 'Fresh breath', 'Early disease detection', 'Personalized oral hygiene education']
    },
    'cosmetic-studio': {
        title: 'Cosmetic Studio',
        tagline: 'Design the smile you\'ve always dreamed of.',
        miniDesc: 'Combining artistry and precision to transform your confidence.',
        icon: <Sparkles size={48} />,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        image: 'https://images.unsplash.com/photo-1593054941142-5507cc368297?auto=format&fit=crop&q=80&w=800',
        description: 'Transform your appearance with our state-of-the-art cosmetic treatments. We combine artistic vision with clinical precision to create natural, stunning results. Whether you want to straighten, whiten, or completely reshape your smile, we have the advanced tools to make it happen.',
        process: [
            { step: 'Aesthetic Consultation', detail: 'We discuss your goals and perform a digital smile analysis.' },
            { step: 'Digital Mockup', detail: 'See your projected results on screen before we touch a single tooth.' },
            { step: 'Precision Treatment', detail: 'Application of veneers, aligners, or whitening using guided technology.' },
            { step: 'Final Polish', detail: 'Refining the details to ensure your new smile feels natural and looks perfect.' }
        ],
        features: [
            { title: 'Invisalign®', desc: 'Clear aligners for discreet and comfortable teeth straightening.' },
            { title: 'Veneers', desc: 'Premium porcelain shells to correct gaps, chips, or stains.' },
            { title: 'Teeth Whitening', desc: 'Advanced laser whitening for immediate, radiant results.' },
            { title: 'Smile Design', desc: 'Digital smile previews before we even begin treatment.' }
        ],
        benefits: ['Boost confidence', 'Youthful appearance', 'Stain removal', 'Straighten without braces']
    },
    'ai-diagnostics': {
        title: 'AI Diagnostics',
        tagline: 'Precision analysis powered by modern intelligence.',
        miniDesc: 'Using neural networks to find issues 40% faster than the human eye.',
        icon: <Shield size={48} />,
        color: 'text-sky-600',
        bg: 'bg-sky-50',
        image: 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=800',
        description: 'We leverage cutting-edge artificial intelligence to analyze dental scans with unprecedented accuracy. Our neural networks are trained on millions of clinical samples to detect decay, bone loss, and structural abnormalities long before they are visible to the human eye.',
        process: [
            { step: 'High-Res Scanning', detail: 'We capture 3D intraoral scans of your entire oral structure.' },
            { step: 'Neural Processing', detail: 'The AI analyzes your data against a database of millions of clinical cases.' },
            { step: 'Specialist Overlay', detail: 'Our dentists review the AI findings to verify and finalize the diagnosis.' },
            { step: 'Interactive Report', detail: 'You receive a visual report showing exactly what the AI found and why.' }
        ],
        features: [
            { title: 'Neural Analysis', desc: 'AI-driven detection of cavities and bone loss.' },
            { title: 'Outcome Prediction', desc: 'Simulate the success of treatments before they start.' },
            { title: '3D Mapping', desc: 'Ultra-high precision topographical maps of your teeth.' },
            { title: 'Automatic Alerts', desc: 'Instant identification of high-priority oral health risks.' }
        ],
        benefits: ['40% faster diagnostics', 'Extreme precision', 'Predictable results', 'Lower long-term costs']
    },
    'emergency-care': {
        title: 'Emergency Care',
        tagline: 'Immediate relief when you need it most.',
        miniDesc: 'Same-day response for pain, trauma, and urgent dental needs.',
        icon: <Clock size={48} />,
        color: 'text-rose-600',
        bg: 'bg-rose-50',
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
        description: 'Dental emergencies don\'t wait, and neither do we. We offer same-day appointments for urgent cases to manage pain and save your teeth. Our trauma response team is trained to handle everything from sudden toothaches to knocked-out teeth with calm, clinical expertise.',
        process: [
            { step: 'Triage Call/Chat', detail: 'Instant assessment via our AI or on-call staff to determine urgency.' },
            { step: 'Priority Slot', detail: 'We clear a space in our schedule for immediate clinical attention.' },
            { step: 'Stabilization', detail: 'Quick action to stop bleeding, manage pain, or protect a compromised nerve.' },
            { step: 'Restoration Plan', detail: 'Long-term solution to fix the underlying cause of the emergency.' }
        ],
        features: [
            { title: 'Same-Day Treatment', desc: 'Priority slots reserved daily for urgent care.' },
            { title: 'Pain Management', desc: 'Advanced sedation and local anesthesia for instant relief.' },
            { title: 'Trauma Care', desc: 'Immediate attention for knocked-out or broken teeth.' },
            { title: 'On-Call Staff', desc: 'Expert dentists ready to handle complex emergencies.' }
        ],
        benefits: ['Instant pain relief', 'Save damaged teeth', 'Reduced anxiety', 'Direct expert access']
    },
    'restorative-care': {
        title: 'Restorative Care',
        tagline: 'Restore function and beauty to your smile.',
        miniDesc: 'Bringing back the strength and look of your natural teeth.',
        icon: <CheckCircle2 size={48} />,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800',
        description: 'From single fillings to full arch reconstructions, our restorative services bring back the strength and look of your natural teeth. We use bio-compatible materials that mimic the light-reflecting properties of real enamel for a seamless finish.',
        process: [
            { step: 'Damage Assessment', detail: 'Digital mapping to determine the extent of structural compromise.' },
            { step: 'Material Selection', detail: 'Choosing between Zirconia, E-max, or Composite for the best longevity.' },
            { step: 'Clinical Application', detail: 'Guided placement of implants, crowns, or fillings for perfect fit.' },
            { step: 'Bite Alignment', detail: 'Ensuring your new restoration works perfectly with your existing bite.' }
        ],
        features: [
            { title: 'Dental Implants', desc: 'Permanent, lifelike replacements for missing teeth.' },
            { title: 'Custom Crowns', desc: 'E-max and Zirconia materials for durability and beauty.' },
            { title: 'Bridges', desc: 'Seamlessly fill gaps to restore your chewing ability.' },
            { title: 'Root Canals', desc: 'Gentle treatments to save infected teeth from extraction.' }
        ],
        benefits: ['Restore chewing function', 'Lifelike appearance', 'Maintain bone health', 'Long-lasting durability']
    },
    'oral-surgery': {
        title: 'Oral Surgery',
        tagline: 'Expert surgical procedures with a gentle touch.',
        miniDesc: 'High-precision surgical care with advanced comfort options.',
        icon: <Calendar size={48} />,
        color: 'text-slate-600',
        bg: 'bg-slate-50',
        image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800',
        description: 'Our surgical team specializes in precise, low-trauma procedures. We utilize advanced technology like guided surgical stents to ensure faster healing and minimal discomfort. We prioritize your comfort with multiple sedation options tailored to your anxiety level.',
        process: [
            { step: 'Pre-Op Mapping', detail: 'CBCT 3D imaging to plan the safe path of the surgical procedure.' },
            { step: 'Sedation Setup', detail: 'Administering your chosen comfort option for a painless experience.' },
            { step: 'Precision Surgery', detail: 'Executed using minimally invasive techniques to reduce healing time.' },
            { step: 'Recovery Protocol', detail: 'Advanced aftercare support to ensure smooth, rapid healing.' }
        ],
        features: [
            { title: 'Wisdom Teeth', desc: 'Safe, easy removal of impacted or crowded third molars.' },
            { title: 'Bone Grafting', desc: 'Strengthening the jaw for successful dental implants.' },
            { title: 'Sinus Lifts', desc: 'Advanced procedures to create space for upper implants.' },
            { title: 'Sedation Options', desc: 'Multiple levels of sedation for complete patient comfort.' }
        ],
        benefits: ['Pain-free procedures', 'Faster healing times', 'Expert surgeons', 'Compassionate post-op care']
    }
};

function ServiceDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const service = servicesData[id];
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 text-center">
                <div>
                    <h1 className="text-4xl font-black mb-4">Service Not Found</h1>
                    <Link to="/" className="text-sky-600 font-bold hover:underline">Return to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-sky-100">
            {/* Header / Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors">
                        <ArrowLeft size={20} />
                        Back
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white">
                            <Stethoscope size={20} />
                        </div>
                        <span className="font-bold tracking-tight">SmileCare</span>
                    </div>
                    <button
                        onClick={() => setChatOpen(true)}
                        className="bg-slate-950 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-slate-800 transition-all font-sans"
                    >
                        Book Now
                    </button>
                </div>
            </nav>

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero Section */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className={`w-20 h-20 ${service.bg} ${service.color} rounded-[28px] flex items-center justify-center mb-8 shadow-sm`}>
                                {service.icon}
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
                                {service.title}
                            </h1>
                            <p className="text-2xl font-bold text-sky-600 mb-8 leading-relaxed">
                                {service.tagline}
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-xl">
                                {service.description}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => setChatOpen(true)}
                                    className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
                                >
                                    Book This Service
                                </button>
                                <button
                                    onClick={() => setChatOpen(true)}
                                    className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                                >
                                    Consult an Expert
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-tr from-sky-200 to-indigo-200 blur-3xl opacity-20 -z-10 rounded-[40px]" />
                            <div className="glass-card rounded-[40px] p-2 aspect-square overflow-hidden shadow-2xl">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover rounded-[34px]"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                        {service.features.map((feature, i) => (
                            <div key={i} className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 mb-6">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Content Section */}
                    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-20 items-start">
                        <div className="space-y-16">
                            <section>
                                <h2 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600">
                                        <Clock size={24} />
                                    </div>
                                    Clinical Process
                                </h2>
                                <div className="space-y-8 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                                    {service.process.map((p, i) => (
                                        <div key={i} className="relative pl-12">
                                            <div className="absolute left-0 top-0 w-10 h-10 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center text-sm font-black text-slate-400 z-10">
                                                {i + 1}
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900 mb-2">{p.step}</h4>
                                            <p className="text-slate-500 font-medium leading-relaxed">{p.detail || p.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                    <ShieldCheck className="text-sky-600" />
                                    Why choose our {service.title}?
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {service.benefits.map((benefit, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100">
                                            <Zap size={18} className="text-amber-500" />
                                            <span className="font-bold text-slate-700 text-sm">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                    <Star className="text-amber-500" />
                                    Patient Feedback
                                </h2>
                                <div className="space-y-6">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="p-8 rounded-[40px] bg-sky-600 text-white relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                            <div className="flex gap-1 mb-6">
                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="white" />)}
                                            </div>
                                            <p className="text-lg font-bold leading-relaxed mb-8 relative z-10">
                                                "The care I received for my {service.title.toLowerCase()} was absolutely top-notch. I never felt so comfortable at a dentist before."
                                            </p>
                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className="w-10 h-10 rounded-full bg-white/20 p-0.5">
                                                    <img src={`https://i.pravatar.cc/150?u=${i + 20}`} className="w-full h-full rounded-full" alt="" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm">Patient Review</div>
                                                    <div className="text-[10px] uppercase font-black text-white/60">Verified Patient</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <aside className="sticky top-32">
                            <div className="p-10 rounded-[40px] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/20 rounded-full blur-[100px]" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center">
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">Quick Booking</h3>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Takes ~60 seconds</p>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 mb-10 leading-relaxed font-medium">
                                        Ready to experience modern dental care? Our AI assistant is standing by to help you schedule your {service.title.toLowerCase()} appointment.
                                    </p>
                                    <button
                                        onClick={() => setChatOpen(true)}
                                        className="w-full bg-white text-slate-900 py-5 rounded-3xl font-black hover:bg-sky-50 transition-all active:scale-95 mb-4 shadow-xl shadow-black/20"
                                    >
                                        Start AI Booking
                                    </button>
                                    <div className="flex items-center justify-center gap-8 text-center pt-6 border-t border-white/10">
                                        <div>
                                            <div className="text-xl font-bold">4.9/5</div>
                                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Rating</div>
                                        </div>
                                        <div className="h-8 w-px bg-white/10" />
                                        <div>
                                            <div className="text-xl font-bold">2k+</div>
                                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Patients</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-8 rounded-[40px] bg-emerald-50 border border-emerald-100 flex items-center gap-6">
                                <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                                    <Shield size={28} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-emerald-900">Insurance Accepted</h4>
                                    <p className="text-xs text-emerald-700 font-medium">We work with all major providers.</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* Footer / CTA Mini */}
            <footer className="py-12 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <div>
                        <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                            <Stethoscope size={20} className="text-sky-600" />
                            <span className="font-black">SmileCare</span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">© 2026 SmileCare Dental Studio. Professional AI-powered dentistry.</p>
                    </div>
                    <div className="flex gap-10">
                        <Link to="/" className="text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors">Home</Link>
                        <a href="#" className="text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors">Privacy</a>
                        <a href="#" className="text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors">Terms</a>
                    </div>
                </div>
            </footer>

            <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
    );
}

export default ServiceDetailPage;
