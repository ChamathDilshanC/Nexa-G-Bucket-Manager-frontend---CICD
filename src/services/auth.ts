import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { assertAuthConfig } from '@/lib/config';
import { saveSession } from '@/lib/session';
import { supabase } from '@/lib/supabase';
import {
  exchangeGoogleCode,
  getGoogleAuthUrl,
  toStoredSession,
} from '@/services/api';

WebBrowser.maybeCompleteAuthSession();

function getRedirectUri() {
  return Linking.createURL('auth/callback');
}

function extractCodeFromUrl(url: string) {
  const parsed = Linking.parse(url);
  const code = parsed.queryParams?.code;
  return typeof code === 'string' ? code : null;
}

export async function signInWithEmail(email: string, password: string) {
  assertAuthConfig();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  if (!data.session) throw new Error('No session returned from Supabase.');

  await saveSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_in: data.session.expires_in ?? null,
    user: {
      id: data.session.user.id,
      email: data.session.user.email ?? null,
    },
  });

  return data.session;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) {
  assertAuthConfig();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) throw new Error(error.message);
  if (!data.session) {
    throw new Error('Check your email to confirm your account, then sign in.');
  }

  await saveSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_in: data.session.expires_in ?? null,
    user: {
      id: data.session.user.id,
      email: data.session.user.email ?? null,
    },
  });

  return data.session;
}

export async function signInWithGoogle() {
  const redirectUri = getRedirectUri();
  const { url } = await getGoogleAuthUrl(redirectUri);
  const result = await WebBrowser.openAuthSessionAsync(url, redirectUri);

  if (result.type !== 'success' || !result.url) {
    throw new Error('Google sign-in was cancelled.');
  }

  const code = extractCodeFromUrl(result.url);
  if (!code) {
    throw new Error('Google sign-in did not return an authorization code.');
  }

  const session = await exchangeGoogleCode(code);
  await saveSession(toStoredSession(session));
  return session;
}
