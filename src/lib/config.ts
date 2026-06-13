export const config = {
  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://nexa-g-bucket-manager-backend.vercel.app',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://qdmwlxvbcpdsuykhxrja.supabase.co',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
} as const;

export function assertAuthConfig() {
  if (!config.supabaseAnonKey) {
    throw new Error('Missing EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.');
  }
}
