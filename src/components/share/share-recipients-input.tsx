import { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
  type TextInputSubmitEditingEventData,
} from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Fonts } from '@/constants/fonts';

type ShareRecipientsInputProps = {
  recipients: string[];
  onChangeRecipients: (next: string[]) => void;
  placeholder?: string;
};

export type ShareRecipientsInputRef = {
  commitPending: () => string[];
};

function getRecipientInitial(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '?';
  return trimmed[0]?.toUpperCase() ?? '?';
}

function normalizeRecipient(value: string) {
  return value.trim().replace(/,$/, '').trim();
}

function isValidRecipient(value: string) {
  const trimmed = normalizeRecipient(value);
  if (trimmed.length < 2) return false;
  if (trimmed.includes('@')) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }
  return /^[a-zA-Z0-9._-]{2,}$/.test(trimmed);
}

function appendRecipient(recipients: string[], raw: string) {
  const value = normalizeRecipient(raw);
  if (!isValidRecipient(value)) return recipients;

  const exists = recipients.some((item) => item.toLowerCase() === value.toLowerCase());
  if (exists) return recipients;

  return [...recipients, value];
}

export const ShareRecipientsInput = forwardRef<ShareRecipientsInputRef, ShareRecipientsInputProps>(
  function ShareRecipientsInput(
    { recipients, onChangeRecipients, placeholder = 'Add people, groups, and emails' },
    ref,
  ) {
    const [draft, setDraft] = useState('');

    function commitDraft(): string[] {
      if (!draft.trim()) return recipients;

      const next = appendRecipient(recipients, draft);
      if (next.length !== recipients.length) {
        onChangeRecipients(next);
      }
      setDraft('');
      return next;
    }

    useImperativeHandle(
      ref,
      () => ({
        commitPending: () => {
          if (!draft.trim()) return recipients;

          const next = appendRecipient(recipients, draft);
          if (next.length !== recipients.length) {
            onChangeRecipients(next);
          }
          setDraft('');
          return next;
        },
      }),
      [draft, recipients, onChangeRecipients],
    );

    function removeRecipient(value: string) {
      onChangeRecipients(recipients.filter((item) => item !== value));
    }

    function handleChangeText(text: string) {
      if (text.includes(',')) {
        const parts = text.split(',');
        const tail = parts.pop() ?? '';
        let next = recipients;
        parts.forEach((part) => {
          next = appendRecipient(next, part);
        });
        if (next.length !== recipients.length) {
          onChangeRecipients(next);
        }
        setDraft(tail);
        return;
      }
      setDraft(text);
    }

    function handleKeyPress(event: NativeSyntheticEvent<TextInputKeyPressEventData>) {
      if (event.nativeEvent.key === 'Enter') {
        commitDraft();
      }
    }

    function handleSubmitEditing(_event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) {
      commitDraft();
    }

    function handleBlur() {
      commitDraft();
    }

    return (
      <View className="rounded-2xl border border-app-border bg-app-surface px-3 py-3">
        <View className="flex-row flex-wrap items-center gap-2">
          {recipients.map((recipient) => (
            <View
              key={recipient}
            className="max-w-full flex-row items-center rounded-full border border-app-border bg-app-card py-1.5 pl-2 pr-1.5">
            <View className="mr-1.5 h-6 w-6 items-center justify-center rounded-full bg-app-accent-soft">
              <Text
                className="font-inter-semibold text-xs text-app-accent"
                  style={{ fontFamily: Fonts.semibold }}>
                  {getRecipientInitial(recipient)}
                </Text>
              </View>
              <Text
                className="mr-1 max-w-[140px] font-inter-medium text-sm text-app-title"
                numberOfLines={1}
                style={{ fontFamily: Fonts.medium }}>
                {recipient}
              </Text>
              <Pressable
                onPress={() => removeRecipient(recipient)}
                hitSlop={8}
                accessibilityLabel={`Remove ${recipient}`}
              className="h-6 w-6 items-center justify-center rounded-full active:bg-app-surface">
              <AppIcon name="close" size={14} color="#9CA3AF" />
              </Pressable>
            </View>
          ))}

          <TextInput
            value={draft}
            onChangeText={handleChangeText}
            onKeyPress={handleKeyPress}
            onSubmitEditing={handleSubmitEditing}
            onBlur={handleBlur}
            placeholder={recipients.length ? 'Add another' : placeholder}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="done"
            blurOnSubmit={false}
            className="min-h-[36px] min-w-[120px] flex-1 font-inter text-[15px] text-app-title"
            style={{ fontFamily: Fonts.regular, paddingVertical: 6 }}
          />
        </View>
      </View>
    );
  },
);

export function buildShareClipboardText(shareUrl: string, recipients: string[]) {
  if (!recipients.length) return shareUrl;
  return `${shareUrl}\n\nShared with:\n${recipients.map((item) => `• ${item}`).join('\n')}`;
}

export function dismissShareKeyboard() {
  Keyboard.dismiss();
}
