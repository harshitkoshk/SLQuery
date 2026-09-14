/**
 * Validation middleware for complaint creation
 */
function validateCreateComplaint(req, res, next) {
  const { description, location } = req.body;
  const errors = [];

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push({
      field: 'description',
      message: 'Description is required and must be a non-empty string.'
    });
  } else if (description.trim().length < 3) {
    errors.push({
      field: 'description',
      message: 'Description must be at least 3 characters long.'
    });
  }

  // Location is optional for raw input submission since AI evaluates and flags missing location in the workflow,
  // but if provided it should be a string.
  if (location !== undefined && typeof location !== 'string') {
    errors.push({
      field: 'location',
      message: 'Location must be a string if provided.'
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}

module.exports = {
  validateCreateComplaint
};
