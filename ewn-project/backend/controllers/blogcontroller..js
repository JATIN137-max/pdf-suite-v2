const BlogPost = require('../models/BlogPost');

// GET /api/blog - list all published posts, lightweight fields only
// (no full content - the listing page doesn't need it, keeps the payload small)
exports.listPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true })
      .select('title slug excerpt category tags publishedAt')
      .sort({ publishedAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('List posts error:', error);
    res.status(500).json({ message: 'Server error fetching blog posts' });
  }
};

// GET /api/blog/:slug - single post with full content
exports.getPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error fetching blog post' });
  }
};
