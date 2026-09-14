import React, { useState } from 'react';
import { useComplaint } from '../context/ComplaintContext';
import { apiClient } from '../services/api';
import { Cpu, CheckCircle2, AlertTriangle, XCircle, Sparkles, ChevronDown, ChevronUp, X } from 'lucide-react';

export default function DevModeSwitcher() {
  const { devForceState, setDevForceState } = useComplaint();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(var(--bottom-bar-height) + var(--safe-area-bottom) + 12px)',
      right: '12px',
      zIndex: 590,
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        borderRadius: '10px',
        overflow: 'hidden',
        maxWidth: '280px',
        width: isOpen ? '280px' : 'auto'
      }}>
        {/* Toggle Button */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.75rem',
            cursor: 'pointer',
            backgroundColor: isOpen ? '#f1f5f9' : '#ffffff',
            borderBottom: isOpen ? '1px solid #e2e8f0' : 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#334155',
            userSelect: 'none',
            whiteSpace: 'nowrap'
          }}
          id="dev-mode-toggle"
        >
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#0284c7',
            flexShrink: 0
          }} />
          <Cpu size={13} color="#0284c7" />
          <span>AI Override: <strong style={{ color: '#0284c7', textTransform: 'capitalize' }}>{devForceState.replace('_', ' ')}</strong></span>
          {isOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </div>

        {/* Panel */}
        {isOpen && (
          <div style={{ padding: '0.75rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Override AI model output for prototype testing:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              
              <button
                type="button"
                onClick={() => {
                  setDevForceState('auto');
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.55rem',
                  borderRadius: '6px',
                  border: devForceState === 'auto' ? '1px solid #0284c7' : '1px solid #e2e8f0',
                  background: devForceState === 'auto' ? '#e0f2fe' : '#ffffff',
                  color: devForceState === 'auto' ? '#0369a1' : '#334155',
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  textAlign: 'left'
                }}
              >
                <Sparkles size={13} color="#0284c7" />
                <span>Auto (Smart Vision AI)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDevForceState('verified');
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.55rem',
                  borderRadius: '6px',
                  border: devForceState === 'verified' ? '1px solid #16a34a' : '1px solid #e2e8f0',
                  background: devForceState === 'verified' ? '#dcfce7' : '#ffffff',
                  color: devForceState === 'verified' ? '#15803d' : '#334155',
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  textAlign: 'left'
                }}
              >
                <CheckCircle2 size={13} color="#16a34a" />
                <span>Force: Verified (Green)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDevForceState('needs_information');
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.55rem',
                  borderRadius: '6px',
                  border: devForceState === 'needs_information' ? '1px solid #d97706' : '1px solid #e2e8f0',
                  background: devForceState === 'needs_information' ? '#fef3c7' : '#ffffff',
                  color: devForceState === 'needs_information' ? '#b45309' : '#334155',
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  textAlign: 'left'
                }}
              >
                <AlertTriangle size={13} color="#d97706" />
                <span>Force: Needs Info (Yellow)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDevForceState('rejected');
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.55rem',
                  borderRadius: '6px',
                  border: devForceState === 'rejected' ? '1px solid #dc2626' : '1px solid #e2e8f0',
                  background: devForceState === 'rejected' ? '#fee2e2' : '#ffffff',
                  color: devForceState === 'rejected' ? '#b91c1c' : '#334155',
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  textAlign: 'left'
                }}
              >
                <XCircle size={13} color="#dc2626" />
                <span>Force: Rejected (Red)</span>
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
