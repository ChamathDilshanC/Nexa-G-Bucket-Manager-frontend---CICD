import { clearSession } from '@/lib/session';
import { supabase } from '@/lib/supabase';
import { withTimeout } from '@/lib/timeout';

const SIGN_OUT_TIMEOUT_MS = 5_000;

export async function signOutEverywhere() {
  await withTimeout(
    supabase.auth.signOut(),
    SIGN_OUT_TIMEOUT_MS,
    'Sign out timed out.',
  ).catch(() => undefined);
  await clearSession();
}
