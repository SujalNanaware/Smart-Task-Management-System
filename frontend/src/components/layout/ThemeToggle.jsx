import { IconButton, Tooltip } from '@mui/material';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({
  darkMode,
  setDarkMode,
  className = 'auth-theme-toggle',
  sx,
}) {
  const label = darkMode ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <Tooltip title={label}>
      <IconButton
        className={className}
        onClick={() => setDarkMode(!darkMode)}
        aria-label={label}
        sx={sx}
      >
        {darkMode ? <Sun size={19} /> : <Moon size={19} />}
      </IconButton>
    </Tooltip>
  );
}
