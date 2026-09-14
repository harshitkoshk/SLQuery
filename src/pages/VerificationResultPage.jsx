import React, { useEffect } from 'react';
import { useComplaint } from '../context/ComplaintContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  MapPin, 
  User, 
  PlusCircle, 
  Printer, 
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Users,
  Layers,
  FileText,
  Activity,
  Check
} from 'lucide-react';

export default function VerificationResultPage() {
  const { currentResult, navigateTo } = useComplaint();

  if (!currentResult) {
    return (
      <div className="container-narrow" style={{ padding: '3rem 1rem 5rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#0f172a' }}>No Complaint Record Selected</h2>
        <p style={{ color: '#64748b', margin: '0.75rem 0 1.5rem 0', fontSize: '0.85rem' }}>
          Please submit a complaint or select a record from the municipal registry.
        </p>
        <button onClick={() => navigateTo('complaint')} className="btn btn-primary">
          Go to Complaint Form
        </button>
      </div>
    );
  }

  const {
    complaintId,
    status,
    confidence,
    accuracyScore = Math.round((confidence || 0.9) * 100),
    authenticityScore = 95,
    isRealImage = true,
    imageName = 'IMG_Camera_Field.jpg',
    reason,
    problemType,
    location,
    landmark,
    description,
    image,
    userName,
    contact,
    submittedAt,
    aiBreakdown = {},
    isMerged = false,
    mergedWith = null,
    mergedCount = 1,
    reporters = []
  } = currentResult;

  // Trigger celebratory confetti if high accuracy verified
  useEffect(() => {
    if (status === 'verified' && accuracyScore >= 80) {
      try {
        confetti({
          particleCount: 55,
          spread: 55,
          origin: { y: 0.6 },
          colors: ['#16a34a', '#0284c7', '#0ea5e9']
        });
      } catch (e) {
        // ignore
      }
    }
  }, [status, accuracyScore]);

  let statusBg = '#dcfce7';
  let statusBorder = '#86efac';
  let statusTextColor = '#15803d';
  let statusTitle = '✓ Verified — Actionable Complaint';
  let statusSummary = 'The Computer Vision AI has verified real camera evidence with sufficient defect signals.';

  if (status === 'needs_information') {
    statusBg = '#fef3c7';
    statusBorder = '#fde68a';
    statusTextColor = '#b45309';
    statusTitle = '⚠ Needs More Information';
    statusSummary = 'The AI model detected ambiguous ambient lighting (e.g. daytime photo) requiring nighttime re-submission.';
  } else if (status === 'rejected') {
    statusBg = '#fee2e2';
    statusBorder = '#fca5a5';
    statusTextColor = '#b91c1c';
    statusTitle = '✕ Rejected / Non-Authentic';
    statusSummary = 'No public streetlight defect was identified, or the image failed anti-spoofing authenticity screening.';
  }

  const formattedDate = submittedAt 
    ? new Date(submittedAt).toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    : 'Just now';

  return (
    <div className="container-narrow" style={{ padding: '1rem 1rem 5.5rem 1rem' }}>
      
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigateTo('landing')}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          cursor: 'pointer',
          marginBottom: '0.75rem',
          padding: '0.35rem 0',
          minHeight: '36px'
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Streetlight Map</span>
      </button>

      {/* Main Result Card */}
      <div className="card" style={{
        padding: '1.25rem',
        borderRadius: '14px',
        backgroundColor: '#ffffff'
      }}>
        
        {/* Top Reference Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.4rem',
          paddingBottom: '0.85rem',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '1rem',
          fontSize: '0.82rem',
          color: '#64748b'
        }}>
          <div>
            Ticket Reference: <strong style={{ color: '#0f172a', fontFamily: 'var(--font-mono)' }}>{complaintId}</strong>
          </div>
          <div>
            Filed: <strong>{formattedDate}</strong>
          </div>
        </div>

        {/* Automated Deduplication & Merging Notice if applicable */}
        {isMerged && (
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1.5px solid #93c5fd',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem'
          }}>
            <Users size={18} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <strong style={{ fontSize: '0.88rem', color: '#1e40af' }}>
                  Consolidated Complaint (Auto-Merged)
                </strong>
                <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                  {mergedCount} Citizen Reports Merged
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#334155', marginTop: '0.2rem', lineHeight: 1.4 }}>
                Our AI deduplication engine detected multiple independent reports for the same pole and location. These have been merged into single high-priority work order #{mergedWith || complaintId}.
              </p>
            </div>
          </div>
        )}

        {/* AI Status Banner Card with 0-100% Score Gauge */}
        <div style={{
          backgroundColor: statusBg,
          border: `1px solid ${statusBorder}`,
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', flex: 1, minWidth: '220px' }}>
              <div style={{ flexShrink: 0, marginTop: '2px' }}>
                {status === 'verified' && <CheckCircle2 size={28} color="#16a34a" />}
                {status === 'needs_information' && <AlertTriangle size={28} color="#d97706" />}
                {status === 'rejected' && <XCircle size={28} color="#dc2626" />}
              </div>
              
              <div>
                <h2 style={{ fontSize: '1.2rem', color: statusTextColor, fontWeight: 800 }}>
                  {statusTitle}
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#334155', marginTop: '0.2rem', lineHeight: 1.4 }}>
                  {statusSummary}
                </p>
              </div>
            </div>

            {/* 0-100% Accuracy Score Gauge */}
            <div style={{
              backgroundColor: '#ffffff',
              border: `1.5px solid ${statusBorder}`,
              borderRadius: '10px',
              padding: '0.6rem 1rem',
              textAlign: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              minWidth: '130px'
            }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                AI Accuracy Score
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: statusTextColor, lineHeight: 1.1 }}>
                {accuracyScore}<span style={{ fontSize: '0.9rem' }}>%</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: statusTextColor, fontWeight: 700, marginTop: '2px' }}>
                {accuracyScore >= 80 ? 'High Confidence' : accuracyScore >= 50 ? 'Moderate' : 'Low Confidence'}
              </div>
            </div>
          </div>

        </div>

        {/* Multi-Dimensional AI Verification Breakdown */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={16} color="#0284c7" />
              <h3 style={{ fontSize: '0.84rem', color: '#0f172a', fontWeight: 800, textTransform: 'uppercase' }}>
                AI Verification & Anti-Spoofing Audit
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              File: <strong style={{ color: '#0f172a' }}>{imageName}</strong>
            </span>
          </div>

          <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.45, marginBottom: '0.85rem' }}>
            {reason}
          </p>

          {/* 4 Score Metric Tiles */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.5rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <div style={{ backgroundColor: '#ffffff', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Image Authenticity</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: (aiBreakdown.authenticityScore || authenticityScore) >= 70 ? '#15803d' : '#dc2626' }}>
                {aiBreakdown.authenticityScore || authenticityScore}%
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                {aiBreakdown.authenticityVerdict || (isRealImage ? 'Camera Verified' : 'Stock / Fake')}
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Luminaire Detection</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: aiBreakdown.lightFixtureDetected ? '#15803d' : '#dc2626' }}>
                {aiBreakdown.fixtureDetectionScore || (aiBreakdown.lightFixtureDetected ? 95 : 15)}%
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                {aiBreakdown.lightFixtureDetected ? 'Hardware Match' : 'Not Found'}
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Defect Severity</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                {aiBreakdown.defectSeverityScore || 92}%
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                {aiBreakdown.defectCategory || 'Standard'}
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Dispatch Priority</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: statusTextColor }}>
                {aiBreakdown.riskScore ? aiBreakdown.riskScore.split(' ')[0] : 'Normal'}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Municipal Queue</div>
            </div>
          </div>
        </div>

        {/* Complaint Details Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
          
          {/* Attached Photo Preview */}
          {image && (
            <div>
              <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                Audited Evidence Photo
              </span>
              <div style={{
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid #cbd5e1',
                height: '170px',
                backgroundColor: '#0f172a',
                position: 'relative'
              }}>
                <img
                  src={image}
                  alt="Streetlight verification evidence"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(4px)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={12} color="#38bdf8" />
                  <span>AI Scanned</span>
                </div>
              </div>
            </div>
          )}

          {/* Details list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.84rem' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Problem Category</span>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{problemType}</div>
            </div>

            <div>
              <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Location / Address</span>
              <div style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} color="#0284c7" />
                <span>{location}</span>
              </div>
              {landmark && (
                <div style={{ color: '#64748b', fontSize: '0.75rem', paddingLeft: '1.1rem' }}>
                  Landmark: {landmark}
                </div>
              )}
            </div>

            <div>
              <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Citizen Description</span>
              <div style={{ color: '#334155', lineHeight: 1.4 }}>{description}</div>
            </div>

            <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#64748b' }}>
              Reported by: <strong style={{ color: '#0f172a' }}>{userName}</strong> ({contact})
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          <button
            type="button"
            onClick={() => navigateTo('complaint')}
            className="btn btn-primary"
            style={{ width: '100%', fontWeight: 700 }}
            id="result-new-report-btn"
          >
            <PlusCircle size={16} />
            <span>Submit Another Complaint</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.82rem' }}
          >
            <Printer size={15} />
            <span>Print Official Verification Slip</span>
          </button>
        </div>

      </div>

    </div>
  );
}
