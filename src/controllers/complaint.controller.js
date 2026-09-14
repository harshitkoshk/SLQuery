const complaintService = require('../services/complaint.service');

class ComplaintController {
  /**
   * POST /api/complaints
   * Create a new complaint with optional image and trigger AI verification
   */
  async createComplaint(req, res, next) {
    try {
      const { description, problemType, location, userName, userContact, contact, streetlightId, imageUrl: rawImageUrl, image: rawImage, imageName } = req.body;

      // Handle uploaded file via multer or URL / base64 passed in body
      let imageUrl = rawImageUrl || rawImage || null;
      let imagePath = null;

      if (req.file) {
        imagePath = req.file.path;
        // Construct accessible static URL for frontend
        const protocol = req.protocol;
        const host = req.get('host');
        imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
      }

      const effectiveDescription = [problemType, description].filter(Boolean).join(' - ') || description || 'Streetlight issue';
      const effectiveContact = userContact || contact || null;

      const complaint = await complaintService.createComplaint({
        description: effectiveDescription,
        location,
        imageUrl,
        imagePath,
        imageName,
        userName,
        userContact: effectiveContact,
        streetlightId
      });

      res.status(201).json({
        success: true,
        message: 'Complaint submitted and verified successfully',
        data: complaint
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/complaints
   * Fetch all complaints with optional filtering
   */
  async getComplaints(req, res, next) {
    try {
      const { status, location, limit, offset } = req.query;

      const result = await complaintService.getAllComplaints({
        status,
        location,
        limit,
        offset
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/complaints/:id
   * Fetch a single complaint by ID
   */
  async getComplaintById(req, res, next) {
    try {
      const { id } = req.params;
      const complaint = await complaintService.getComplaintById(id);

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: `Complaint with ID '${id}' not found.`
        });
      }

      res.status(200).json({
        success: true,
        data: complaint
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/complaints/:id/verify
   * Re-run AI verification for an existing complaint
   */
  async reverifyComplaint(req, res, next) {
    try {
      const { id } = req.params;
      const updatedComplaint = await complaintService.reverifyComplaint(id);

      if (!updatedComplaint) {
        return res.status(404).json({
          success: false,
          message: `Complaint with ID '${id}' not found.`
        });
      }

      res.status(200).json({
        success: true,
        message: 'Complaint re-verified successfully by AI',
        data: updatedComplaint
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ComplaintController();
