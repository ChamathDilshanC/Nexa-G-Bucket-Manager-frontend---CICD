import { authFetch, parseApiError } from '@/services/api-client';
import { config } from '@/lib/config';
import type {
  ShareCreatePayload,
  ShareLink,
  ShareResolve,
  ShareUpdatePayload,
} from '@/types/share';
import type { SignedUrlResponse, StorageFile } from '@/types/bucket';
import { ApiError } from '@/lib/api-error';

export function listMyShares() {
  return authFetch<ShareLink[]>('/shares/mine');
}

export function listBucketShares(bucketName: string) {
  return authFetch<ShareLink[]>(`/buckets/${encodeURIComponent(bucketName)}/shares`);
}

export function createBucketShare(bucketName: string, payload: ShareCreatePayload = {}) {
  return authFetch<ShareLink>(`/buckets/${encodeURIComponent(bucketName)}/shares`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateBucketShare(
  bucketName: string,
  shareId: string,
  payload: ShareUpdatePayload,
) {
  return authFetch<ShareLink>(
    `/buckets/${encodeURIComponent(bucketName)}/shares/${encodeURIComponent(shareId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  );
}

export function revokeBucketShare(bucketName: string, shareId: string) {
  return authFetch<void>(
    `/buckets/${encodeURIComponent(bucketName)}/shares/${encodeURIComponent(shareId)}`,
    { method: 'DELETE' },
  );
}

async function publicFetch<T>(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new ApiError(await parseApiError(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function resolveShareToken(token: string) {
  return publicFetch<ShareResolve>(`/shares/${encodeURIComponent(token)}`);
}

export function listSharedFiles(token: string) {
  return publicFetch<StorageFile[]>(`/shares/${encodeURIComponent(token)}/files`);
}

export function getSharedDownloadUrl(token: string, path: string) {
  return publicFetch<SignedUrlResponse>(`/shares/${encodeURIComponent(token)}/download-url`, {
    method: 'POST',
    body: JSON.stringify({ path }),
  });
}
