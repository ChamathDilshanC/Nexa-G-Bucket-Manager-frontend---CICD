export type ShareRole = 'viewer' | 'editor';

export type ShareLink = {
  id: string;
  bucket_name: string;
  display_name: string | null;
  token: string;
  role: ShareRole;
  anyone_with_link: boolean;
  share_url: string;
  revoked_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ShareCreatePayload = {
  role?: ShareRole;
  anyone_with_link?: boolean;
};

export type ShareUpdatePayload = {
  role?: ShareRole;
  anyone_with_link?: boolean;
};

export type ShareResolve = {
  bucket_name: string;
  display_name: string;
  role: ShareRole;
  file_count: number | null;
};

export const SHARE_ROLE_LABELS: Record<ShareRole, string> = {
  viewer: 'Viewer',
  editor: 'Editor',
};

export const ACCESS_MODE_OPTIONS = [
  { value: 'restricted', label: 'Restricted', description: 'Only people with access can open' },
  {
    value: 'anyone',
    label: 'Anyone with the link',
    description: 'Anyone on the internet with the link can view',
  },
] as const;
