import React from 'react';

/**
 * Reusable per-page SEO component.
 *
 * Uses React 19's native document metadata support: <title> and <meta>
 * tags rendered anywhere in the component tree are automatically hoisted
 * to <head> by React itself. No react-helmet or extra dependency needed.
 *
 * Usage - drop this at the top of any page component's return:
 *
 *   <SEO
 *     title="Merge PDF Files Online Free - No Signup | EWN"
 *     description="Combine multiple PDF files into one document instantly. Free, fast, and 100% in your browser - no uploads to a server."
 *     path="/merge-pdf"
 *   />
 *
 * Each page should pass a UNIQUE title + description matching what people
 * actually search for that specific tool - this is what lets Google match
 * a search query to the right page instead of always showing your homepage.
 */
const SITE_URL = 'https://pdf-suite-v2.vercel.app';
const SITE_NAME = 'EWN - Everything What\'s Needed';

const SEO = ({ title, description, path = '/' }) => {
  const fullUrl = `${SITE_URL}${path}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph - controls how this page looks when shared on social/chat apps */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
};

export default SEO;
