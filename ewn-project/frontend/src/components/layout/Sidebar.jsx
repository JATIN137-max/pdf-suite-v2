import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FiLayers, FiMinimize2, FiEdit3, FiImage, FiFileText,
  FiChevronLeft, FiChevronRight, FiGrid
} from 'react-icons/fi';

const tools = [
  { label: 'All Tools', path: '/', icon: <FiGrid />, color: '#2563eb' },
  { label: 'Merge PDF', path: '/merge-pdf', icon: <FiLayers />, color: '#2563eb' },
  { label: 'Compress PDF', path: '/compress-pdf', icon: <FiMinimize2 />, color: '#10b981' },
  { label: 'Edit PDF', path: '/edit-pdf', icon: <FiEdit3 />, color: '#ef4444' },
  { label: 'PDF to JPG', path: '/pdf-to-image', icon: <FiImage />, color: '#2563eb' },
  { label: 'JPG to PDF', path: '/image-to-pdf', icon: <FiFileText />, color: '#10b981' },
  { label: 'Word to PDF', path: '/word-to-pdf', icon: <FiFileText />, color: '#2563eb' },
  { label: 'PDF to Word', path: '/pdf-to-word', icon: <FiFileText />, color: '#ef4444' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        top: '70px', // below navbar
        left: 0,
        height: 'calc(100vh - 70px)',
        width: collapsed ? '60px' : '220px',
        backgroundColor: 'var(--color-white)',
        borderRight: '1px solid var(--color-border)',
        boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 40,
        overflowX: 'hidden',
        overflowY: 'auto',
      }}>
        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-end',
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
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>

        {/* Tool links */}
        <nav style={{ flex: 1, padding: '0.5rem 0' }}>
          {tools.map((tool) => {
            const isActive = location.pathname === tool.path;
            return (
              <NavLink
                key={tool.path}
                to={tool.path}
                title={tool.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: collapsed ? '0.8rem' : '0.75rem 1rem',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  textDecoration: 'none',
                  color: isActive ? tool.color : 'var(--color-text-muted)',
                  backgroundColor: isActive ? (
                    tool.color === '#2563eb' ? 'var(--color-blue-light)' :
                    tool.color === '#10b981' ? '#f0fdf4' : 'var(--color-red-light)'
                  ) : 'transparent',
                  borderLeft: isActive ? `3px solid ${tool.color}` : '3px solid transparent',
                  fontWeight: isActive ? '600' : '400',
                  fontSize: '0.875rem',
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
                <span style={{
                  fontSize: '1.1rem',
                  color: isActive ? tool.color : 'inherit',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  {tool.icon}
                </span>
                {!collapsed && (
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {tool.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom label */}
        {!collapsed && (
          <div style={{
            padding: '1rem',
            borderTop: '1px solid var(--color-border)',
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            PDF Tools
          </div>
        )}
      </aside>

      {/* Spacer so main content doesn't hide behind sidebar */}
      <div style={{ width: collapsed ? '60px' : '220px', flexShrink: 0, transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)' }} />
    </>
  );
};

export default Sidebar;
