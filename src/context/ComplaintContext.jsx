import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_COMPLAINTS, INITIAL_STREETLIGHTS } from '../utils/mockData';
import { apiClient } from '../services/api';

const ComplaintContext = createContext(null);
const STORAGE_KEY = 'lumiwatch_complaints_v3';

export function ComplaintProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [streetlights, setStreetlights] = useState(INITIAL_STREETLIGHTS);

  const [complaints, setComplaints] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed reading localStorage', e);
    }
    return INITIAL_COMPLAINTS;
  });

  const [currentResult, setCurrentResult] = useState(() => complaints[0] || null);
  const [prefilledData, setPrefilledData] = useState(null);
  const [devForceState, setDevForceState] = useState('auto');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    } catch (e) {
      console.error('Failed saving localStorage', e);
    }
  }, [complaints]);

  const navigateTo = (page, data = null) => {
    if (data) setPrefilledData(data);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginAdmin = (username, password) => {
    if (username.trim() === 'admin' && password.trim() === '0000') {
      setIsAdminAuth(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuth(false);
    navigateTo('landing');
  };

  const submitComplaint = async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await apiClient.submitComplaint(formData, devForceState, complaints);
      setCurrentResult(result);

      if (result.isMerged && result.mergedWith) {
        // Update existing merged ticket in the state
        setComplaints((prev) => {
          const exists = prev.some((c) => c.complaintId === result.mergedWith);
          if (exists) {
            return prev.map((c) => {
              if (c.complaintId === result.mergedWith) {
                return {
                  ...c,
                  mergedCount: (c.mergedCount || 1) + 1,
                  reporters: [
                    ...(c.reporters || []),
                    { name: formData.userName, contact: formData.contact, time: new Date().toISOString() }
                  ]
                };
              }
              return c;
            });
          }
          return [result, ...prev];
        });
      } else {
        setComplaints((prev) => [result, ...prev]);
      }

      setPrefilledData(null);
      setCurrentPage('result');
      return result;
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'Failed to submit complaint. Please check connection.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAllData = () => {
    setComplaints(INITIAL_COMPLAINTS);
    setCurrentResult(INITIAL_COMPLAINTS[0]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ComplaintContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        navigateTo,
        isAdminAuth,
        setIsAdminAuth,
        loginAdmin,
        logoutAdmin,
        streetlights,
        complaints,
        currentResult,
        setCurrentResult,
        prefilledData,
        setPrefilledData,
        devForceState,
        setDevForceState,
        isSubmitting,
        submitError,
        submitComplaint,
        resetAllData,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaint() {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaint must be used within a ComplaintProvider');
  }
  return context;
}
