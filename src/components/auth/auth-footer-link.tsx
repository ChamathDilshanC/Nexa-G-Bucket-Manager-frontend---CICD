import { Pressable, Text } from 'react-native';

import { Fonts } from '@/constants/fonts';
import { ZentraColors, ZentraTypography } from '@/constants/zentra-theme';

type AuthFooterLinkProps = {
  text: string;
  linkText: string;
  onPress: () => void;
};

export function AuthFooterLink({ text, linkText, onPress }: AuthFooterLinkProps) {
  return (
    <Pressable onPress={onPress} className="items-center py-2 active:opacity-70">
      <Text
        style={{
          fontFamily: Fonts.regular,
          fontSize: ZentraTypography.footer.fontSize,
          lineHeight: ZentraTypography.footer.lineHeight,
          color: ZentraColors.footer,
          textAlign: 'center',
        }}>
        {text}{' '}
        <Text style={{ fontFamily: Fonts.medium, color: ZentraColors.accent }}>{linkText}</Text>
      </Text>
    </Pressable>
  );
}
