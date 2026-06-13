import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text } from 'react-native';

import { Fonts } from '@/constants/fonts';
import { ZentraColors, ZentraLayout, ZentraTypography } from '@/constants/zentra-theme';

type AuthButtonProps = {
  label: string;
  onPress: () => void;
};

export function AuthButton({ label, onPress }: AuthButtonProps) {
  return (
    <Pressable onPress={onPress} className="mt-2 overflow-hidden active:opacity-90" style={{ borderRadius: ZentraLayout.buttonRadius }}>
      <LinearGradient
        colors={[ZentraColors.buttonStart, ZentraColors.buttonEnd]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          height: ZentraLayout.buttonHeight,
          borderRadius: ZentraLayout.buttonRadius,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: Fonts.semibold,
            fontSize: ZentraTypography.button.fontSize,
            lineHeight: ZentraTypography.button.lineHeight,
            color: ZentraColors.title,
          }}>
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}
