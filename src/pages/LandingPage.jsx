import React from 'react';
import { useComplaint } from '../context/ComplaintContext';
import StreetlightMap from '../components/StreetlightMap';
import { 
  Camera, 
  Cpu, 
  Building2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
  Sparkles,
  Users,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck2,
  Lock,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  Image as ImageIcon,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

export default function LandingPage() {
  const { navigateTo } = useComplaint();

  return (
    <div style={{ padding: '1rem 0 5.5rem 0' }}>
      <div className="container-wide">
        
        {/* ========================================================
            HERO SECTION — HIGH IMPACT PRESENTATION
            ======================================================== */}
        <div style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '2.5rem 1.5rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.25)',
          border: '1px solid #1e293b'
        }}>
          {/* Subtle Background Glow Accent */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(2, 132, 199, 0.35) 0%, rgba(15, 23, 42, 0) 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '920px' }}>
            
            {/* Top Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span className="badge" style={{ backgroundColor: 'rgba(2, 132, 199, 0.2)', color: '#38bdf8', border: '1px solid #0284c7' }}>
                <Zap size={12} /> Live Municipal Telemetry
              </span>
              <span className="badge" style={{ backgroundColor: 'rgba(22, 163, 74, 0.2)', color: '#4ade80', border: '1px solid #16a34a' }}>
                <ShieldCheck size={12} /> Anti-Spoofing Vision AI
              </span>
              <span className="badge" style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid #9333ea' }}>
                <Users size={12} /> Smart Ticket Deduplication
              </span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(1.6rem, 5vw, 2.75rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1rem',
              color: '#ffffff'
            }}>
              SLQuery — Smart City Streetlight Monitoring & <span style={{ color: '#38bdf8' }}>Vision AI Audit</span>
            </h1>

            <p style={{
              fontSize: 'clamp(0.88rem, 2.5vw, 1.05rem)',
              color: '#94a3b8',
              lineHeight: 1.6,
              marginBottom: '1.75rem',
              maxWidth: '780px'
            }}>
              A unified civic-tech platform bridging citizens and municipal electrical engineers. Features automated <strong>Computer Vision defect verification</strong>, <strong>anti-spoofing fraud detection</strong>, and <strong>live GIS location mapping</strong>.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigateTo('complaint')}
                className="btn btn-primary btn-lg"
                style={{ fontWeight: 800, padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}
                id="landing-hero-report-btn"
              >
                <Camera size={19} />
                <span>Submit Streetlight Problem</span>
                <ArrowRight size={17} />
              </button>

              <button
                onClick={() => {
                  const mapElem = document.getElementById('gis-map-section');
                  if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-secondary btn-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '0.95rem'
                }}
              >
                <MapPin size={18} color="#38bdf8" />
                <span>Explore Live GIS Map</span>
              </button>
            </div>

          </div>

          {/* Key Metric Counters Bar */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1.25rem'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Telemetry
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
                100% <span style={{ fontSize: '0.8rem', color: '#38bdf8' }}>Coverage</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Connected Pole Sensors</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI Latency
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>
                ~1.2s <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Inference</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Vision Model Audit</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Anti-Spoofing
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4ade80' }}>
                Real / Fake <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Filter</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Stock & AI Deepfakes</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Ticket Clustering
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#c084fc' }}>
                Auto-Merge
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Duplicate Outages</div>
            </div>
          </div>

        </div>

        {/* ========================================================
            IMAGE ACCEPTANCE GUIDELINES: ACCEPTABLE VS NOT ACCEPTABLE
            ======================================================== */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          padding: '1.75rem',
          marginBottom: '2.5rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
        }}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#f0f9ff',
              color: '#0284c7',
              border: '1px solid #bae6fd',
              borderRadius: '99px',
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>
              <ShieldCheck size={14} />
              <span>AI Evidence Audit Protocol</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 900 }}>
              Image Submission Guidelines — What is Acceptable?
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b', maxWidth: '680px', margin: '0.35rem auto 0 auto' }}>
              Our Computer Vision AI automatically screens all uploaded evidence. Review what gets verified vs what gets rejected before submitting your complaint.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'stretch' }}>
            
            {/* Column 1: Acceptable Images (PASS) */}
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '2px solid #86efac',
              borderRadius: '14px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900
                }}>
                  <Check size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#14532d' }}>
                    Acceptable Images (Passes AI Audit)
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 600 }}>
                    Eligible for Instant Municipal Dispatch
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
                
                <div style={{ backgroundColor: '#ffffff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534' }}>
                      ✓ Single Defective Streetlight (Night Outage)
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.45 }}>
                    A clear, single photo of an unlit or dark streetlight at night. The zero-lux dark background confirms the electrical bulb outage.
                  </p>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534' }}>
                      ✓ Physical Pole Damage or Collision Trauma
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.45 }}>
                    Clear capture of a physically tilted, broken, or shattered pole fixture, loose electrical wiring, or structural hazard.
                  </p>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534' }}>
                      ✓ Direct On-Site Camera Capture
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.45 }}>
                    Original photograph taken directly through your phone or camera with authentic field metadata matching the reported GPS location.
                  </p>
                </div>

              </div>
            </div>

            {/* Column 2: Not Acceptable Images (REJECTED) */}
            <div style={{
              backgroundColor: '#fef2f2',
              border: '2px solid #fca5a5',
              borderRadius: '14px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900
                }}>
                  <X size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#7f1d1d' }}>
                    Not Acceptable (Auto-Rejected by AI)
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#b91c1c', fontWeight: 600 }}>
                    Flagged as Non-Actionable or Anti-Spoofing Fraud
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
                
                <div style={{ backgroundColor: '#ffffff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#991b1b' }}>
                      ✕ Multiple Working Lights (Zero Issue)
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.45 }}>
                    Photos showing rows of fully illuminated, healthy glowing streetlights with no broken bulbs are flagged as <em>"No Defect Found"</em> and rejected.
                  </p>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#991b1b' }}>
                      ✕ Google / Web Downloads & Stock Wallpapers
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.45 }}>
                    Images downloaded from Google Images, Bing, Unsplash, or stock wallpaper sites trigger Anti-Spoofing filters and are strictly blocked.
                  </p>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#991b1b' }}>
                      ✕ AI-Generated Images & Digital Screenshots
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.45 }}>
                    AI-generated synthetic art (Midjourney, DALL-E), UI screenshots, text documents, or non-street subjects (selfies, potholes, trash) fail verification.
                  </p>
                </div>

              </div>
            </div>

          </div>

          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <button
              onClick={() => navigateTo('complaint')}
              className="btn btn-primary"
              style={{ fontWeight: 800, padding: '0.65rem 1.5rem' }}
              id="guidelines-report-btn"
            >
              <Camera size={16} />
              <span>Ready to Report — Open AI Camera</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            LIVE GIS STREETLIGHT MAP SECTION
            ======================================================== */}
        <div id="gis-map-section" style={{ marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', color: '#0f172a', fontWeight: 800 }}>
                Live Metropolitan GIS Streetlight Grid
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Interactive spatial map displaying real-time telemetry across municipal road corridors.
              </p>
            </div>
            <span className="badge badge-green" style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}>
              ● Live Telemetry Synced
            </span>
          </div>

          <StreetlightMap />
        </div>

        {/* ========================================================
            FOUR CORE PILLARS / INNOVATIONS FOR JUDGES
            ======================================================== */}
        <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.45rem', color: '#0f172a', fontWeight: 900 }}>
              Engineered for Scalable Municipal Governance
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b', maxWidth: '600px', margin: '0.25rem auto 0 auto' }}>
              Four key pillars that transform noisy citizen reports into prioritized, actionable municipal repair tickets.
            </p>
          </div>

          <div className="grid-4">
            
            {/* Pillar 1 */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.85rem'
              }}>
                <ShieldCheck size={20} />
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Pillar 01
              </div>
              <h3 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.35rem', fontWeight: 800 }}>
                Anti-Spoofing & Deepfake Filter
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45 }}>
                Screens out stock internet images, AI-generated synthetic fakes, and non-streetlighting photos before entering the municipal queue.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#ede9fe',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.85rem'
              }}>
                <Users size={20} />
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Pillar 02
              </div>
              <h3 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.35rem', fontWeight: 800 }}>
                Smart Complaint Deduplication
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45 }}>
                Automatically merges multiple independent citizen complaints for the same pole into one consolidated ticket with elevated dispatch priority.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.85rem'
              }}>
                <Activity size={20} />
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Pillar 03
              </div>
              <h3 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.35rem', fontWeight: 800 }}>
                0-100% Accuracy Scoring
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45 }}>
                Multi-dimensional diagnostic score evaluating luminaire fixture presence, dark luminance levels, structural integrity, and address validity.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#fef3c7',
                color: '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.85rem'
              }}>
                <Building2 size={20} />
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Pillar 04
              </div>
              <h3 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.35rem', fontWeight: 800 }}>
                Municipal Dispatch Queue
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45 }}>
                Authorized officers access a real-time command dashboard with structured work orders, evidence slips, and repair resolution tracking.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
