import { AntDesign } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';

import { Fonts } from '@/constants/fonts';
import { ZentraColors, ZentraLayout, ZentraTypography } from '@/constants/zentra-theme';

type AuthGoogleButtonProps = {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
};

export function AuthGoogleButton({
  label = 'Continue with Google',
  onPress,
  disabled = false,
}: AuthGoogleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="active:opacity-80"
      style={{
        height: ZentraLayout.buttonHeight,
        borderRadius: ZentraLayout.buttonRadius,
        borderWidth: 1,
        borderColor: ZentraColors.inputBorder,
        backgroundColor: ZentraColors.inputBackground,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        opacity: disabled ? 0.6 : 1,
      }}>
      <AntDesign name="google" size={18} color={ZentraColors.title} />
      <Text
        style={{
          fontFamily: Fonts.semibold,
          fontSize: ZentraTypography.button.fontSize,
          lineHeight: ZentraTypography.button.lineHeight,
          color: ZentraColors.title,
        }}>
        {label}
      </Text>
    </Pressable>
  );
}
