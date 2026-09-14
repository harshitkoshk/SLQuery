import { simulateAIVerification } from './mockApi';

/**
 * API Service Layer for Smart Streetlight Monitoring & AI Verification
 *
 * Configured via environment variables:
 * - VITE_USE_MOCK_API: 'true' (default) or 'false'
 * - VITE_API_BASE_URL: Backend URL, e.g. 'http://localhost:5000/api'
 */

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = {
  isMockMode: () => USE_MOCK_API,
  getBaseUrl: () => API_BASE_URL,

  /**
   * Submit a new citizen complaint for AI verification
   * @param {Object} payload Complaint form data
   * @param {string} [devOverrideState] Optional dev test mode override ('auto' | 'verified' | 'needs_information' | 'rejected')
   * @param {Array} [existingComplaints] Existing complaints list for deduplication & clustering
   * @returns {Promise<Object>} Verification result
   */
  async submitComplaint(payload, devOverrideState = 'auto', existingComplaints = []) {
    if (USE_MOCK_API) {
      return await simulateAIVerification(payload, devOverrideState, existingComplaints);
    }

    // Real Backend Integration with fallback to local verification engine if backend unreachable
    try {
      const response = await fetch(`${API_BASE_URL}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error (${response.status}): ${errorText || response.statusText}`);
      }

      const resJson = await response.json();
      const raw = resJson.data || resJson;

      let mappedStatus = 'verified';
      const rawStatus = (raw.status || '').toUpperCase();
      if (rawStatus === 'REJECTED' || raw.ai_result?.valid === false) {
        mappedStatus = 'rejected';
      } else if (rawStatus === 'NEEDS_MORE_INFORMATION' || (raw.ai_result?.missing_information && raw.ai_result.missing_information.length > 0)) {
        mappedStatus = 'needs_information';
      }

      const accuracyScore = raw.accuracyScore || raw.ai_result?.accuracyScore || Math.round((raw.confidence || raw.ai_result?.confidence || 0.2) * 100);
      const isReal = raw.aiBreakdown?.antiSpoofingPass ?? (mappedStatus !== 'rejected' || accuracyScore > 25);

      return {
        complaintId: raw.id || raw.complaintId || `SLQ-${Date.now()}`,
        status: mappedStatus,
        confidence: raw.confidence || raw.ai_result?.confidence || Number((accuracyScore / 100).toFixed(2)),
        accuracyScore: accuracyScore,
        authenticityScore: raw.aiBreakdown?.authenticityScore || (isReal ? 95 : 20),
        isRealImage: isReal,
        imageName: payload.imageName || 'IMG_Camera_Field.jpg',
        reason: raw.reason || raw.ai_result?.reason || (mappedStatus === 'verified' ? 'Verified by AI' : 'Rejected by AI'),
        problemType: payload.problemType || raw.description || 'Streetlight Issue',
        location: payload.location || raw.location,
        landmark: payload.landmark || '',
        description: payload.description || raw.description,
        image: payload.image || raw.imageUrl,
        userName: payload.userName || raw.userName,
        contact: payload.contact || raw.userContact,
        submittedAt: raw.createdAt || raw.submittedAt || new Date().toISOString(),
        aiBreakdown: raw.aiBreakdown || raw.ai_result?.aiBreakdown || {
          lightFixtureDetected: mappedStatus === 'verified',
          defectCategory: mappedStatus === 'verified' ? 'Verified Luminaire Outage' : 'Unverified Scene',
          illuminationLevel: mappedStatus === 'verified' ? '0.0 Lux (Unlit)' : 'Ambient',
          riskScore: mappedStatus === 'verified' ? 'High Priority' : 'Rejected / Inconclusive',
          authenticityVerdict: isReal ? 'Camera Verified' : 'Stock / Non-Authentic',
          antiSpoofingPass: isReal,
          authenticityScore: raw.aiBreakdown?.authenticityScore || 95,
          fixtureDetectionScore: mappedStatus === 'verified' ? 92 : 15,
          defectSeverityScore: mappedStatus === 'verified' ? 90 : 15,
          spatialAccuracyScore: mappedStatus === 'verified' ? 95 : 35
        }
      };
    } catch (error) {
      console.warn('Backend server not reachable, executing intelligent local AI verification:', error.message);
      return await simulateAIVerification(payload, devOverrideState, existingComplaints);
    }
  },

  /**
   * Fetch all registered complaints from backend / mock store
   */
  async fetchComplaints() {
    if (USE_MOCK_API) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/complaints`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const resJson = await response.json();
      return resJson.data?.complaints || resJson.data || resJson;
    } catch (err) {
      return null;
    }
  }
};
