const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Canonical API Base URL (e.g., http://localhost:3001/api)
export const API_BASE = rawApiUrl.replace(/\/api\/?$/, '') + '/api';

// Canonical Server Origin (e.g., http://localhost:3001)
export const API_SERVER = rawApiUrl.replace(/\/api\/?$/, '');
