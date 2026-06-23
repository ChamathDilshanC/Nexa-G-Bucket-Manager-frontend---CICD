import { useMemo } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/fonts';
import type { ThemePalette } from '@/constants/zentra-theme';
import { useThemeColors } from '@/contexts/theme-context';

type ShareQrPanelProps = {
  url: string;
  label?: string;
};

export function ShareQrPanel({ url, label = 'Scan to open this bucket' }: ShareQrPanelProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.qrWrap}>
        <QRCode value={url} size={168} backgroundColor="#FFFFFF" color="#0A0A0A" />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.url} numberOfLines={2}>
        {url}
      </Text>
    </View>
  );
}

function createStyles(colors: ThemePalette) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: 8,
    },
    qrWrap: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    label: {
      marginTop: 16,
      fontFamily: Fonts.medium,
      fontSize: 14,
      lineHeight: 20,
      color: colors.title,
      textAlign: 'center',
    },
    url: {
      marginTop: 8,
      fontFamily: Fonts.regular,
      fontSize: 12,
      lineHeight: 18,
      color: colors.muted,
      textAlign: 'center',
      paddingHorizontal: 12,
    },
  });
}
