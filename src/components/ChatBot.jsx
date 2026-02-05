import { useState, useRef, useEffect } from 'react';
import { useBookings } from '../context/BookingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, Sparkles } from 'lucide-react';

function ChatBot({ isOpen, onClose }) {
    const { addBooking, addMessage } = useBookings();
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: 'Welcome to SmileCare Dental! 👋 I am your digital assistant. How can I help you today?'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [bookingStep, setBookingStep] = useState(0);
    const [bookingData, setBookingData] = useState({});
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        const userMessage = { type: 'user', text: inputMessage };
        setMessages(prev => [...prev, userMessage]);

        addMessage({
            id: `MSG-${Date.now()}`,
            text: inputMessage,
            timestamp: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString(),
            type: 'inquiry'
        });

        let botResponse = { type: 'bot', text: '' };

        if (inputMessage.toLowerCase().includes('book') || inputMessage.toLowerCase().includes('appointment') || inputMessage.toLowerCase().includes('reservation')) {
            botResponse.text = "I'd be happy to help you book an appointment! Let's get started. What dental service are you looking for today? (e.g., General Checkup, Teeth Cleaning, Whitening)";
            setBookingStep(1);
        } else if (bookingStep === 1) {
            setBookingData({ ...bookingData, service: inputMessage });
            botResponse.text = `Great choice: **${inputMessage}**. What is your full name?`;
            setBookingStep(2);
        } else if (bookingStep === 2) {
            setBookingData({ ...bookingData, name: inputMessage });
            botResponse.text = `Nice to meet you, **${inputMessage}**! When would you like to visit us? (Any date works for me!)`;
            setBookingStep(3);
        } else if (bookingStep === 3) {
            setBookingData({ ...bookingData, date: inputMessage });
            botResponse.text = `Perfect. And what time would you prefer for your visit?`;
            setBookingStep(4);
        } else if (bookingStep === 4) {
            const confirmedBooking = {
                id: `BK-${Date.now()}`,
                name: bookingData.name,
                service: bookingData.service,
                date: bookingData.date,
                time: inputMessage,
                createdAt: new Date().toISOString()
            };
            addBooking(confirmedBooking);
            setBookingData({ ...bookingData, time: inputMessage });
            botResponse.text = `You're all set, ${bookingData.name}! 🎉 I've scheduled your **${bookingData.service}** for **${bookingData.date}** at **${inputMessage}**. We've sent a confirmation to our clinic staff. Anything else?`;
            setBookingStep(0);
            setBookingData({});
        } else {
            botResponse.text = "I can help you with bookings, clinic hours, or information about our dental services. Just let me know what you're interested in!";
        }

        setTimeout(() => {
            setMessages(prev => [...prev, botResponse]);
        }, 800);

        setInputMessage('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.8 }}
                    className="fixed bottom-6 right-6 z-[100] w-full max-w-[400px] h-[600px] flex flex-col bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-200"
                >
                    {/* Header */}
                    <div className="bg-slate-950 p-6 text-white flex items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">SmileCare AI</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Online Assistant</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 relative z-20 cursor-pointer"
                            aria-label="Close Chat"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                        {messages.map((msg, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: msg.type === 'bot' ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={i}
                                className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`flex gap-3 max-w-[85%] ${msg.type === 'bot' ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.type === 'bot' ? 'bg-sky-100 text-sky-600' : 'bg-slate-900 text-white'}`}>
                                        {msg.type === 'bot' ? <Sparkles size={14} /> : <User size={14} />}
                                    </div>
                                    <div className={`p-4 rounded-[24px] text-sm leading-relaxed shadow-sm ${msg.type === 'bot'
                                        ? 'bg-white text-slate-700'
                                        : 'bg-sky-600 text-white'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-6 bg-white border-t border-slate-100">
                        <div className="relative group">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your message..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-6 pr-14 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim()}
                                className="absolute right-2 top-2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-sky-600 transition-colors disabled:opacity-50"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <p className="mt-4 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                            AI-Powered by SmileCare Cloud
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ChatBot;
