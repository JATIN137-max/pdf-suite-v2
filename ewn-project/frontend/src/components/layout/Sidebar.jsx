import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FiLayers, FiMinimize2, FiEdit3, FiImage, FiFileText,
  FiChevronLeft, FiChevronRight, FiChevronDown, FiGrid, FiMenu, FiX
} from 'react-icons/fi';

// Every tool lives inside a category instead of one flat list. Today
// there's only one — "PDF Tools" — rendered as an expand/collapse section
// beneath "All Tools". Adding a future category (e.g. Image Tools) is just
// pushing another object into this array; the accordion logic below
// doesn't change.
const toolCategories = [
  {
    id: 'pdf',
    label: 'PDF Tools',
    icon: <FiFileText />,
    color: '#2563eb',
    tools: [
      { label: 'Merge PDF', path: '/merge-pdf', icon: <FiLayers />, color: '#2563eb' },
      { label: 'Compress PDF', path: '/compress-pdf', icon: <FiMinimize2 />, color: '#10b981' },
      { label: 'Edit PDF', path: '/edit-pdf', icon: <FiEdit3 />, color: '#ef4444' },
      { label: 'PDF to JPG', path: '/pdf-to-image', icon: <FiImage />, color: '#2563eb' },
      { label: 'JPG to PDF', path: '/image-to-pdf', icon: <FiFileText />, color: '#10b981' },
      { label: 'Word to PDF', path: '/word-to-pdf', icon: <FiFileText />, color: '#2563eb' },
      { label: 'PDF to Word', path: '/pdf-to-word', icon: <FiFileText />, color: '#ef4444' },
    ],
  },
];

// Match this to the CSS breakpoint below
const MOBILE_BREAKPOINT = 768;

