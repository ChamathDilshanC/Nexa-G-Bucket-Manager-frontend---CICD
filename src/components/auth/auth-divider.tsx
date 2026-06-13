import { Text, View } from 'react-native';

import { Fonts } from '@/constants/fonts';
import { ZentraColors, ZentraTypography } from '@/constants/zentra-theme';

export function AuthDivider() {
  return (
    <View className="my-5 flex-row items-center gap-4">
      <View className="h-px flex-1" style={{ backgroundColor: ZentraColors.inputBorder }} />
      <Text
        style={{
          fontFamily: Fonts.regular,
          fontSize: ZentraTypography.footer.fontSize,
          color: ZentraColors.footer,
        }}>
        Or
      </Text>
      <View className="h-px flex-1" style={{ backgroundColor: ZentraColors.inputBorder }} />
    </View>
  );
}
