import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { useThemeColors } from '@/contexts/theme-context';

export type AppIconName = ComponentProps<typeof Ionicons>['name'];

type AppIconProps = {
  name: AppIconName;
  size?: number;
  color?: string;
};

export function AppIcon({ name, size = 20, color }: AppIconProps) {
  const colors = useThemeColors();
  return <Ionicons name={name} size={size} color={color ?? colors.icon} />;
}

export const AppIcons = {
  cloud: 'cloud-outline',
  folder: 'folder-open-outline',
  link: 'link-outline',
  settings: 'settings-outline',
  share: 'share-social-outline',
  lock: 'lock-closed-outline',
  globe: 'globe-outline',
  eye: 'eye-outline',
  edit: 'create-outline',
  checkmark: 'checkmark',
  chevronDown: 'chevron-down',
  chevronBack: 'chevron-back',
  information: 'information-circle-outline',
  qrCode: 'qr-code-outline',
  cube: 'cube-outline',
  image: 'image-outline',
  document: 'document-text-outline',
  folderOutline: 'folder-outline',
  mail: 'mail-outline',
  idCard: 'id-card-outline',
  person: 'person-outline',
  chevronForward: 'chevron-forward',
  shield: 'shield-checkmark-outline',
  key: 'key-outline',
  logOut: 'log-out-outline',
  cloudUpload: 'cloud-upload-outline',
  images: 'images-outline',
  close: 'close',
  moon: 'moon-outline',
  sunny: 'sunny-outline',
  phonePortrait: 'phone-portrait-outline',
} as const satisfies Record<string, AppIconName>;
