import { Text } from 'react-native';

import { Fonts } from '@/constants/fonts';
import { ZentraTypography } from '@/constants/zentra-theme';

type AuthErrorMessageProps = {
  message: string | null;
};

export function AuthErrorMessage({ message }: AuthErrorMessageProps) {
  if (!message) return null;

  return (
    <Text
      style={{
        fontFamily: Fonts.regular,
        fontSize: ZentraTypography.bullet.fontSize,
        lineHeight: ZentraTypography.bullet.lineHeight,
        color: '#F87171',
        marginBottom: 12,
      }}>
      {message}
    </Text>
  );
}
