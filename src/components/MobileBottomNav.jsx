import React from 'react';
import { useComplaint } from '../context/ComplaintContext';
import { MapPin, PlusCircle, FileText, Sparkles, Lock } from 'lucide-react';

export default function MobileBottomNav() {
  const { currentPage, navigateTo, isAdminAuth } = useComplaint();

  const handlePortalClick = () => {
    if (isAdminAuth) {
      navigateTo('dashboard');
    } else {
      // Trigger login prompt or open dashboard directly if authorized
      navigateTo('dashboard');
    }
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      
      {/* 1. Map Navigation Tab */}
      <button
        type="button"
        onClick={() => navigateTo('landing')}
        className={`mobile-bottom-tab ${currentPage === 'landing' ? 'active' : ''}`}
        id="mobile-nav-map"
      >
        <MapPin size={20} />
        <span>Live Grid</span>
      </button>

      {/* 2. Center Primary Action: Report Broken Streetlight */}
      <button
        type="button"
        onClick={() => navigateTo('complaint')}
        className="mobile-fab-center"
        aria-label="Report Streetlight Issue"
        id="mobile-nav-report"
      >
        <PlusCircle size={28} />
      </button>

      {/* 3. Department Portal Tab */}
      <button
        type="button"
        onClick={handlePortalClick}
        className={`mobile-bottom-tab ${currentPage === 'dashboard' ? 'active' : ''}`}
        id="mobile-nav-portal"
      >
        <FileText size={20} />
        <span>Registry</span>
      </button>

      {/* 4. AI Verification Tab */}
      <button
        type="button"
        onClick={() => navigateTo('complaint')}
        className={`mobile-bottom-tab ${currentPage === 'complaint' ? 'active' : ''}`}
        id="mobile-nav-ai"
      >
        <Sparkles size={20} />
        <span>AI Audit</span>
      </button>

    </nav>
  );
}
