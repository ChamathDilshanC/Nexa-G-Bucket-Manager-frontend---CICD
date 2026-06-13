import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { Fonts } from '@/constants/fonts';
import { ZentraColors, ZentraTypography } from '@/constants/zentra-theme';

type AuthInputProps = TextInputProps & {
  label: string;
};

export function AuthInput({ label, ...props }: AuthInputProps) {
  return (
    <View className="mb-4">
      <Text
        style={{
          fontFamily: Fonts.medium,
          fontSize: ZentraTypography.body.fontSize,
          lineHeight: ZentraTypography.body.lineHeight,
          color: ZentraColors.title,
          marginBottom: 8,
        }}>
        {label}
      </Text>
      <TextInput
        placeholderTextColor={ZentraColors.inputPlaceholder}
        {...props}
        style={[
          {
            fontFamily: Fonts.regular,
            fontSize: ZentraTypography.body.fontSize,
            lineHeight: ZentraTypography.body.lineHeight,
            color: ZentraColors.title,
            backgroundColor: ZentraColors.inputBackground,
            borderWidth: 1,
            borderColor: ZentraColors.inputBorder,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
          },
          props.style,
        ]}
      />
    </View>
  );
}
