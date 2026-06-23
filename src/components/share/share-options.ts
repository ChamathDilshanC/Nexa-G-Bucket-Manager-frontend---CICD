import type { AppIconName } from '@/components/ui/app-icon';
import { AppIcons } from '@/components/ui/app-icon';
import type { ShareRole } from '@/types/share';

export type AccessMode = 'anyone' | 'restricted';

export const ACCESS_OPTIONS: {
  value: AccessMode;
  label: string;
  description: string;
  icon: AppIconName;
}[] = [
  {
    value: 'restricted',
    label: 'Restricted',
    description: 'Only people with access can open this bucket',
    icon: AppIcons.lock,
  },
  {
    value: 'anyone',
    label: 'Anyone with the link',
    description: 'Anyone on the internet with the link can open',
    icon: AppIcons.globe,
  },
];

export const ROLE_OPTIONS: {
  value: ShareRole;
  label: string;
  description: string;
  icon: AppIconName;
}[] = [
  {
    value: 'viewer',
    label: 'Viewer',
    description: 'Can browse and download files',
    icon: AppIcons.eye,
  },
  {
    value: 'editor',
    label: 'Editor',
    description: 'Can upload, download, and delete files',
    icon: AppIcons.edit,
  },
];
