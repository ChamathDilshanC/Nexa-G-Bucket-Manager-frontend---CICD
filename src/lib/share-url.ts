import Constants from 'expo-constants';
import * as Linking from 'expo-linking';

import { config } from '@/lib/config';

const APP_SCHEME = 'nexagbucket';

/**
 * Build a shareable link for a bucket token.
 *
 * - Production / APK: nexagbucket://share/{token}
 * - Expo Go (dev):    exp://.../--/share/{token}  (same WiFi or tunnel)
 * - Optional override: EXPO_PUBLIC_SHARE_LINK_BASE=https://your-domain.com/share
 */
export function buildShareUrl(token: string) {
  const encodedToken = encodeURIComponent(token);

  if (config.shareLinkBase) {
    return `${config.shareLinkBase.replace(/\/$/, '')}/${encodedToken}`;
  }

  if (Constants.appOwnership !== 'expo') {
    return `${APP_SCHEME}://share/${encodedToken}`;
  }

  return Linking.createURL(`share/${encodedToken}`);
}

export function getShareLinkMode(): 'production' | 'expo-go' | 'custom' {
  if (config.shareLinkBase) return 'custom';
  if (Constants.appOwnership !== 'expo') return 'production';
  return 'expo-go';
}

export function getShareLinkHint() {
  const mode = getShareLinkMode();

  if (mode === 'custom') {
    return 'This link can be opened from any device with the app or web page configured.';
  }

  if (mode === 'production') {
    return 'Recipients need the Nexa-G-Bucket app installed. The link opens the shared bucket directly.';
  }

  return 'Expo Go mode: recipients need Expo Go installed and your dev server running. Use "expo start --tunnel" to share outside your Wi-Fi.';
}
