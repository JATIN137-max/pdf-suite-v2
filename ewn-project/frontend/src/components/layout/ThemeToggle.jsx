import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ style, className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={style}
    >
      <span className="theme-toggle-icon-wrap">
        <FiSun className="theme-toggle-icon theme-toggle-icon-sun" />
        <FiMoon className="theme-toggle-icon theme-toggle-icon-moon" />
      </span>
    </button>
  );
};

export default ThemeToggle;