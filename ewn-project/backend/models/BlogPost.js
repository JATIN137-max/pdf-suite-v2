const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  metaDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 160,
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
  },
  // Body content stored as Markdown - rendered to HTML on the frontend.
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['pdf-tools', 'ai-tools', 'productivity', 'guides'],
    default: 'guides',
  },
  // Comma-free array, used for simple related-post matching later.
  tags: {
    type: [String],
    default: [],
  },
  published: {
    type: Boolean,
    default: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);
