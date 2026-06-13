import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts } from '@/constants/fonts';
import { ZentraColors, ZentraLayout, ZentraTypography } from '@/constants/zentra-theme';

type AuthScreenLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthScreenLayout({ title, subtitle, children, footer }: AuthScreenLayoutProps) {
  const { height } = useWindowDimensions();

  return (
    <View className="flex-1" style={{ backgroundColor: ZentraColors.background }}>
      <LinearGradient
        colors={[...ZentraColors.screenGradient]}
        locations={[...ZentraColors.screenGradientLocations]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: height * ZentraColors.screenGradientHeight,
        }}
      />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            className="flex-1"
            contentContainerClassName="flex-grow px-6 pb-8 pt-4"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View className="mb-8 flex-row items-center">
              <Image
                source={require('@/assets/NexaLogo.png')}
                style={{ width: 44, height: 44, tintColor: ZentraColors.title }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: Fonts.semibold,
                  fontSize: ZentraTypography.brand.fontSize,
                  lineHeight: ZentraTypography.brand.lineHeight,
                  color: ZentraColors.title,
                  marginLeft: 10,
                }}>
                Nexa
              </Text>
            </View>

            <Text
              style={{
                fontFamily: Fonts.bold,
                fontSize: ZentraTypography.title.fontSize,
                lineHeight: ZentraTypography.title.lineHeight,
                letterSpacing: ZentraTypography.title.letterSpacing,
                color: ZentraColors.title,
              }}>
              {title}
            </Text>

            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: ZentraTypography.body.fontSize,
                lineHeight: ZentraTypography.body.lineHeight,
                color: ZentraColors.body,
                marginTop: 12,
              }}>
              {subtitle}
            </Text>

            <View className="mt-8">{children}</View>

            {footer ? <View className="mt-6">{footer}</View> : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
