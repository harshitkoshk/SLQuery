import React from 'react';
import { Lightbulb, ShieldCheck, MapPin } from 'lucide-react';
import { useComplaint } from '../context/ComplaintContext';

export default function Footer() {
  const { navigateTo } = useComplaint();

  return (
    <footer style={{
      marginTop: 'auto',
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: '1.5rem 0 calc(1.5rem + var(--bottom-bar-height)) 0',
      color: '#64748b'
    }}>
      <div className="container-wide">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '0.65rem',
          fontSize: '0.78rem'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Lightbulb size={16} color="#0284c7" />
            <span style={{ fontWeight: 800, color: '#0f172a' }}>
              SLQuery — Smart Streetlight Operations & AI Audit Platform
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center', color: '#64748b', fontSize: '0.75rem' }}>
            <span>Municipal Department of Public Works</span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span>Real-time GIS Telemetry</span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span>Computer Vision Anti-Spoofing</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
