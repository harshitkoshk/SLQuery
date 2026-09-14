import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  X, 
  Image as ImageIcon, 
  Sparkles, 
  FolderOpen, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Zap,
  CheckCircle2,
  Crosshair
} from 'lucide-react';
import { SAMPLE_IMAGES } from '../utils/mockData';

export default function ImageUploader({ image, imageName, onChange, error, onSampleSelected }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (rear) or 'user' (front)
  const [isCapturing, setIsCapturing] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async (mode = facingMode) => {
    setCameraError(null);
    setIsCameraOpen(true);
    stopCameraStream();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const constraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((err) => console.warn('Video play error:', err));
      }
    } catch (err) {
      console.warn('Live camera error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access or choose an image file.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No active camera hardware found on your device. Please browse an image file instead.');
      } else {
        setCameraError(`Unable to start camera: ${err.message || 'Check camera hardware permissions'}`);
      }
    }
  };

  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;

    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (facingMode === 'user') {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, width, height);

      // Export high-quality JPEG
      const snapshotDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
      const generatedFileName = `IMG_CAMERA_${timestamp}.jpg`;

      // Visual shutter effect delay
      setTimeout(() => {
        stopCameraStream();
        setIsCameraOpen(false);
        setIsCapturing(false);
        onChange(snapshotDataUrl, generatedFileName);
      }, 250);
    } catch (err) {
      console.error('Snapshot capture error:', err);
      setIsCapturing(false);
    }
  };

  const handleCloseCamera = () => {
    stopCameraStream();
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        const maxDim = 1280;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onChange(optimizedDataUrl, file.name);
      };
      img.onerror = () => {
        onChange(dataUrl, file.name);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSelectPreset = (sample) => {
    onChange(sample.url, sample.fileName);
    if (onSampleSelected) {
      onSampleSelected(sample);
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      
      {/* Header & Presets */}
      <div style={{ marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.35rem' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>
            Streetlight Evidence Photo <span className="required">*</span>
            <span className="form-label-hint">(AI Anti-Spoofing & Defect Verification)</span>
          </label>
        </div>

        {/* Test Presets for Demo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700, flexShrink: 0 }}>Sample Tests:</span>
          <div className="pill-scroll-container" style={{ width: '100%' }}>
            {SAMPLE_IMAGES.map((sample, idx) => {
              const isSelected = image === sample.url;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(sample)}
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '8px',
                    background: isSelected ? '#e0f2fe' : '#ffffff',
                    border: isSelected ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                    color: isSelected ? '#0369a1' : '#334155',
                    cursor: 'pointer',
                    fontWeight: isSelected ? 800 : 600,
                    whiteSpace: 'nowrap',
                    minHeight: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                  title={sample.description}
                >
                  {sample.isReal ? '✅' : '🚫'}
                  <span>{sample.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        id="complaint-image-input"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
      />

      {/* ========================================================
          LIVE CAMERA VIEWFINDER MODAL (FULL WEBRTC FEED)
          ======================================================== */}
      {isCameraOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#000000',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem'
        }}>
          {/* Top Bar with Camera Controls */}
          <div style={{
            width: '100%',
            maxWidth: '600px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontSize: '0.88rem', fontWeight: 700 }}>
              <Camera size={20} color="#38bdf8" />
              <span>Live Streetlight Camera</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleToggleFacingMode}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
                title="Switch front/rear camera"
              >
                <RefreshCw size={18} />
              </button>

              <button
                type="button"
                onClick={handleCloseCamera}
                style={{
                  background: 'rgba(239, 68, 68, 0.85)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
                title="Close Camera"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Center Viewfinder & Video Stream */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '540px',
            flex: 1,
            maxHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: '16px',
            backgroundColor: '#0f172a',
            margin: '1rem 0'
          }}>
            {cameraError ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#ffffff', maxWidth: '380px' }}>
                <AlertTriangle size={36} color="#f87171" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Camera Access Required</h4>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.45, marginBottom: '1.25rem' }}>
                  {cameraError}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseCamera();
                    fileInputRef.current?.click();
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  <FolderOpen size={16} />
                  <span>Choose Image File Instead</span>
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                {/* Viewfinder Target Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: '20px',
                  border: '2px dashed rgba(56, 189, 248, 0.6)',
                  borderRadius: '12px',
                  pointerEvents: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem'
                }}>
                  <div style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '99px',
                    fontSize: '0.72rem',
                    fontWeight: 600
                  }}>
                    Align defective streetlight / damaged pole in frame
                  </div>
                  <Crosshair size={32} color="rgba(56, 189, 248, 0.8)" />
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                    High-definition Field Camera
                  </div>
                </div>

                {/* Flash effect on capture */}
                {isCapturing && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: '#ffffff',
                    animation: 'fade-out 0.25s forwards'
                  }} />
                )}
              </>
            )}
          </div>

          {/* Bottom Shutter Capture Button */}
          {!cameraError && (
            <div style={{
              width: '100%',
              maxWidth: '500px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <button
                type="button"
                onClick={handleCaptureSnapshot}
                disabled={isCapturing}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '6px solid #0284c7',
                  boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.4), 0 4px 20px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transform: isCapturing ? 'scale(0.92)' : 'scale(1)',
                  transition: 'all 0.15s ease'
                }}
                id="camera-shutter-snap-btn"
                title="Capture Streetlight Photo"
              >
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
              </button>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                Tap Shutter to Capture Real-Time Evidence
              </span>
            </div>
          )}
        </div>
      )}

      {!image ? (
        <div>
          {/* Main Camera Launch Zone */}
          <div
            onClick={() => startCamera('environment')}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${error ? '#dc2626' : isDragging ? '#0284c7' : '#cbd5e1'}`,
              borderRadius: '12px',
              padding: '1.75rem 1rem',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isDragging ? '#f0f9ff' : '#f8fafc',
              transition: 'all 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.65rem'
            }}
            id="image-dropzone"
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284c7',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.18)'
            }}>
              <Camera size={28} />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a', marginBottom: '0.2rem' }}>
                📸 Click Live Picture (Opens Camera)
              </p>
              <p style={{ fontSize: '0.76rem', color: '#64748b', maxWidth: '360px' }}>
                Launches your camera viewfinder to click real-world on-site streetlight evidence.
              </p>
            </div>
          </div>

          {/* Secondary Options Strip */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.65rem' }}>
            <button
              type="button"
              onClick={() => startCamera('environment')}
              className="btn btn-primary btn-sm"
              style={{ flex: 1.2, minHeight: '40px', fontSize: '0.82rem', fontWeight: 700, gap: '0.4rem' }}
              id="uploader-open-camera-btn"
            >
              <Camera size={17} />
              <span>Click Live Picture</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary btn-sm"
              style={{ flex: 0.9, minHeight: '40px', fontSize: '0.8rem', gap: '0.4rem' }}
              id="uploader-browse-folder-btn"
            >
              <FolderOpen size={16} color="#64748b" />
              <span>Select File</span>
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #cbd5e1',
          backgroundColor: '#0f172a'
        }}>
          <img
            src={image}
            alt="Uploaded streetlight evidence"
            style={{
              width: '100%',
              maxHeight: '230px',
              objectFit: 'cover',
              display: 'block'
            }}
          />

          {/* Remove Button */}
          <button
            type="button"
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(220, 38, 38, 0.95)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
            title="Remove photo"
            id="remove-image-btn"
          >
            <X size={18} />
          </button>

          <div style={{
            padding: '0.65rem 0.85rem',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.78rem',
            color: '#475569'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflow: 'hidden' }}>
              <ImageIcon size={15} color="#0284c7" style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>
                {imageName || 'IMG_Camera_Field.jpg'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => startCamera('environment')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#0284c7',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  padding: '0.2rem 0.4rem'
                }}
              >
                Retake
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  padding: '0.2rem 0.4rem'
                }}
              >
                Change
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="form-error" style={{ marginTop: '0.35rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}
