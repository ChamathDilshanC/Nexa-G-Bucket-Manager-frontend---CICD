export const config = {
  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://nexa-g-bucket-manager-backend.vercel.app',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://qdmwlxvbcpdsuykhxrja.supabase.co',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
} as const;

function isPlaceholderKey(value: string) {
  const normalized = value.trim().toLowerCase();
  return (
    normalized.length < 20 ||
    normalized.includes('your key') ||
    normalized.includes('your_supabase') ||
    normalized.includes('your key here')
  );
}

export function assertAuthConfig() {
  if (!config.supabaseAnonKey) {
    throw new Error('Missing EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.');
  }

  if (isPlaceholderKey(config.supabaseAnonKey)) {
    throw new Error(
      'Invalid Supabase API key. Set EXPO_PUBLIC_SUPABASE_ANON_KEY in .env to your project anon key from Supabase Dashboard → Project Settings → API.',
    );
  }
}
