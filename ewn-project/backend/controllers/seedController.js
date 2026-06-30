// controllers/seedController.js
// Exposes a GET endpoint that seeds the 15 starter blog posts into MongoDB.
// Visit it once in your browser (with the correct secret) to populate the blog.
// Safe to visit more than once - it upserts by slug, so it won't create duplicates.

const BlogPost = require('../models/BlogPost');
const posts = require('../seedData');

exports.seedBlog = async (req, res) => {
  // Simple protection so a random visitor can't trigger this.
  // Set SEED_SECRET in Render's Environment tab, then visit:
  // https://your-backend.onrender.com/api/seed-blog?secret=whateverYouSet
  if (!process.env.SEED_SECRET || req.query.secret !== process.env.SEED_SECRET) {
    return res.status(403).json({ message: 'Forbidden - missing or incorrect secret.' });
  }

  try {
    let created = 0;
    let updated = 0;

    for (const post of posts) {
      const result = await BlogPost.findOneAndUpdate(
        { slug: post.slug },
        { ...post, published: true },
        { upsert: true, new: true, rawResult: true }
      );

      if (result.lastErrorObject && result.lastErrorObject.updatedExisting) {
        updated++;
      } else {
        created++;
      }
    }

    res.json({
      message: 'Seeding complete.',
      created,
      updated,
      totalInFile: posts.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Seeding failed', error: error.message });
  }
};
