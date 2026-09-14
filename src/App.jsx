import React from 'react';
import { ComplaintProvider, useComplaint } from './context/ComplaintContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import LandingPage from './pages/LandingPage';
import ComplaintPage from './pages/ComplaintPage';
import VerificationResultPage from './pages/VerificationResultPage';
import DashboardPage from './pages/DashboardPage';

function AppContent() {
  const { currentPage } = useComplaint();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        {currentPage === 'landing' && <LandingPage />}
        {currentPage === 'complaint' && <ComplaintPage />}
        {currentPage === 'result' && <VerificationResultPage />}
        {currentPage === 'dashboard' && <DashboardPage />}
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <ComplaintProvider>
      <AppContent />
    </ComplaintProvider>
  );
}
