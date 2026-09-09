import cron from 'node-cron';
import { supabase } from '../config/supabase';

export interface SupabasePingResult {
  success: boolean;
  timestamp: string;
  latencyMs?: number;
  error?: string;
}

/**
 * Executes an ultra-lightweight SELECT query on Supabase (1 row from wishes table)
 * to keep the Postgres compute active and prevent pause/inactivity suspension.
 */
export const pingSupabase = async (): Promise<SupabasePingResult> => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  try {
    const { data, error, status } = await supabase
      .from('wishes')
      .select('id')
      .limit(1);

    const latencyMs = Date.now() - startTime;

    if (error) {
      console.error(`[Supabase Keep-Alive] [${timestamp}] Query returned error (Status: ${status}):`, error.message);
      return {
        success: false,
        timestamp,
        latencyMs,
        error: error.message,
      };
    }

    console.log(`[Supabase Keep-Alive] [${timestamp}] Supabase is active & awake. (Latency: ${latencyMs}ms, Status: ${status})`);
    return {
      success: true,
      timestamp,
      latencyMs,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    console.error(`[Supabase Keep-Alive] [${timestamp}] Exception during heartbeat:`, err.message);
    return {
      success: false,
      timestamp,
      latencyMs,
      error: err.message,
    };
  }
};

/**
 * Initializes the recurring cron job to ping Supabase every 3 days (at 03:00 AM)
 * and executes an immediate heartbeat on startup.
 */
export const startSupabaseKeepAliveCron = (): void => {
  // 1. Run an immediate ping on server boot
  pingSupabase().catch((err) => console.error('[Supabase Keep-Alive] Startup ping failed:', err));

  // 2. Schedule recurring cron: Every 3 days at 03:00 AM ('0 3 */3 * *')
  cron.schedule('0 3 */3 * *', async () => {
    console.log('[Supabase Keep-Alive Cron] Triggering scheduled 3-day database heartbeat...');
    await pingSupabase();
  });

  console.log('[Supabase Keep-Alive] Cron scheduled: Running every 3 days at 03:00 AM to keep Supabase perpetually active.');
};
