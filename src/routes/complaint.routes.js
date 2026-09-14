const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaint.controller');
const upload = require('../middlewares/upload.middleware');
const { validateCreateComplaint } = require('../middlewares/validator.middleware');

/**
 * @route   POST /api/complaints
 * @desc    Create a new citizen complaint (supports multipart image upload or JSON)
 */
router.post(
  '/',
  upload.single('image'),
  validateCreateComplaint,
  complaintController.createComplaint
);

/**
 * @route   GET /api/complaints
 * @desc    Get all complaints (supports filtering by status, location, limit, offset)
 */
router.get('/', complaintController.getComplaints);

/**
 * @route   GET /api/complaints/:id
 * @desc    Get a single complaint by ID with AI analysis results
 */
router.get('/:id', complaintController.getComplaintById);

/**
 * @route   POST /api/complaints/:id/verify
 * @desc    Re-run AI verification on an existing complaint
 */
router.post('/:id/verify', complaintController.reverifyComplaint);

module.exports = router;
