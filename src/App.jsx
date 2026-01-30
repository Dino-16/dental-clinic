import { useState } from 'react'

function App() {
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Welcome to SmileCare Dental! How can I help you today?' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [bookingStep, setBookingStep] = useState(0)
  const [bookingData, setBookingData] = useState({})
  const [bookings, setBookings] = useState([])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage = { type: 'user', text: inputMessage }
    setMessages([...messages, userMessage])

    // Simple AI bot logic for booking
    let botResponse = { type: 'bot', text: '' }
    
    if (inputMessage.toLowerCase().includes('book') || inputMessage.toLowerCase().includes('appointment')) {
      botResponse.text = "I'd be happy to help you book an appointment! What service are you looking for?"
      setBookingStep(1)
    } else if (bookingStep === 1) {
      setBookingData({ ...bookingData, service: inputMessage })
      botResponse.text = "Thanks! What is your name?"
      setBookingStep(2)
    } else if (bookingStep === 2) {
      setBookingData({ ...bookingData, name: inputMessage })
      botResponse.text = "Great! What date would you prefer for your appointment?"
      setBookingStep(3)
    } else if (bookingStep === 3) {
      setBookingData({ ...bookingData, date: inputMessage })
      botResponse.text = "Perfect! What time works best for you?"
      setBookingStep(4)
    } else if (bookingStep === 4) {
      const confirmedBooking = {
        id: `BK-${Date.now()}`,
        name: bookingData.name,
        service: bookingData.service,
        date: bookingData.date,
        time: inputMessage,
        createdAt: new Date().toISOString()
      }
      setBookings((prev) => [confirmedBooking, ...prev])
      setBookingData({ ...bookingData, time: inputMessage })
      botResponse.text = `Excellent, ${bookingData.name}! Your appointment is confirmed:\nService: ${bookingData.service}\nDate: ${bookingData.date}\nTime: ${inputMessage}\n\nWe'll send you a confirmation shortly. Is there anything else I can help you with?`
      setBookingStep(0)
      setBookingData({})
    } else {
      botResponse.text = "I can help you book appointments, answer questions about our services, or provide clinic information. What would you like to know?"
    }

    setTimeout(() => {
      setMessages(prev => [...prev, botResponse])
    }, 1000)

    setInputMessage('')
  }

  return (
    <div className="min-h-screen bg-[#f7fbff] text-slate-900">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#dff1ff,_transparent_60%)]" />
        <div className="relative z-10">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">🦷</span>
              <div>
                <p className="text-lg font-semibold">SmileCare Dental</p>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Gentle care studio</p>
              </div>
            </div>
            <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
              <a href="#services" className="hover:text-sky-600">Services</a>
              <a href="#technology" className="hover:text-sky-600">Technology</a>
              <a href="#reviews" className="hover:text-sky-600">Reviews</a>
              <a href="#bookings" className="hover:text-sky-600">Bookings</a>
              <a href="#contact" className="hover:text-sky-600">Contact</a>
              <button
                onClick={() => setChatOpen(true)}
                className="rounded-full bg-sky-600 px-5 py-2 text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700"
              >
                AI Booking
              </button>
            </div>
          </nav>

          <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-4 py-2 text-xs font-semibold text-sky-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Open today · Same-day emergencies
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
                Calm, modern dentistry
                <span className="block text-sky-700">for brighter, healthier smiles.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-slate-600 md:text-lg">
                From gentle cleanings to cosmetic makeovers, our clinic blends comfort-first care with
                intelligent scheduling so you can book in seconds.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setChatOpen(true)}
                  className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700"
                >
                  Start AI Reservation
                </button>
                <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-200">
                  Call (555) 123-4567
                </button>
              </div>
              <div className="mt-10 grid max-w-lg gap-4 sm:grid-cols-3">
                {[
                  { value: '4.9', label: 'Patient rating' },
                  { value: '10k+', label: 'Smiles restored' },
                  { value: '20+', label: 'Years of care' }
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white/80 p-4 text-center shadow-sm">
                    <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-sky-100 blur-2xl" />
              <div className="relative rounded-[32px] bg-white p-6 shadow-xl">
                <div className="rounded-3xl bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Today’s schedule</span>
                    <span className="text-emerald-600">AI ready</span>
                  </div>
                  <div className="mt-4 space-y-4">
                    {[
                      { time: '9:30 AM', name: 'Emma J.', service: 'Teeth Cleaning' },
                      { time: '11:00 AM', name: 'Noah R.', service: 'Invisalign consult' },
                      { time: '2:15 PM', name: 'Mia K.', service: 'Smile makeover' }
                    ].map((slot) => (
                      <div key={slot.name} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{slot.name}</p>
                          <p className="text-xs text-slate-500">{slot.service}</p>
                        </div>
                        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">{slot.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 right-6 rounded-3xl bg-white px-6 py-4 shadow-lg">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Next slot</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">Today, 4:30 PM</p>
              </div>
            </div>
          </section>
        </div>
      </header>

      <section id="services" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Signature care</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">All the dental services you need.</h2>
          </div>
          <button className="rounded-full border border-sky-100 bg-white px-5 py-2 text-sm font-semibold text-slate-600 shadow-sm">
            View full menu
          </button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Comfort Dentistry',
              description: 'Gentle cleanings, exams, and preventive care in spa-like suites.',
              icon: '🪥'
            },
            {
              title: 'Cosmetic Studio',
              description: 'Whitening, veneers, and smile design crafted for confidence.',
              icon: '✨'
            },
            {
              title: 'Restorative Care',
              description: 'Implants, crowns, and same-day solutions for lasting health.',
              icon: '🦷'
            }
          ].map((service) => (
            <div key={service.title} className="rounded-[28px] border border-white bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-2xl">
                {service.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{service.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="bookings" className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">AI reservations</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Live booking feed.</h2>
            </div>
            <span className="rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500">
              {bookings.length} total bookings
            </span>
          </div>
          {bookings.length === 0 ? (
            <div className="mt-10 rounded-[26px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No bookings yet. Use the AI assistant to create the first reservation.
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {bookings.map((booking) => (
                <div key={booking.id} className="rounded-[26px] border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{booking.service}</p>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      Confirmed
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-slate-600">
                    <p><span className="font-semibold text-slate-800">Patient:</span> {booking.name}</p>
                    <p><span className="font-semibold text-slate-800">Date:</span> {booking.date}</p>
                    <p><span className="font-semibold text-slate-800">Time:</span> {booking.time}</p>
                    <p><span className="font-semibold text-slate-800">ID:</span> {booking.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="technology" className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Smart clinic</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900">Comfort-driven technology.</h2>
            <p className="mt-4 text-sm text-slate-600">
              We use digital scanners, ultra-quiet instruments, and AI-assisted scheduling so your visit is
              efficient, precise, and stress-free.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                '3D imaging for accurate diagnoses',
                'Low-radiation digital X-rays',
                'Noise-reducing treatment rooms',
                'Flexible financing & insurance'
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <span className="mt-1 text-emerald-500">✓</span>
                  <p className="text-sm text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">AI booking</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">Reserve in under 60 seconds.</h3>
              <p className="mt-3 text-sm text-slate-600">
                The AI assistant finds the best time, confirms services, and sends reminders instantly.
              </p>
              <button
                onClick={() => setChatOpen(true)}
                className="mt-6 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800"
              >
                Try the AI assistant
              </button>
            </div>
            <div className="rounded-[28px] bg-sky-600 px-6 py-8 text-white shadow-lg shadow-sky-200">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-100">Patient promise</p>
              <h3 className="mt-3 text-xl font-semibold">You’ll leave smiling.</h3>
              <p className="mt-3 text-sm text-sky-100">
                Our dentists take time to listen, explain options, and ensure every visit feels calm.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Patient stories</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Loved by families across the city.</h2>
          </div>
          <div className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-slate-500 shadow-sm">4.9 ★ average rating</div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              quote: 'The cleanest, calmest clinic I’ve visited. My cleaning was painless and quick.',
              name: 'Sophia L.'
            },
            {
              quote: 'Loved the AI booking tool. It found a slot that matched my schedule instantly.',
              name: 'James P.'
            },
            {
              quote: 'They explained every step and made my smile makeover totally stress-free.',
              name: 'Amira G.'
            }
          ].map((review) => (
            <div key={review.name} className="rounded-[26px] border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">“{review.quote}”</p>
              <p className="mt-5 text-sm font-semibold text-slate-900">{review.name}</p>
              <div className="mt-3 text-xs text-amber-500">★★★★★</div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-slate-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">Visit us</p>
            <h2 className="mt-4 text-3xl font-semibold">Feel cared for the moment you arrive.</h2>
            <p className="mt-4 text-sm text-slate-300">
              123 Health Street, Medical City · Mon-Sat 8:30 AM - 7:00 PM
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => setChatOpen(true)}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900"
              >
                Reserve with AI
              </button>
              <button className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white">
                Call (555) 123-4567
              </button>
            </div>
          </div>
          <div className="rounded-[28px] bg-white/10 p-6">
            <h3 className="text-lg font-semibold">Quick contact</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              <p>📞 (555) 123-4567</p>
              <p>📧 hello@smilecare.com</p>
              <p>💬 WhatsApp: +1 (555) 321-9981</p>
              <p>📍 123 Health Street, Medical City</p>
            </div>
            <div className="mt-6 rounded-2xl bg-white/10 px-4 py-3 text-xs text-slate-300">
              Emergency? Call us anytime and we’ll prioritize your visit.
            </div>
          </div>
        </div>
      </section>

      {chatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[340px] overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">SmileCare AI</p>
              <p className="text-xs text-slate-300">Instant booking assistant</p>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="rounded-full bg-white/10 px-3 py-1 text-xs"
            >
              Close
            </button>
          </div>
          <div className="h-72 overflow-y-auto space-y-3 bg-slate-50 px-4 py-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-xs ${
                    message.type === 'user'
                      ? 'bg-sky-600 text-white'
                      : 'bg-white text-slate-700 shadow-sm'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about appointments..."
                className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-xs focus:border-sky-500 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
