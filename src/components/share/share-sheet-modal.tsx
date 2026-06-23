import * as Clipboard from 'expo-clipboard';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ShareOptionPicker, ShareDropdownTrigger } from '@/components/share/share-option-picker';
import { ACCESS_OPTIONS, ROLE_OPTIONS, type AccessMode } from '@/components/share/share-options';
import {
  ShareRecipientsInput,
  buildShareClipboardText,
  dismissShareKeyboard,
  type ShareRecipientsInputRef,
} from '@/components/share/share-recipients-input';
import { ShareQrPanel } from '@/components/share/share-qr-panel';
import { AppIcon } from '@/components/ui/app-icon';
import { Fonts } from '@/constants/fonts';
import { ZentraLayout, type ThemePalette } from '@/constants/zentra-theme';
import { useThemeColors } from '@/contexts/theme-context';
import { buildShareUrl, getShareLinkHint } from '@/lib/share-url';
import {
  createBucketShare,
  listBucketShares,
  updateBucketShare,
} from '@/services/shares';
import { ApiError } from '@/services/api';
import type { ShareLink, ShareRole } from '@/types/share';
import { SHARE_ROLE_LABELS } from '@/types/share';

type ShareSheetModalProps = {
  visible: boolean;
  bucketName: string;
  displayName: string;
  ownerEmail?: string | null;
  onClose: () => void;
  onRecipientsConfirm?: (recipients: string[]) => void;
};

