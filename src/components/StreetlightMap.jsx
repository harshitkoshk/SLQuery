import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useComplaint } from '../context/ComplaintContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  SlidersHorizontal,
  ArrowRight,
  ShieldAlert,
  Layers,
  ChevronDown,
  Navigation,
  Compass,
  Crosshair
} from 'lucide-react';

export default function StreetlightMap() {
  const { streetlights, navigateTo } = useComplaint();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedNode, setSelectedNode] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState('Detecting live location...');

  // Automatically request person's live location
  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported by browser');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Locating your position via GPS...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude, accuracy });
        setIsLocating(false);
        setLocationStatus(`Live Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (±${Math.round(accuracy)}m)`);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 16, { animate: true, duration: 1.2 });
          updateUserMarker(latitude, longitude);
        }
      },
      (error) => {
        console.warn('Geolocation access warning:', error.message);
        setIsLocating(false);
        setLocationStatus('Using Default Metropolitan Grid (Click "Locate Me" to enable)');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  };

  const updateUserMarker = (lat, lng) => {
    if (!mapInstanceRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userPulseIcon = L.divIcon({
      className: 'user-pulse-marker',
      html: `
        <div style="position: relative; width: 28px; height: 28px;">
          <div style="
            position: absolute; 
            inset: -8px; 
            border-radius: 50%; 
            background: rgba(2, 132, 199, 0.35); 
            animation: pulse 2s infinite;
          "></div>
          <div style="
            width: 28px; 
            height: 28px; 
            border-radius: 50%; 
            background: #0284c7; 
            border: 3px solid #ffffff; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.3); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: #ffffff;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const marker = L.marker([lat, lng], { icon: userPulseIcon, zIndexOffset: 1000 });
    marker.bindPopup(`
      <div style="padding: 8px 10px; font-family: sans-serif; text-align: center;">
        <strong style="color: #0284c7; font-size: 13px;">📍 Your Live Location</strong>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">Streetlights and complaints nearby are mapped relative to you.</p>
      </div>
    `);
    marker.addTo(mapInstanceRef.current);
    userMarkerRef.current = marker;
  };

  // Generate dynamic nodes around user location if GPS is active, or use default dataset
  const effectiveStreetlights = React.useMemo(() => {
    if (!userCoords) return streetlights;

    // Shift first nodes around the user's real coordinates so local streetlights appear near them
    return streetlights.map((node, i) => {
      const offsets = [
        { dlat: 0.0015, dlng: 0.0012, status: 'operational' },
        { dlat: -0.0018, dlng: 0.0020, status: 'warning' },
        { dlat: 0.0022, dlng: -0.0016, status: 'critical' },
        { dlat: -0.0012, dlng: -0.0014, status: 'operational' },
        { dlat: 0.0030, dlng: 0.0005, status: 'operational' },
        { dlat: -0.0025, dlng: 0.0028, status: 'operational' },
      ];
      const offset = offsets[i % offsets.length];
      return {
        ...node,
        lat: userCoords.lat + offset.dlat,
        lng: userCoords.lng + offset.dlng,
        street: i === 0 ? `Near Your Current Location, Pole #${node.id.slice(-2)}` : node.street
      };
    });
  }, [streetlights, userCoords]);

  // Filtered lights
  const filteredLights = effectiveStreetlights.filter((node) => {
    const matchesZone = selectedZone === 'all' || node.zone === selectedZone;
    const matchesStatus = selectedStatus === 'all' || node.status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !q || 
      node.id.toLowerCase().includes(q) || 
      node.street.toLowerCase().includes(q) || 
      node.zone.toLowerCase().includes(q);

    return matchesZone && matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const total = effectiveStreetlights.length;
  const operational = effectiveStreetlights.filter((l) => l.status === 'operational').length;
  const faults = effectiveStreetlights.filter((l) => l.status === 'warning').length;
  const outages = effectiveStreetlights.filter((l) => l.status === 'critical').length;
  const operationalPercent = Math.round((operational / total) * 100);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter = [28.6145, 77.2110];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: true,
        tap: true
      });

      // High-resolution Free OpenStreetMap GIS Tiles (No API key required, no watermarks)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.featureGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Auto-detect person's location
      detectUserLocation();
    }

    // Clean up
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when filtered lights change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    const markersGroup = markersGroupRef.current;
    markersGroup.clearLayers();

    filteredLights.forEach((node) => {
      let color = '#16a34a'; // green
      let bgColor = 'rgba(22, 163, 74, 0.25)';
      let symbol = '';

      if (node.status === 'warning') {
        color = '#d97706'; // yellow/amber
        bgColor = 'rgba(217, 119, 6, 0.3)';
      } else if (node.status === 'critical') {
        color = '#dc2626'; // red
        bgColor = 'rgba(220, 38, 38, 0.35)';
        symbol = '!';
      }

      // Create custom SVG/HTML touch-friendly marker
      const customIcon = L.divIcon({
        className: 'custom-street-marker',
        html: `
          <div style="
            width: 24px; 
            height: 24px; 
            border-radius: 50%; 
            background: ${color}; 
            box-shadow: 0 0 0 5px ${bgColor}, 0 2px 6px rgba(0,0,0,0.25); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: #ffffff; 
            font-size: 11px; 
            font-weight: 800; 
            border: 2px solid #ffffff;
          ">
            ${symbol}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([node.lat, node.lng], { icon: customIcon });

      // Build touch-friendly popup content
      const popupHtml = `
        <div style="padding: 12px 14px; font-family: sans-serif; min-width: 210px; max-width: 260px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-weight: 700; color: #0f172a; font-size: 13px;">${node.id}</span>
            <span style="
              font-size: 10px; 
              font-weight: 700; 
              padding: 2px 7px; 
              border-radius: 99px; 
              background: ${node.status === 'operational' ? '#dcfce7' : node.status === 'warning' ? '#fef3c7' : '#fee2e2'}; 
              color: ${node.status === 'operational' ? '#15803d' : node.status === 'warning' ? '#b45309' : '#b91c1c'};
            ">
              ${node.status.toUpperCase()}
            </span>
          </div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 8px; line-height: 1.3;">
            ${node.street}
          </div>
          <div style="font-size: 11px; color: #64748b; background: #f8fafc; padding: 6px 8px; border-radius: 6px; margin-bottom: 10px;">
            <div><strong>Condition:</strong> ${node.condition}</div>
            <div><strong>Voltage:</strong> ${node.voltage} | <strong>Lux:</strong> ${node.lux}</div>
          </div>
          <button 
            id="popup-report-btn-${node.id}"
            style="
              width: 100%; 
              padding: 8px 10px; 
              background: #0284c7; 
              color: #ffffff; 
              border: none; 
              border-radius: 8px; 
              font-weight: 700; 
              font-size: 12px; 
              cursor: pointer;
              min-height: 36px;
            "
          >
            Report Issue on this Light
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-report-btn-${node.id}`);
        if (btn) {
          btn.onclick = () => {
            handleReportNode(node);
          };
        }
      });

      marker.on('click', () => {
        setSelectedNode(node);
      });

      markersGroup.addLayer(marker);
    });
  }, [filteredLights]);

  const handleReportNode = (node) => {
    navigateTo('complaint', {
      location: node.street,
      landmark: `Pole ID: ${node.id} (${node.zone})`,
      problemType: node.status === 'critical' ? 'Streetlight not working' : 'Streetlight flickering',
      description: `Citizen report from GIS Map: Streetlight pole ${node.id} is registering ${node.condition}.`
    });
  };

  const zones = ['all', 'Ring Road North', 'Central Commercial', 'South Residential', 'Metro Link Corridor'];

  return (
    <div className="card" style={{ overflow: 'hidden', border: '1px solid #cbd5e1' }}>
      
      {/* Top Operations Stats Bar - Mobile Responsive */}
      <div style={{
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '0.85rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}>
        
        {/* Metrics Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          
          <div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Monitored Nodes
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
              {total} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8' }}>Poles</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Operational Rate
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#4ade80' }}>
                {operationalPercent}%
              </span>
              <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>
                <div><span style={{ color: '#fbbf24', fontWeight: 700 }}>{faults}</span> faults</div>
                <div><span style={{ color: '#f87171', fontWeight: 700 }}>{outages}</span> outages</div>
              </div>
            </div>
          </div>

          {/* User Location Control Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={detectUserLocation}
              disabled={isLocating}
              className="btn btn-sm"
              style={{
                backgroundColor: userCoords ? '#0284c7' : '#1e293b',
                color: '#ffffff',
                border: '1px solid #38bdf8',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.45rem 0.85rem',
                gap: '0.4rem',
                borderRadius: '8px'
              }}
              id="map-locate-me-btn"
            >
              <Navigation size={14} className={isLocating ? 'animate-spin' : ''} />
              <span>{isLocating ? 'Detecting GPS...' : userCoords ? '📍 Location Active' : '📍 Locate My Area'}</span>
            </button>
          </div>

          <div style={{ gridColumn: 'span 2 / span 2' }} className="mobile-only">
            <button
              type="button"
              onClick={() => navigateTo('complaint')}
              className="btn btn-primary"
              style={{ width: '100%', fontWeight: 700, padding: '0.55rem 1rem', minHeight: '40px', fontSize: '0.85rem' }}
              id="mobile-map-report-problem-btn"
            >
              <ShieldAlert size={16} />
              <span>Report a Broken Streetlight</span>
            </button>
          </div>

        </div>

        {/* Live GPS status banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          color: userCoords ? '#38bdf8' : '#94a3b8',
          borderTop: '1px solid #1e293b',
          paddingTop: '0.45rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Crosshair size={12} />
            <span>{locationStatus}</span>
          </div>
          {userCoords && (
            <span style={{ color: '#4ade80', fontWeight: 700 }}>● Live GIS Centered</span>
          )}
        </div>

      </div>

      {/* Filter and Search Bar - Mobile Responsive & Touch Friendly */}
      <div style={{
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.75rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem'
      }}>
        
        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="text"
            placeholder="Search Pole ID, Street, or Zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.4rem', height: '40px', fontSize: '16px' }}
          />
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Zone Dropdown + Status Pills Strip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, flexShrink: 0 }}>Zone:</span>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="form-select"
              style={{ height: '36px', fontSize: '0.82rem', padding: '0.35rem 0.6rem' }}
            >
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z === 'all' ? 'All Metropolitan Sectors' : z}
                </option>
              ))}
            </select>
          </div>

          {/* Status Pills (Swipeable on touch devices) */}
          <div className="pill-scroll-container">
            <button
              type="button"
              onClick={() => setSelectedStatus('all')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: selectedStatus === 'all' ? '1px solid #0284c7' : '1px solid #cbd5e1',
                background: selectedStatus === 'all' ? '#e0f2fe' : '#ffffff',
                color: selectedStatus === 'all' ? '#0369a1' : '#475569',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                minHeight: '34px'
              }}
            >
              All ({total})
            </button>

            <button
              type="button"
              onClick={() => setSelectedStatus('operational')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: selectedStatus === 'operational' ? '1px solid #16a34a' : '1px solid #cbd5e1',
                background: selectedStatus === 'operational' ? '#dcfce7' : '#ffffff',
                color: selectedStatus === 'operational' ? '#15803d' : '#475569',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                minHeight: '34px'
              }}
            >
              ● Working ({operational})
            </button>

            <button
              type="button"
              onClick={() => setSelectedStatus('warning')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: selectedStatus === 'warning' ? '1px solid #d97706' : '1px solid #cbd5e1',
                background: selectedStatus === 'warning' ? '#fef3c7' : '#ffffff',
                color: selectedStatus === 'warning' ? '#b45309' : '#475569',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                minHeight: '34px'
              }}
            >
              ● Faults ({faults})
            </button>

            <button
              type="button"
              onClick={() => setSelectedStatus('critical')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: selectedStatus === 'critical' ? '1px solid #dc2626' : '1px solid #cbd5e1',
                background: selectedStatus === 'critical' ? '#fee2e2' : '#ffffff',
                color: selectedStatus === 'critical' ? '#b91c1c' : '#475569',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                minHeight: '34px'
              }}
            >
              ● Outages ({outages})
            </button>
          </div>

        </div>

      </div>

      {/* Main Map Container - Responsive height */}
      <div style={{ position: 'relative', width: '100%', height: '390px' }}>
        <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} id="leaflet-streetlight-map" />

        {/* Map Legend Overlay (Compact for Mobile) */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          right: '12px',
          zIndex: 400,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(8px)',
          padding: '0.45rem 0.75rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          border: '1px solid #cbd5e1',
          fontSize: '0.72rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a', display: 'inline-block' }} />
            <span style={{ color: '#334155', fontWeight: 600 }}>Working</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d97706', display: 'inline-block' }} />
            <span style={{ color: '#334155', fontWeight: 600 }}>Fault</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626', display: 'inline-block' }} />
            <span style={{ color: '#334155', fontWeight: 600 }}>Outage</span>
          </div>
        </div>

      </div>

    </div>
  );
}
