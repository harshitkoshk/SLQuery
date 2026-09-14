const prisma = require('../db/client');
const aiService = require('./ai.service');

class ComplaintService {
  /**
   * Determine DB status based on AI result
   */
  _mapAiResultToStatus(aiResult) {
    if (!aiResult.valid) {
      return 'REJECTED';
    }
    if (aiResult.ready_to_send) {
      return 'READY_TO_SEND';
    }
    if (aiResult.missing_information && aiResult.missing_information.length > 0) {
      return 'NEEDS_MORE_INFORMATION';
    }
    return 'AI_VERIFIED';
  }

  /**
   * Format complaint for API responses
   */
  _formatComplaintResponse(complaint, aiResult = null) {
    let missingInfo = [];
    if (complaint.aiMissingInfo) {
      try {
        missingInfo = JSON.parse(complaint.aiMissingInfo);
      } catch (e) {
        missingInfo = [];
      }
    }

    const accuracyScore = aiResult?.accuracyScore || Math.round((complaint.aiConfidence || 0.2) * 100);

    return {
      id: complaint.id,
      complaintId: complaint.id,
      description: complaint.description,
      location: complaint.location,
      imageUrl: complaint.imageUrl,
      image: complaint.imageUrl,
      userName: complaint.userName,
      userContact: complaint.userContact,
      contact: complaint.userContact,
      status: complaint.status,
      confidence: complaint.aiConfidence,
      accuracyScore: accuracyScore,
      reason: complaint.aiReason,
      ai_result: {
        valid: complaint.aiValid,
        ready_to_send: complaint.aiReadyToSend,
        confidence: complaint.aiConfidence,
        accuracyScore: accuracyScore,
        reason: complaint.aiReason,
        missing_information: missingInfo,
        aiBreakdown: aiResult?.aiBreakdown || null
      },
      aiBreakdown: aiResult?.aiBreakdown || null,
      streetlightId: complaint.streetlightId,
      streetlight: complaint.streetlight || null,
      createdAt: complaint.createdAt,
      submittedAt: complaint.createdAt,
      updatedAt: complaint.updatedAt
    };
  }

  /**
   * Create a new citizen complaint and perform AI verification
   */
  async createComplaint({ description, location, imageUrl, imagePath, imageName, userName, userContact, streetlightId }) {
    // 1. Initial AI Verification
    const aiResult = await aiService.verifyComplaint({
      description,
      location,
      imageUrl,
      imagePath,
      imageName
    });

    const calculatedStatus = this._mapAiResultToStatus(aiResult);

    // 2. Persist in Database
    const newComplaint = await prisma.complaint.create({
      data: {
        description: description.trim(),
        location: (location || '').trim(),
        imageUrl: imageUrl || null,
        userName: userName ? userName.trim() : null,
        userContact: userContact ? userContact.trim() : null,
        status: calculatedStatus,
        aiValid: aiResult.valid,
        aiReadyToSend: aiResult.ready_to_send,
        aiReason: aiResult.reason,
        aiConfidence: aiResult.confidence,
        aiMissingInfo: JSON.stringify(aiResult.missing_information || []),
        streetlightId: streetlightId || null
      },
      include: {
        streetlight: true
      }
    });

    // If complaint is confirmed valid and ready to send, update linked streetlight status to FAULTY/UNDER_REVIEW
    if (streetlightId && aiResult.valid) {
      try {
        await prisma.streetlight.update({
          where: { id: streetlightId },
          data: { status: 'UNDER_REVIEW' }
        });
      } catch (err) {
        console.warn('Could not update linked streetlight status:', err.message);
      }
    }

    return this._formatComplaintResponse(newComplaint, aiResult);
  }

  /**
   * Get all complaints with optional filters
   */
  async getAllComplaints({ status, location, limit = 50, offset = 0 } = {}) {
    const where = {};
    if (status) {
      where.status = status;
    }
    if (location) {
      where.location = {
        contains: location
      };
    }

    const [total, items] = await Promise.all([
      prisma.complaint.count({ where }),
      prisma.complaint.findMany({
        where,
        take: parseInt(limit, 10),
        skip: parseInt(offset, 10),
        orderBy: { createdAt: 'desc' },
        include: { streetlight: true }
      })
    ]);

    return {
      total,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      complaints: items.map(c => this._formatComplaintResponse(c))
    };
  }

  /**
   * Get a single complaint by ID
   */
  async getComplaintById(id) {
    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: { streetlight: true }
    });

    if (!complaint) {
      return null;
    }

    return this._formatComplaintResponse(complaint);
  }

  /**
   * Re-run AI verification on an existing complaint
   */
  async reverifyComplaint(id) {
    const complaint = await prisma.complaint.findUnique({
      where: { id }
    });

    if (!complaint) {
      return null;
    }

    // Run AI verification again
    const aiResult = await aiService.verifyComplaint({
      description: complaint.description,
      location: complaint.location,
      imageUrl: complaint.imageUrl
    });

    const newStatus = this._mapAiResultToStatus(aiResult);

    const updated = await prisma.complaint.update({
      where: { id },
      data: {
        status: newStatus,
        aiValid: aiResult.valid,
        aiReadyToSend: aiResult.ready_to_send,
        aiReason: aiResult.reason,
        aiConfidence: aiResult.confidence,
        aiMissingInfo: JSON.stringify(aiResult.missing_information || [])
      },
      include: { streetlight: true }
    });

    return this._formatComplaintResponse(updated);
  }
}

module.exports = new ComplaintService();
