import { useEffect } from 'react';

/**
 * Hook to keep the backend and frontend active while the user is on the site.
 * This pings the backend every 6 minutes.
 */
export function useKeepAlive() {
  useEffect(() => {
    const KEEPALIVE_INTERVAL = 6 * 60 * 1000; // 6 minutes
    const backendUrl = import.meta.env.VITE_API_URL || 'https://makeawish-yo9n.onrender.com';

    const ping = async () => {
      try {
        console.log('[Keep-Alive] Pinging backend...');
        await fetch(`${backendUrl}/`);
      } catch (error) {
        console.error('[Keep-Alive] Ping failed:', error);
      }
    };

    // Initial ping
    ping();

    const interval = setInterval(ping, KEEPALIVE_INTERVAL);

    return () => clearInterval(interval);
  }, []);
}
