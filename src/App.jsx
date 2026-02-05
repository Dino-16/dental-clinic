import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ServiceDetailPage from './pages/ServiceDetailPage';

function App() {
  return (
    <BookingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/service/:id" element={<ServiceDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </BookingProvider>
  );
}

export default App;
