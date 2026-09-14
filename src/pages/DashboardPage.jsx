import React, { useState } from 'react';
import { useComplaint } from '../context/ComplaintContext';
import { 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  MapPin, 
  PlusCircle, 
  Eye, 
  Lock, 
  LogOut, 
  X, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Users, 
  ShieldCheck, 
  ShieldAlert,
  FileCheck,
  Filter
} from 'lucide-react';

export default function DashboardPage() {
  const { complaints, navigateTo, setCurrentResult, logoutAdmin } = useComplaint();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const filtered = complaints.filter((item) => {
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !q ||
      item.complaintId.toLowerCase().includes(q) ||
      item.problemType.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      (item.userName && item.userName.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  const total = complaints.length;
  const verifiedCount = complaints.filter(c => c.status === 'verified').length;
  const needsInfoCount = complaints.filter(c => c.status === 'needs_information').length;
  const rejectedCount = complaints.filter(c => c.status === 'rejected').length;
  const mergedClustersCount = complaints.filter(c => c.isMerged || (c.mergedCount && c.mergedCount > 1)).length;

  return (
    <div className="container-wide" style={{ padding: '1rem 1rem 5.5rem 1rem' }}>
      
      {/* Page Header - Executive Municipal Portal */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        marginBottom: '1.25rem',
        backgroundColor: '#ffffff',
        padding: '1.25rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.55rem', borderRadius: '10px', backgroundColor: '#0f172a', color: '#38bdf8' }}>
              <Lock size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>
                  Central Municipal Complaints Registry
                </h1>
                <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>Department Portal</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Automated AI Vision Verification, Anti-Spoofing Audit & Duplicate Clustering Feed
              </p>
            </div>
          </div>

          <button
            onClick={logoutAdmin}
            className="btn btn-secondary btn-sm"
            style={{ color: '#dc2626', fontSize: '0.78rem', minHeight: '34px', gap: '0.35rem' }}
            title="Sign out of municipal portal"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigateTo('complaint')}
            className="btn btn-primary btn-sm"
            style={{ minHeight: '36px', fontSize: '0.8rem', flex: '1', minWidth: '150px' }}
          >
            <PlusCircle size={15} />
            <span>New Complaint Form</span>
          </button>
          <button
            onClick={() => navigateTo('landing')}
            className="btn btn-secondary btn-sm"
            style={{ minHeight: '36px', fontSize: '0.8rem', flex: '1', minWidth: '150px' }}
          >
            <MapPin size={15} />
            <span>Live Streetlight GIS Map</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
        
        <div 
          onClick={() => setFilterStatus('all')}
          className="card"
          style={{
            padding: '0.85rem 1rem',
            cursor: 'pointer',
            border: filterStatus === 'all' ? '2px solid #0284c7' : '1px solid #e2e8f0',
            backgroundColor: filterStatus === 'all' ? '#f0f9ff' : '#ffffff'
          }}
        >
          <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Tickets
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '0.1rem' }}>
            {total}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#0284c7', fontWeight: 600 }}>All Submissions</div>
        </div>

        <div 
          onClick={() => setFilterStatus('verified')}
          className="card"
          style={{
            padding: '0.85rem 1rem',
            cursor: 'pointer',
            border: filterStatus === 'verified' ? '2px solid #16a34a' : '1px solid #e2e8f0',
            backgroundColor: filterStatus === 'verified' ? '#f0fdf4' : '#ffffff'
          }}
        >
          <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
            AI Verified
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d', marginTop: '0.1rem' }}>
            {verifiedCount}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#15803d', fontWeight: 600 }}>Dispatch Work Orders</div>
        </div>

        <div 
          onClick={() => setFilterStatus('needs_information')}
          className="card"
          style={{
            padding: '0.85rem 1rem',
            cursor: 'pointer',
            border: filterStatus === 'needs_information' ? '2px solid #d97706' : '1px solid #e2e8f0',
            backgroundColor: filterStatus === 'needs_information' ? '#fffbeb' : '#ffffff'
          }}
        >
          <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
            Needs Info / Daytime
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b45309', marginTop: '0.1rem' }}>
            {needsInfoCount}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#b45309', fontWeight: 600 }}>Pending Re-submission</div>
        </div>

        <div 
          onClick={() => setFilterStatus('rejected')}
          className="card"
          style={{
            padding: '0.85rem 1rem',
            cursor: 'pointer',
            border: filterStatus === 'rejected' ? '2px solid #dc2626' : '1px solid #e2e8f0',
            backgroundColor: filterStatus === 'rejected' ? '#fef2f2' : '#ffffff'
          }}
        >
          <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
            Anti-Spoofing Filtered
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b91c1c', marginTop: '0.1rem' }}>
            {rejectedCount}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#b91c1c', fontWeight: 600 }}>Stock / Non-Authentic</div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              placeholder="Search by Ticket ID, Street Address, Problem Type, or Reporter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.4rem', height: '40px', fontSize: '16px' }}
            />
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div className="pill-scroll-container">
            {['all', 'verified', 'needs_information', 'rejected'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'capitalize',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '8px',
                  border: filterStatus === st ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                  background: filterStatus === st ? '#e0f2fe' : '#ffffff',
                  color: filterStatus === st ? '#0369a1' : '#475569',
                  cursor: 'pointer',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  minHeight: '32px'
                }}
              >
                {st === 'all' ? `All Submissions (${total})` : st.replace('_', ' ')}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 1. Mobile Ticket Card List (<768px) */}
      <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b' }}>
            No complaints found matching your filter criteria.
          </div>
        ) : (
          filtered.map((item, idx) => {
            const score = item.accuracyScore || Math.round((item.confidence || 0.9) * 100);
            const dateStr = item.submittedAt 
              ? new Date(item.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'Recent';

            return (
              <div 
                key={item.complaintId || idx}
                onClick={() => setSelectedComplaint(item)}
                className="card"
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  position: 'relative',
                  borderLeft: `4px solid ${
                    item.status === 'verified' ? '#16a34a' : item.status === 'needs_information' ? '#d97706' : '#dc2626'
                  }`
                }}
              >
                {/* Top Ticket Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.85rem', color: '#0284c7' }}>
                      {item.complaintId}
                    </span>
                    {(item.isMerged || (item.mergedCount && item.mergedCount > 1)) && (
                      <span className="badge badge-blue" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>
                        <Users size={10} /> {item.mergedCount || 2} Merged
                      </span>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {item.status === 'verified' && (
                      <span className="badge badge-green" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                        <CheckCircle2 size={11} /> {score}% Accuracy
                      </span>
                    )}
                    {item.status === 'needs_information' && (
                      <span className="badge badge-yellow" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                        <AlertTriangle size={11} /> {score}% Needs Info
                      </span>
                    )}
                    {item.status === 'rejected' && (
                      <span className="badge badge-red" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                        <XCircle size={11} /> {score}% Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 700, marginBottom: '0.35rem' }}>
                  {item.problemType}
                </h3>

                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#475569', marginBottom: '0.5rem' }}>
                  <MapPin size={13} color="#0284c7" style={{ flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.location}
                  </span>
                </div>

                {/* Footer Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} />
                    <span>{dateStr}</span>
                  </div>
                  <span style={{ color: '#0284c7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    Inspect Details <ArrowRight size={12} />
                  </span>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* 2. Desktop Data Table (>=768px) */}
      <div className="card desktop-only-block" style={{ overflow: 'hidden', backgroundColor: '#ffffff' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>Ticket ID</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>Problem Category</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>Location</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>Cluster Status</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>AI Status</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>AI Accuracy Score</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => {
                const score = item.accuracyScore || Math.round((item.confidence || 0.9) * 100);
                const isMerged = item.isMerged || (item.mergedCount && item.mergedCount > 1);

                return (
                  <tr 
                    key={item.complaintId || idx}
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                  >
                    <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#0284c7' }}>
                      {item.complaintId}
                    </td>

                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>
                      {item.problemType}
                    </td>

                    <td style={{ padding: '0.85rem 1.25rem', color: '#475569', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.location}
                    </td>

                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      {isMerged ? (
                        <span className="badge badge-blue">
                          <Users size={11} /> {item.mergedCount || 2} Reports Merged
                        </span>
                      ) : (
                        <span className="badge badge-neutral">Single Ticket</span>
                      )}
                    </td>

                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      {item.status === 'verified' && (
                        <span className="badge badge-green">
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      )}
                      {item.status === 'needs_information' && (
                        <span className="badge badge-yellow">
                          <AlertTriangle size={12} /> Needs Info
                        </span>
                      )}
                      {item.status === 'rejected' && (
                        <span className="badge badge-red">
                          <XCircle size={12} /> Rejected / Fake
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 800 }}>
                      <span style={{
                        color: item.status === 'verified' ? '#15803d' : item.status === 'needs_information' ? '#b45309' : '#b91c1c'
                      }}>
                        {score}%
                      </span>
                    </td>

                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedComplaint(item)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', minHeight: '30px' }}
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedComplaint && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1000
        }}>
          <div className="card" style={{
            maxWidth: '580px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.5rem',
            position: 'relative'
          }}>
            <button
              type="button"
              onClick={() => setSelectedComplaint(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1rem', color: '#0284c7' }}>
                {selectedComplaint.complaintId}
              </span>
              {selectedComplaint.status === 'verified' && <span className="badge badge-green">Verified ({selectedComplaint.accuracyScore || 96}%)</span>}
              {selectedComplaint.status === 'needs_information' && <span className="badge badge-yellow">Needs Info ({selectedComplaint.accuracyScore || 58}%)</span>}
              {selectedComplaint.status === 'rejected' && <span className="badge badge-red">Rejected / Spoof ({selectedComplaint.accuracyScore || 20}%)</span>}
            </div>

            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.65rem', fontWeight: 800 }}>
              {selectedComplaint.problemType}
            </h3>

            {/* Evidence Image */}
            {selectedComplaint.image && (
              <div style={{ borderRadius: '10px', overflow: 'hidden', height: '170px', marginBottom: '0.85rem', backgroundColor: '#0f172a' }}>
                <img
                  src={selectedComplaint.image}
                  alt="Evidence"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            {/* AI Reasoning Box */}
            <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '10px', marginBottom: '0.85rem', border: '1px solid #e2e8f0', fontSize: '0.82rem' }}>
              <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Sparkles size={14} color="#0284c7" />
                <span>AI Verification & Anti-Spoofing Audit:</span>
              </div>
              <p style={{ color: '#334155', lineHeight: 1.4 }}>{selectedComplaint.reason}</p>
            </div>

            {/* Merged Citizen Reports List if duplicate cluster */}
            {selectedComplaint.reporters && selectedComplaint.reporters.length > 1 && (
              <div style={{ backgroundColor: '#eff6ff', padding: '0.85rem', borderRadius: '10px', marginBottom: '0.85rem', border: '1px solid #bfdbfe' }}>
                <div style={{ fontWeight: 800, color: '#1e40af', fontSize: '0.82rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Users size={14} />
                  <span>Consolidated Citizen Reports ({selectedComplaint.reporters.length} Independent Submissions):</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.75rem', color: '#334155' }}>
                  {selectedComplaint.reporters.map((rep, rIdx) => (
                    <div key={rIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', borderBottom: '1px dashed #dbeafe' }}>
                      <span>👤 <strong>{rep.name}</strong> ({rep.contact})</span>
                      <span style={{ color: '#64748b' }}>{new Date(rep.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ticket Metadata */}
            <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#475569', marginBottom: '1.25rem' }}>
              <div><strong>Location:</strong> {selectedComplaint.location}</div>
              {selectedComplaint.landmark && <div><strong>Landmark:</strong> {selectedComplaint.landmark}</div>}
              <div><strong>Description:</strong> {selectedComplaint.description}</div>
              <div><strong>Primary Reporter:</strong> {selectedComplaint.userName} ({selectedComplaint.contact})</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  setCurrentResult(selectedComplaint);
                  setSelectedComplaint(null);
                  navigateTo('result');
                }}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Open Official Verification Slip
              </button>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
