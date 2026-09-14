import React, { useState, useEffect } from 'react';
import { useComplaint } from '../context/ComplaintContext';
import ImageUploader from '../components/ImageUploader';
import { 
  AlertCircle, 
  MapPin, 
  Camera, 
  User, 
  ShieldAlert, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Cpu,
  Info,
  Sparkles
} from 'lucide-react';

export default function ComplaintPage() {
  const { 
    submitComplaint, 
    isSubmitting, 
    submitError, 
    navigateTo, 
    prefilledData 
  } = useComplaint();

  const [problemType, setProblemType] = useState('Streetlight not working');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [landmark, setLandmark] = useState('');
  const [image, setImage] = useState('');
  const [imageName, setImageName] = useState('IMG_Camera_Field.jpg');
  const [userName, setUserName] = useState('');
  const [contact, setContact] = useState('');

  const [errors, setErrors] = useState({});
  const [scanStep, setScanStep] = useState(0);

  // Apply prefilled data if user clicked a node on the GIS Map
  useEffect(() => {
    if (prefilledData) {
      if (prefilledData.location) setLocation(prefilledData.location);
      if (prefilledData.landmark) setLandmark(prefilledData.landmark);
      if (prefilledData.problemType) setProblemType(prefilledData.problemType);
      if (prefilledData.description) setDescription(prefilledData.description);
    }
  }, [prefilledData]);

  // AI scanning steps
  useEffect(() => {
    let t1, t2;
    if (isSubmitting) {
      setScanStep(1);
      t1 = setTimeout(() => setScanStep(2), 450);
      t2 = setTimeout(() => setScanStep(3), 900);
    } else {
      setScanStep(0);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isSubmitting]);

  const handleSampleSelected = (sample) => {
    if (sample.defaultProblem) {
      setProblemType(sample.defaultProblem);
    }
    if (sample.fileName) {
      setImageName(sample.fileName);
    }
    if (!description) {
      setDescription(`Observed streetlight defect: ${sample.description}. Requires municipal inspection.`);
    }
    if (!location) {
      setLocation('Mahatma Gandhi Ring Road, Near Sector 4 Junction');
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!problemType) {
      newErrors.problemType = 'Please select a problem type.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please enter a description of the issue.';
    } else if (description.trim().length < 8) {
      newErrors.description = 'Description must be at least 8 characters.';
    }

    if (!location.trim()) {
      newErrors.location = 'Please enter the street address or location.';
    }

    if (!image) {
      newErrors.image = 'Please upload a streetlight photo so the AI can verify the problem.';
    }

    if (!userName.trim()) {
      newErrors.userName = 'Please enter your name.';
    }

    if (!contact.trim()) {
      newErrors.contact = 'Please enter your contact email or phone number.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9+\s-]{8,15}$/;
      if (!emailRegex.test(contact.trim()) && !phoneRegex.test(contact.trim())) {
        newErrors.contact = 'Please enter a valid email address or phone number.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      problemType,
      description: description.trim(),
      location: location.trim(),
      landmark: landmark.trim(),
      image,
      imageName,
      userName: userName.trim(),
      contact: contact.trim(),
    };

    try {
      await submitComplaint(payload);
    } catch (err) {
      // Error handled in context
    }
  };

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
        id="back-to-map-btn"
      >
        <ArrowLeft size={16} />
        <span>Back to Streetlight Map</span>
      </button>

      {/* Main Form Card - Mobile Optimized */}
      <div className="card" style={{
        padding: '1.25rem',
        borderRadius: '14px',
        position: 'relative',
        backgroundColor: '#ffffff'
      }}>
        
        {/* Form Header */}
        <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ padding: '0.35rem', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0284c7' }}>
              <ShieldAlert size={18} />
            </div>
            <h1 style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: 800 }}>
              Report a Streetlight Problem
            </h1>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Upload evidence photo. AI will perform anti-spoofing checks, evaluate defect severity, and calculate an accuracy score (0-100%).
          </p>
        </div>

        {submitError && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.82rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          
          {/* Problem Type */}
          <div className="form-group">
            <label htmlFor="problemType" className="form-label">
              Problem Type <span className="required">*</span>
            </label>
            <select
              id="problemType"
              value={problemType}
              onChange={(e) => {
                setProblemType(e.target.value);
                if (errors.problemType) setErrors({ ...errors, problemType: null });
              }}
              className={`form-select ${errors.problemType ? 'error' : ''}`}
            >
              <option value="Streetlight not working">Streetlight not working (Completely unlit)</option>
              <option value="Streetlight flickering">Streetlight flickering / Intermittent</option>
              <option value="Light too dim">Light too dim / Low Lumens</option>
              <option value="Damaged streetlight">Damaged streetlight / Broken luminaire</option>
              <option value="Pole damaged">Pole damaged / Tilted / Impact damage</option>
              <option value="Other">Other / General Streetlight Issue</option>
            </select>
            {errors.problemType && <p className="form-error"><AlertCircle size={13} />{errors.problemType}</p>}
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location / Street Address <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="location"
                type="text"
                placeholder="e.g. Ring Road & Sector 4 Cross, Near Pillar 114"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) setErrors({ ...errors, location: null });
                }}
                className={`form-input ${errors.location ? 'error' : ''}`}
                style={{ paddingLeft: '2.4rem' }}
              />
              <MapPin size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            {errors.location && <p className="form-error"><AlertCircle size={13} />{errors.location}</p>}
          </div>

          {/* Landmark */}
          <div className="form-group">
            <label htmlFor="landmark" className="form-label">
              Landmark <span className="form-label-hint">(Optional — helps maintenance locate pole)</span>
            </label>
            <input
              id="landmark"
              type="text"
              placeholder="e.g. Opposite Star Cafe / Near Metro Gate 2"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              placeholder="Describe what is wrong with the streetlight..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: null });
              }}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
            />
            {errors.description && <p className="form-error"><AlertCircle size={13} />{errors.description}</p>}
          </div>

          {/* Photo Upload Component (with filename capture) */}
          <ImageUploader
            image={image}
            imageName={imageName}
            onChange={(newImg, newName) => {
              setImage(newImg);
              if (newName) setImageName(newName);
              if (errors.image) setErrors({ ...errors, image: null });
            }}
            onSampleSelected={handleSampleSelected}
            error={errors.image}
          />

          {/* Citizen Contact Section */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <User size={15} color="#0284c7" />
              <h3 style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 700 }}>Citizen Contact Info</h3>
            </div>

            <div className="grid-2">
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label htmlFor="userName" className="form-label" style={{ fontSize: '0.8rem' }}>
                  Your Full Name <span className="required">*</span>
                </label>
                <input
                  id="userName"
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    if (errors.userName) setErrors({ ...errors, userName: null });
                  }}
                  className={`form-input ${errors.userName ? 'error' : ''}`}
                />
                {errors.userName && <p className="form-error"><AlertCircle size={13} />{errors.userName}</p>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="contact" className="form-label" style={{ fontSize: '0.8rem' }}>
                  Phone / Email <span className="required">*</span>
                </label>
                <input
                  id="contact"
                  type="text"
                  placeholder="e.g. 9876543210 or name@mail.com"
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value);
                    if (errors.contact) setErrors({ ...errors, contact: null });
                  }}
                  className={`form-input ${errors.contact ? 'error' : ''}`}
                />
                {errors.contact && <p className="form-error"><AlertCircle size={13} />{errors.contact}</p>}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', fontWeight: 700 }}
            id="submit-complaint-btn"
          >
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader2 size={18} className="animate-spin" />
                <span>AI Anti-Spoofing & Defect Scoring in Progress...</span>
              </span>
            ) : (
              <span>Submit & Run AI Verification</span>
            )}
          </button>

        </form>

        {/* AI Processing Modal (Mobile Sized) */}
        {isSubmitting && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            zIndex: 20,
            borderRadius: '14px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Cpu size={28} className="animate-spin" />
            </div>

            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.25rem', fontWeight: 800 }}>
              AI Vision Model Inspecting...
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', textAlign: 'center', maxWidth: '300px', marginBottom: '1.25rem' }}>
              Auditing image authenticity, anti-spoofing signatures, and calculating 0-100% accuracy score.
            </p>

            <div style={{
              width: '100%',
              maxWidth: '300px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.78rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: scanStep >= 1 ? '#15803d' : '#94a3b8' }}>
                <CheckCircle2 size={15} />
                <span>1. Image Anti-Spoofing & Authenticity Audit</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: scanStep >= 2 ? '#15803d' : '#94a3b8' }}>
                <CheckCircle2 size={15} />
                <span>2. Luminaire Hardware & Defect Analysis</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: scanStep >= 3 ? '#15803d' : '#94a3b8' }}>
                <CheckCircle2 size={15} />
                <span>3. Deduplication Check & 0-100% Accuracy Score</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
