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
        icon: <Stethoscope size={40} />,
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
        icon: <Sparkles size={40} />,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
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
        icon: <Shield size={40} />,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
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
        icon: <Clock size={40} />,
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
        icon: <CheckCircle2 size={40} />,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
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
        icon: <Calendar size={40} />,
        color: 'text-teal-600',
        bg: 'bg-teal-50',
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
            <div className="min-h-screen flex items-center justify-center p-6 text-center bg-slate-50 selection:bg-blue-100">
                <div>
                    <h1 className="text-3xl font-black mb-4 text-slate-900">Resource Unavailable</h1>
                    <Link to="/" className="text-blue-600 font-bold hover:underline uppercase tracking-widest text-xs">Establish Recovery Route</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-3.5">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                            <Stethoscope size={18} />
                        </div>
                        <span className="text-lg font-black tracking-tighter leading-none">SMILE<span className="text-blue-600">CARE</span></span>
                    </div>
                    <button
                        onClick={() => setChatOpen(true)}
                        className="bg-slate-950 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                    >
                        Book Agent
                    </button>
                </div>
            </nav>

            <main className="pt-28 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Hero */}
                    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className={`w-14 h-14 ${service.bg} ${service.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                                {service.icon}
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-5 leading-tight tracking-tight">
                                {service.title}
                            </h1>
                            <p className="text-xl font-bold text-blue-600 mb-6 leading-relaxed">
                                {service.tagline}
                            </p>
                            <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-xl font-medium">
                                {service.description}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setChatOpen(true)}
                                    className="px-7 py-3.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                                >
                                    Book This Service
                                </button>
                                <button
                                    onClick={() => setChatOpen(true)}
                                    className="px-7 py-3.5 bg-white text-slate-950 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                                >
                                    Consult Analyst
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-blue-100 blur-3xl opacity-30 -z-10 rounded-3xl" />
                            <div className="bg-white rounded-3xl p-2 aspect-[4/3] overflow-hidden shadow-xl border border-white">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
                        {service.features.map((feature, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                    <CheckCircle2 size={20} />
                                </div>
                                <h3 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Content Section */}
                    <div className="grid lg:grid-cols-[1.6fr_1fr] gap-16 items-start">
                        <div className="space-y-12">
                            <section>
                                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                                        <Clock size={20} />
                                    </div>
                                    Clinical Protocol
                                </h2>
                                <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                                    {service.process.map((p, i) => (
                                        <div key={i} className="relative pl-10">
                                            <div className="absolute left-0 top-0 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400 z-10 shadow-sm">
                                                {String(i + 1).padStart(2, '0')}
                                            </div>
                                            <h4 className="text-base font-bold text-slate-900 mb-1.5">{p.step}</h4>
                                            <p className="text-xs text-slate-500 font-bold leading-relaxed">{p.detail || p.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                                        <ShieldCheck size={20} />
                                    </div>
                                    Operational Benefits
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {service.benefits.map((benefit, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                                            <Zap size={16} className="text-amber-500" />
                                            <span className="font-bold text-slate-700 text-[11px] uppercase tracking-widest">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                    <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                                        <Star size={20} />
                                    </div>
                                    Patient Feed
                                </h2>
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="p-7 rounded-3xl bg-slate-950 text-white relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                            <div className="flex gap-1 mb-4">
                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="#2563eb" className="text-blue-500" />)}
                                            </div>
                                            <p className="text-base font-bold leading-relaxed mb-6 relative z-10 italic">
                                                "The precision care I received for my {service.title.toLowerCase()} was phenomenal. The AI diagnostics added a level of layer I've never seen."
                                            </p>
                                            <div className="flex items-center gap-3 relative z-10">
                                                <div className="w-9 h-9 rounded-xl bg-white/10 p-0.5 border border-white/10">
                                                    <img src={`https://i.pravatar.cc/150?u=${i + 20}`} className="w-full h-full rounded-[10px]" alt="" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-xs">Resident User</div>
                                                    <div className="text-[9px] uppercase font-black text-blue-400 tracking-widest">Verified Session</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <aside className="sticky top-28">
                            <div className="p-8 rounded-3xl bg-white border border-slate-100 text-slate-900 relative overflow-hidden shadow-xl">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black tracking-tight">Express Sync</h3>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Instant Queueing</p>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 mb-8 text-[13px] leading-relaxed font-medium">
                                        Our autonomous agent is ready to allocate resources for your session. Average processing time: 42 seconds.
                                    </p>
                                    <button
                                        onClick={() => setChatOpen(true)}
                                        className="w-full bg-slate-950 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                                    >
                                        Initiate AI Booking
                                    </button>
                                    <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-50">
                                        <div className="text-center">
                                            <div className="text-lg font-black text-slate-900">4.98</div>
                                            <div className="text-[8px] uppercase font-black text-slate-400 tracking-widest">Precision</div>
                                        </div>
                                        <div className="text-center border-l border-slate-50">
                                            <div className="text-lg font-black text-blue-600">Sync</div>
                                            <div className="text-[8px] uppercase font-black text-slate-400 tracking-widest">Active</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-6 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-5">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                    <Shield size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-blue-900 text-sm">Insured Access</h4>
                                    <p className="text-[10px] text-blue-700 font-medium uppercase tracking-widest">Global Payers Supported</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-10 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                            <Stethoscope size={16} />
                        </div>
                        <span className="text-sm font-black tracking-tight uppercase">SmileCare <span className="text-slate-400">OS</span></span>
                    </div>
                    <div className="flex gap-8">
                        <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Infrastructure</Link>
                        <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Privacy Ops</a>
                        <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Protocols</a>
                    </div>
                </div>
            </footer>

            <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
    );
}

export default ServiceDetailPage;