export function ShareSheetModal({
  visible,
  bucketName,
  displayName,
  ownerEmail,
  onClose,
  onRecipientsConfirm,
}: ShareSheetModalProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = useMemo(() => createShareSheetStyles(colors), [colors]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [share, setShare] = useState<ShareLink | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [accessPickerOpen, setAccessPickerOpen] = useState(false);
  const [rolePickerOpen, setRolePickerOpen] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);
  const recipientsInputRef = useRef<ShareRecipientsInputRef>(null);

  const shareUrl = share ? buildShareUrl(share.token) : '';
  const accessMode: AccessMode = share?.anyone_with_link ? 'anyone' : 'restricted';
  const selectedAccess = ACCESS_OPTIONS.find((option) => option.value === accessMode) ?? ACCESS_OPTIONS[0];

  const loadShare = useCallback(async () => {
    try {
      setLoading(true);
      const existing = await listBucketShares(bucketName);
      if (existing.length > 0) {
        setShare(existing[0]);
        return;
      }
      const created = await createBucketShare(bucketName, {
        role: 'viewer',
        anyone_with_link: true,
      });
      setShare(created);
    } catch (err) {
      Alert.alert(
        'Share unavailable',
        err instanceof ApiError ? err.message : 'Could not load share settings.',
      );
      onClose();
    } finally {
      setLoading(false);
    }
  }, [bucketName, onClose]);

  useEffect(() => {
    if (!visible) {
      setShowQr(false);
      setCopied(false);
      setAccessPickerOpen(false);
      setRolePickerOpen(false);
      setRecipients([]);
      return;
    }
    void loadShare();
  }, [visible, loadShare]);

  async function persistShare(updates: { role?: ShareRole; anyone_with_link?: boolean }) {
    if (!share) return;
    try {
      setSaving(true);
      const updated = await updateBucketShare(bucketName, share.id, updates);
      setShare(updated);
    } catch (err) {
      Alert.alert('Update failed', err instanceof ApiError ? err.message : 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  }

  function getFinalRecipients() {
    return recipientsInputRef.current?.commitPending() ?? recipients;
  }

  async function handleCopyLink() {
    if (!shareUrl) return;
    dismissShareKeyboard();
    const finalRecipients = getFinalRecipients();
    const clipboardText = buildShareClipboardText(shareUrl, finalRecipients);
    await Clipboard.setStringAsync(clipboardText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDone() {
    dismissShareKeyboard();
    const finalRecipients = getFinalRecipients();
    onRecipientsConfirm?.(finalRecipients);
    onClose();
  }

  async function handleAccessChange(mode: AccessMode) {
    if (!share) return;
    await persistShare({ anyone_with_link: mode === 'anyone' });
  }

  async function handleRoleChange(role: ShareRole) {
    if (!share) return;
    await persistShare({ role });
  }

  const ownerInitial = (ownerEmail?.[0] ?? 'Y').toUpperCase();
  const ownerName = ownerEmail ? `${ownerEmail.split('@')[0]} (you)` : 'You (owner)';
  const recipientRoleLabel = share ? SHARE_ROLE_LABELS[share.role] : 'Viewer';

  function getRecipientLabel(value: string) {
    if (value.includes('@')) return value.split('@')[0] ?? value;
    return value;
  }

  function getRecipientInitial(value: string) {
    return value.trim()[0]?.toUpperCase() ?? '?';
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleDone}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={handleDone} accessibilityLabel="Close share sheet" />

        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={2}>
              Share &quot;{displayName}&quot;
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={colors.accent} size="large" />
            </View>
          ) : (
            <>
              <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={styles.scrollContent}>
                <View style={styles.inputWrap}>
                  <ShareRecipientsInput
                    ref={recipientsInputRef}
                    recipients={recipients}
                    onChangeRecipients={setRecipients}
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>People with access</Text>
                  <View style={styles.personRow}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{ownerInitial}</Text>
                    </View>
                    <View style={styles.personCopy}>
                      <Text style={styles.personName}>{ownerName}</Text>
                      {ownerEmail ? <Text style={styles.personEmail}>{ownerEmail}</Text> : null}
                    </View>
                    <Text style={styles.roleBadge}>Owner</Text>
                  </View>

                  {recipients.map((recipient) => (
                    <View key={recipient} style={styles.personRow}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{getRecipientInitial(recipient)}</Text>
                      </View>
                      <View style={styles.personCopy}>
                        <Text style={styles.personName}>{getRecipientLabel(recipient)}</Text>
                        {recipient.includes('@') ? (
                          <Text style={styles.personEmail}>{recipient}</Text>
                        ) : null}
                      </View>
                      <Text style={styles.roleBadge}>{recipientRoleLabel}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>General access</Text>
                  <View className="flex-row items-center gap-2.5 rounded-2xl border border-app-border bg-app-surface p-3">
                    <Pressable
                      onPress={() => setAccessPickerOpen(true)}
                      disabled={saving}
                      className="min-h-[44px] min-w-0 flex-1 flex-row items-center active:opacity-90">
                      <View className="mr-2.5 h-10 w-10 shrink-0 items-center justify-center rounded-full border border-app-border bg-app-card">
                        <AppIcon name={selectedAccess.icon} size={18} color={colors.accent} />
                      </View>
                      <View className="min-w-0 flex-1 pr-1">
                        <Text
                          className="font-inter-semibold text-[15px] text-app-title"
                          numberOfLines={1}>
                          {selectedAccess.label}
                        </Text>
                        <Text className="mt-0.5 font-inter text-xs leading-4 text-app-body" numberOfLines={2}>
                          {selectedAccess.description}
                        </Text>
                      </View>
                    </Pressable>

                    <ShareDropdownTrigger
                      label={share ? SHARE_ROLE_LABELS[share.role] : 'Viewer'}
                      disabled={saving || accessMode === 'restricted'}
                      onPress={() => setRolePickerOpen(true)}
                    />
                  </View>
                </View>

                <View className="mb-2 flex-row items-start rounded-xl bg-blue-50 p-3 dark:bg-blue-950/40">
                  <View className="mr-2 mt-0.5">
                    <AppIcon name="information-circle-outline" size={18} color="#1D4ED8" />
                  </View>
                  <Text className="flex-1 font-inter text-sm leading-5 text-blue-800 dark:text-blue-200">
                    Viewers of this bucket can browse and download files. Editors can also upload
                    and delete files.
                  </Text>
                </View>

                <View style={styles.linkHintBanner}>
                  <Text style={styles.linkHintText}>{getShareLinkHint()}</Text>
                </View>

                {accessMode === 'anyone' && showQr && shareUrl ? (
                  <View style={styles.qrSection}>
                    <ShareQrPanel url={shareUrl} />
                  </View>
                ) : null}
              </ScrollView>

              <View className="flex-row items-center gap-2 border-t border-app-border pt-3">
                <Pressable
                  onPress={() => void handleCopyLink()}
                  disabled={accessMode !== 'anyone'}
                  className={[
                    'min-h-[44px] min-w-[104px] flex-row items-center justify-center gap-1.5 rounded-full border border-app-border-strong bg-app-card px-3 py-2.5 active:opacity-90',
                    accessMode !== 'anyone' ? 'opacity-45' : '',
                  ].join(' ')}>
                  <AppIcon name="link-outline" size={16} color={colors.body} />
                  <Text className="font-inter-semibold text-sm text-app-title">
                    {copied ? 'Copied' : 'Copy link'}
                  </Text>
                </Pressable>

                {accessMode === 'anyone' ? (
                  <Pressable
                    onPress={() => setShowQr((current) => !current)}
                    className="min-h-[44px] min-w-[96px] flex-row items-center justify-center gap-1.5 rounded-full border border-app-border-strong bg-app-card px-3 py-2.5 active:opacity-90">
                    <AppIcon name="qr-code-outline" size={16} color={colors.body} />
                    <Text className="font-inter-semibold text-sm text-app-title">
                      {showQr ? 'Hide QR' : 'QR code'}
                    </Text>
                  </Pressable>
                ) : null}

                <Pressable
                  onPress={handleDone}
                  className="min-h-[44px] flex-1 items-center justify-center rounded-full bg-app-accent px-4 py-2.5 active:opacity-90">
                  <Text className="font-inter-semibold text-[15px] text-white">Done</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>

      <ShareOptionPicker
        visible={accessPickerOpen}
        title="General access"
        options={ACCESS_OPTIONS}
        selected={accessMode}
        onSelect={(value) => void handleAccessChange(value)}
        onClose={() => setAccessPickerOpen(false)}
      />

      <ShareOptionPicker
        visible={rolePickerOpen}
        title="Link permission"
        options={ROLE_OPTIONS}
        selected={share?.role ?? 'viewer'}
        onSelect={(value) => void handleRoleChange(value)}
        onClose={() => setRolePickerOpen(false)}
      />
    </Modal>
  );
}

function createShareSheetStyles(colors: ThemePalette) {
  return StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: ZentraLayout.horizontalPadding,
    paddingTop: 12,
    maxHeight: '90%',
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.muted,
    marginBottom: 16,
  },
  headerRow: {
    marginBottom: 16,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.title,
  },
  loadingWrap: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 12,
  },
  inputWrap: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontFamily: Fonts.semibold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.body,
    marginBottom: 10,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
    color: colors.accent,
  },
  personCopy: {
    flex: 1,
    paddingRight: 8,
  },
  personName: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.title,
  },
  personEmail: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.body,
    marginTop: 2,
  },
  roleBadge: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: colors.body,
  },
  linkHintBanner: {
    backgroundColor: 'rgba(251, 146, 60, 0.12)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.35)',
  },
  linkHintText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: '#C2410C',
  },
  qrSection: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    backgroundColor: colors.surface,
    paddingVertical: 8,
  },
  pressed: {
    opacity: 0.88,
  },
  });
}
