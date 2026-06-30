import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import SEO from '../../components/SEO';
import { FiCalendar, FiArrowLeft } from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_URL || 'https://pdf-suite-v2.onrender.com';

const CATEGORY_LABELS = {
  'pdf-tools': 'PDF Tools',
  'ai-tools': 'AI Tools',
  'productivity': 'Productivity',
  'guides': 'Guides',
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE}/api/blog/${slug}`);
        setPost(res.data);
      } catch (err) {
        console.error('Failed to load blog post:', err);
        setError(
          err.response?.status === 404
            ? 'This post could not be found.'
            : 'Could not load this post right now. Please try again later.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
        Loading post...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <p style={{ color: 'var(--color-red)', marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
      </div>
    );
  }

  return (
    <article className="animate-slide-up" style={{ maxWidth: '760px', margin: '0 auto', paddingTop: '2rem' }}>
      <SEO
        title={`${post.title} | EWN Blog`}
        description={post.metaDescription}
        path={`/blog/${post.slug}`}
      />

      <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        <FiArrowLeft /> Back to Blog
      </Link>

      <span style={{
        display: 'inline-block',
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

      <h1 style={{ fontSize: '2.25rem', lineHeight: 1.2, marginBottom: '1rem' }}>{post.title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
        <FiCalendar /> {formatDate(post.publishedAt)}
      </div>

      <div className="blog-content" style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-text-main)' }}>
        <ReactMarkdown
          components={{
            h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem' }} {...props} />,
            h3: ({ node, ...props }) => <h3 style={{ fontSize: '1.2rem', marginTop: '2rem', marginBottom: '0.75rem' }} {...props} />,
            p: ({ node, ...props }) => <p style={{ marginBottom: '1.25rem' }} {...props} />,
            ul: ({ node, ...props }) => <ul style={{ marginBottom: '1.25rem', paddingLeft: '1.5rem' }} {...props} />,
            ol: ({ node, ...props }) => <ol style={{ marginBottom: '1.25rem', paddingLeft: '1.5rem' }} {...props} />,
            li: ({ node, ...props }) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
            a: ({ node, ...props }) => <a style={{ color: 'var(--color-blue)' }} {...props} />,
            strong: ({ node, ...props }) => <strong style={{ fontWeight: '700' }} {...props} />,
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default BlogPost;
