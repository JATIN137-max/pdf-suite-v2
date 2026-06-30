import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../../components/SEO';
import { FiArrowRight, FiCalendar } from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_URL || 'https://pdf-suite-v2.onrender.com';

const CATEGORY_LABELS = {
  'pdf-tools': 'PDF Tools',
  'ai-tools': 'AI Tools',
  'productivity': 'Productivity',
  'guides': 'Guides',
};

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/blog`);
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
        setError('Could not load blog posts right now. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="animate-slide-up">
      <SEO
        title="Blog - PDF Tips, AI Tools & Productivity Guides | EWN"
        description="Free guides on compressing, merging, and converting PDFs, plus the best AI and productivity tools to save you time."
        path="/blog"
      />

      <div className="page-header">
        <h1 className="page-title">EWN Blog</h1>
        <p className="page-subtitle">
          Practical guides on PDFs, AI tools, and getting more done.
        </p>
      </div>

      {isLoading && (
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem 0' }}>
          Loading posts...
        </p>
      )}

      {error && (
        <p style={{ textAlign: 'center', color: 'var(--color-red)', padding: '2rem 0' }}>
          {error}
        </p>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem 0' }}>
          No posts published yet - check back soon.
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="card"
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
          >
            <span style={{
              display: 'inline-block',
              alignSelf: 'flex-start',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'var(--color-blue)',
              backgroundColor: 'var(--color-blue-light)',
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              marginBottom: '1rem',
            }}>
              {CATEGORY_LABELS[post.category] || 'Guides'}
            </span>

            <h2 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>
              {post.title}
            </h2>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>
              {post.excerpt}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FiCalendar /> {formatDate(post.publishedAt)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-blue)', fontWeight: '600' }}>
                Read more <FiArrowRight />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
