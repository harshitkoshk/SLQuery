const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: process.env.GROQ_MODEL || 'qwen/qwen3.6-27b',
  FRONTEND_URL: process.env.FRONTEND_URL || '*',
  UPLOAD_DIR: path.join(__dirname, '../../uploads')
};

module.exports = env;
