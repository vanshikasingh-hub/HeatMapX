/**
 * Utility functions for consistent date & time formatting across HeatMapX.
 * Prevents hardcoded days/dates and ensures dynamic, human-readable labels.
 */

export function getCurrentDateFormatted() {
  const now = new Date();
  return now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function getCurrentTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

/**
 * Returns dynamic day labels for an offset from today.
 * E.g., offset 0 -> "Today (Sun)", offset 1 -> "Tomorrow (Mon)", offset 2 -> "Tue (08 Sep)"
 */
export function getForecastDayLabel(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
  const dayMonth = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  if (offsetDays === 0) return `Today (${weekday})`;
  if (offsetDays === 1) return `Tomorrow (${weekday})`;
  return `${weekday} (${dayMonth})`;
}

/**
 * Formats a relative timestamp (e.g. for citizen action feed)
 */
export function formatRelativeTime(dateStr) {
  if (!dateStr) return 'Recently';
  const actionDate = new Date(dateStr);
  if (isNaN(actionDate.getTime())) return dateStr;

  const diffMs = Date.now() - actionDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return actionDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
