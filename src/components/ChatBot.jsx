import { useState, useRef, useEffect } from 'react';
import { useBookings } from '../context/BookingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, Sparkles } from 'lucide-react';

function ChatBot({ isOpen, onClose }) {
    const { addBooking, addMessage } = useBookings();
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: 'Connection established. 👋 I am your autonomous dental assistant. How can I assist your schedule today?'
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
            botResponse.text = `Nice to meet you, **${inputMessage}**! When would you like to visit us? (Please use YYYY-MM-DD format for best results)`;
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
            botResponse.text = `Resource allocated, ${bookingData.name}! 🎉 I've scheduled your **${bookingData.service}** for **${bookingData.date}** at **${inputMessage}**. We've synchronized this with our master schedule. Anything else?`;
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
                    className="fixed bottom-6 right-6 z-[100] w-full max-w-[360px] h-[540px] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
                >
                    {/* Header */}
                    <div className="bg-slate-950 p-5 text-white flex items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-base leading-tight tracking-tight">SMILE<span className="text-indigo-400">CARE</span> AI</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Autonomous Sync</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 relative z-20 cursor-pointer"
                            aria-label="Close Chat"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50">
                        {messages.map((msg, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: msg.type === 'bot' ? -15 : 15 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={i}
                                className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`flex gap-2.5 max-w-[88%] ${msg.type === 'bot' ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.type === 'bot' ? 'bg-indigo-100 text-indigo-600 shadow-sm border border-indigo-100' : 'bg-slate-950 text-white shadow-sm'}`}>
                                        {msg.type === 'bot' ? <Sparkles size={14} /> : <User size={14} />}
                                    </div>
                                    <div className={`p-3.5 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm ${msg.type === 'bot'
                                        ? 'bg-white text-slate-700'
                                        : 'bg-indigo-600 text-white'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-5 bg-white border-t border-slate-100">
                        <div className="relative group">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Command AI assistant..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-5 pr-12 text-[13px] font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim()}
                                className="absolute right-1.5 top-1.5 w-9 h-9 bg-slate-950 text-white rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors disabled:opacity-50"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                        <p className="mt-3 text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">
                            SmileCare OS · v2.4.0
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ChatBot;
