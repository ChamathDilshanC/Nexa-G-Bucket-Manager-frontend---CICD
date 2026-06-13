import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'nexa_access_token';
const REFRESH_TOKEN_KEY = 'nexa_refresh_token';

export type StoredSession = {
  access_token: string;
  refresh_token: string | null;
  expires_in: number | null;
  user: Record<string, string | null>;
};

export async function saveSession(session: StoredSession) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, session.access_token);
  if (session.refresh_token) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, session.refresh_token);
  } else {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
}

export async function getAccessToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}
