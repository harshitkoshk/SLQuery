import React, { useState } from 'react';
import { useComplaint } from '../context/ComplaintContext';
import { 
  Lightbulb, 
  MapPin, 
  Lock, 
  PlusCircle, 
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  User,
  KeyRound,
  AlertCircle
} from 'lucide-react';

export default function Navbar() {
  const { currentPage, navigateTo, isAdminAuth, loginAdmin } = useComplaint();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleAdminAccess = (e) => {
    e.preventDefault();
    if (loginAdmin(username, password)) {
      setShowAdminModal(false);
      setUsername('');
      setPassword('');
      setAuthError('');
      setMobileMenuOpen(false);
      navigateTo('dashboard');
    } else {
      setAuthError('Invalid credentials. Access restricted to authorized municipal engineering staff.');
    }
  };

  const handleOpenDepartmentPortal = () => {
    if (isAdminAuth) {
      setMobileMenuOpen(false);
      navigateTo('dashboard');
    } else {
      setShowAdminModal(true);
    }
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 500,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div className="container-wide" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 'var(--nav-height-mobile)',
          minHeight: '60px'
        }}>
          
          {/* Logo & Portal Identity */}
          <div 
            onClick={() => {
              setMobileMenuOpen(false);
              navigateTo('landing');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
            id="nav-logo"
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
              flexShrink: 0
            }}>
              <Lightbulb size={21} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                  SL<span style={{ color: '#0284c7' }}>Query</span>
                </span>
                <span className="badge badge-blue" style={{ fontSize: '0.62rem', padding: '0.15rem 0.5rem' }}>
                  Smart City GIS
                </span>
              </div>
              <p style={{ fontSize: '0.68rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                Streetlight Operations & AI Audit
              </p>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="desktop-only" style={{ alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => navigateTo('landing')}
              className={`btn btn-sm ${currentPage === 'landing' ? 'btn-secondary' : ''}`}
              style={{
                background: currentPage === 'landing' ? '#f1f5f9' : 'transparent',
                border: 'none',
                color: currentPage === 'landing' ? '#0284c7' : '#475569',
                fontWeight: 600
              }}
            >
              <MapPin size={15} />
              <span>Live Grid Map</span>
            </button>

            {/* Department Internal Portal */}
            <button
              type="button"
              onClick={handleOpenDepartmentPortal}
              className="btn btn-sm btn-secondary"
              style={{
                color: '#334155',
                fontSize: '0.8rem',
                gap: '0.4rem',
                border: '1px solid #cbd5e1'
              }}
              id="nav-dept-login-btn"
            >
              <Lock size={13} color="#0284c7" />
              <span>Department Portal</span>
            </button>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => navigateTo('complaint')}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: 700, padding: '0.45rem 1rem' }}
              id="nav-report-btn"
            >
              <PlusCircle size={15} />
              <span>Report an Issue</span>
            </button>
          </nav>

          {/* Mobile Right Controls: Quick Report + Menu Toggle */}
          <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => navigateTo('complaint')}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', minHeight: '34px' }}
              id="mobile-header-report-btn"
            >
              <PlusCircle size={14} />
              <span>Report</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#334155',
                cursor: 'pointer'
              }}
              aria-label="Toggle Menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Slide Drawer Menu */}
        {mobileMenuOpen && (
          <div style={{
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            padding: '1rem',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
          }} className="animate-fade-in mobile-only">
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo('landing');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '8px',
                  background: currentPage === 'landing' ? '#f0f9ff' : '#f8fafc',
                  border: currentPage === 'landing' ? '1px solid #bae6fd' : '1px solid #e2e8f0',
                  color: currentPage === 'landing' ? '#0284c7' : '#0f172a',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <MapPin size={18} color="#0284c7" />
                  <span>Live Streetlight GIS Grid</span>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo('complaint');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '8px',
                  background: currentPage === 'complaint' ? '#f0f9ff' : '#f8fafc',
                  border: currentPage === 'complaint' ? '1px solid #bae6fd' : '1px solid #e2e8f0',
                  color: currentPage === 'complaint' ? '#0284c7' : '#0f172a',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <PlusCircle size={18} color="#0284c7" />
                  <span>Submit Problem with AI Camera</span>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </button>

              <button
                type="button"
                onClick={handleOpenDepartmentPortal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '8px',
                  background: '#0f172a',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Lock size={18} color="#38bdf8" />
                  <span>Municipal Department Portal</span>
                </div>
                <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>Staff Login</span>
              </button>

            </div>

            <div style={{
              marginTop: '0.85rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid #f1f5f9',
              fontSize: '0.75rem',
              color: '#64748b',
              textAlign: 'center'
            }}>
              Municipal Public Works • Central Telemetry & Vision AI
            </div>

          </div>
        )}
      </header>

      {/* Official Department Staff Authentication Modal (Username + Password) */}
      {showAdminModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '1.75rem', position: 'relative' }}>
            
            <button
              type="button"
              onClick={() => {
                setShowAdminModal(false);
                setAuthError('');
              }}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: '10px', backgroundColor: '#0f172a', color: '#38bdf8' }}>
                <Lock size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>Municipal Officer Login</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Department of Electrical & Public Works</span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.25rem', marginTop: '0.25rem' }}>
              Access to centralized citizen tickets, AI anti-spoofing logs, and maintenance dispatch queue is restricted to authorized personnel.
            </p>

            {authError && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminAccess}>
              <div className="form-group" style={{ marginBottom: '0.9rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>
                  Officer Username / ID
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.3rem' }}
                    autoFocus
                    required
                  />
                  <User size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>
                  Security Passcode
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    placeholder="Enter passcode"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.3rem' }}
                    required
                  />
                  <KeyRound size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', fontWeight: 700 }}
              >
                Authenticate & Enter Portal
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