const colorBg = (color) => (
  color === '#2563eb' ? 'var(--color-blue-light)' :
  color === '#10b981' ? '#f0fdf4' : 'var(--color-red-light)'
);

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BREAKPOINT : false
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Which category's tool list is expanded. Starts open if the current
  // page is already one of that category's tools, so a direct link to
  // e.g. /merge-pdf lands with "PDF Tools" pre-expanded.
  const [openCategory, setOpenCategory] = useState(() => {
    const match = toolCategories.find((cat) => cat.tools.some((t) => t.path === location.pathname));
    return match ? match.id : null;
  });

  // Track viewport so we know whether to render desktop or mobile mode
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll while the mobile drawer is open
  useEffect(() => {
    if (isMobile && mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, mobileOpen]);

  const effectiveCollapsed = isMobile ? false : collapsed;
  // On mobile, the sidebar is either fully open (drawer) or fully hidden
  const sidebarWidth = isMobile ? '240px' : (effectiveCollapsed ? '60px' : '220px');

  const handleCategoryClick = (categoryId) => {
    // If the sidebar is iconified, expand it first so the tool list has
    // somewhere to render, then open the category.
    if (effectiveCollapsed) {
      setCollapsed(false);
      setOpenCategory(categoryId);
      return;
    }
    setOpenCategory((c) => (c === categoryId ? null : categoryId));
  };

  return (
    <>
      {/* Mobile hamburger trigger - only rendered on mobile, sits in normal flow */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open tools menu"
          style={{
            position: 'fixed',
            top: '15px',
            left: '8px',
            zIndex: 45,
            width: '34px',
            height: '34px',
            display: mobileOpen ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            color: 'var(--color-text-main)',
            fontSize: '1.1rem',
            cursor: 'pointer',
          }}
        >
          <FiMenu />
        </button>
      )}

      {/* Backdrop overlay, mobile only, only when drawer is open */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            zIndex: 39,
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        top: isMobile ? 0 : '70px', // full height drawer on mobile, below navbar on desktop
        left: isMobile && !mobileOpen ? `-${sidebarWidth}` : 0,
        height: isMobile ? '100vh' : 'calc(100vh - 70px)',
        width: sidebarWidth,
        backgroundColor: 'var(--color-white)',
        borderRight: '1px solid var(--color-border)',
        boxShadow: isMobile ? '4px 0 16px rgba(0,0,0,0.15)' : '2px 0 8px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        transition: isMobile ? 'left 0.25s cubic-bezier(0.4,0,0.2,1)' : 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 40,
        overflowX: 'hidden',
        overflowY: 'auto',
      }}>
        {/* Toggle / close button */}
        <button
          onClick={() => isMobile ? setMobileOpen(false) : setCollapsed(!collapsed)}
          title={isMobile ? 'Close menu' : (collapsed ? 'Expand sidebar' : 'Collapse sidebar')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: (effectiveCollapsed && !isMobile) ? 'center' : 'flex-end',
            padding: '0.75rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: '1px solid var(--color-border)',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
            fontSize: '1.1rem',
            transition: 'color 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-blue)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
        >
          {isMobile ? <FiX /> : (collapsed ? <FiChevronRight /> : <FiChevronLeft />)}
        </button>

        <nav style={{ flex: 1, padding: '0.5rem 0' }}>
          {/* All Tools — stays a flat top-level link, not part of any category */}
          <NavLink
            to="/"
            title="All Tools"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: effectiveCollapsed ? '0.8rem' : '0.75rem 1rem',
              justifyContent: effectiveCollapsed ? 'center' : 'flex-start',
              textDecoration: 'none',
              color: location.pathname === '/' ? '#2563eb' : 'var(--color-text-muted)',
              backgroundColor: location.pathname === '/' ? 'var(--color-blue-light)' : 'transparent',
              borderLeft: location.pathname === '/' ? '3px solid #2563eb' : '3px solid transparent',
              fontWeight: location.pathname === '/' ? '600' : '400',
              fontSize: '0.875rem',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              if (location.pathname !== '/') {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-light)';
                e.currentTarget.style.color = '#2563eb';
              }
            }}
            onMouseLeave={e => {
              if (location.pathname !== '/') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-muted)';
              }
            }}
          >
            <span style={{ fontSize: '1.1rem', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <FiGrid />
            </span>
            {!effectiveCollapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>All Tools</span>}
          </NavLink>

          {/* Tool categories — "PDF Tools" today, more can be added later.
              Each is a click-to-expand section rather than flat links. */}
          {toolCategories.map((category) => {
            const isCategoryActive = category.tools.some((t) => t.path === location.pathname);
            const isOpen = openCategory === category.id;

            return (
              <div key={category.id} style={{ marginTop: '0.25rem' }}>
                <button
                  type="button"
                  onClick={() => handleCategoryClick(category.id)}
                  aria-expanded={isOpen}
                  title={category.label}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: effectiveCollapsed ? '0.8rem' : '0.75rem 1rem',
                    justifyContent: effectiveCollapsed ? 'center' : 'flex-start',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: isCategoryActive ? category.color : 'var(--color-text-muted)',
                    backgroundColor: isCategoryActive ? colorBg(category.color) : 'transparent',
                    borderLeft: isCategoryActive ? `3px solid ${category.color}` : '3px solid transparent',
                    fontWeight: isCategoryActive ? '600' : '400',
                    fontSize: '0.875rem',
                    fontFamily: 'Outfit, sans-serif',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    if (!isCategoryActive) {
                      e.currentTarget.style.backgroundColor = 'var(--color-bg-light)';
                      e.currentTarget.style.color = category.color;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isCategoryActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-muted)';
                    }
                  }}
                >
                  <span style={{ fontSize: '1.1rem', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    {category.icon}
                  </span>
                  {!effectiveCollapsed && (
                    <>
                      <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {category.label}
                      </span>
                      <FiChevronDown style={{
                        fontSize: '0.85rem',
                        flexShrink: 0,
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s',
                      }} />
                    </>
                  )}
                </button>

                {!effectiveCollapsed && isOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {category.tools.map((tool) => {
                      const isActive = location.pathname === tool.path;
                      return (
                        <NavLink
                          key={tool.path}
                          to={tool.path}
                          title={tool.label}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.6rem 1rem 0.6rem 2.1rem',
                            textDecoration: 'none',
                            color: isActive ? tool.color : 'var(--color-text-muted)',
                            backgroundColor: isActive ? colorBg(tool.color) : 'transparent',
                            borderLeft: isActive ? `3px solid ${tool.color}` : '3px solid transparent',
                            fontWeight: isActive ? '600' : '400',
                            fontSize: '0.82rem',
                            transition: 'all 0.15s ease',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                          }}
                          onMouseEnter={e => {
                            if (!isActive) {
                              e.currentTarget.style.backgroundColor = 'var(--color-bg-light)';
                              e.currentTarget.style.color = tool.color;
                            }
                          }}
                          onMouseLeave={e => {
                            if (!isActive) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = 'var(--color-text-muted)';
                            }
                          }}
                        >
                          <span style={{ fontSize: '0.95rem', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                            {tool.icon}
                          </span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{tool.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom label */}
        {!effectiveCollapsed && (
          <div style={{
            padding: '1rem',
            borderTop: '1px solid var(--color-border)',
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            More tools coming soon
          </div>
        )}
      </aside>

      {/* Spacer so main content doesn't hide behind sidebar - collapses to 0 on mobile since drawer floats over content */}
      <div style={{
        width: isMobile ? 0 : (effectiveCollapsed ? '60px' : '220px'),
        flexShrink: 0,
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
      }} />
    </>
  );
};

export default Sidebar;