import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthFooterLink } from '@/components/auth/auth-footer-link';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthScreenLayout } from '@/components/auth/auth-screen-layout';

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthScreenLayout
      title="Create Account"
      subtitle="Enter your personal data to create your Nexa G-Bucket account."
      footer={
        <AuthFooterLink
          text="Already have an account?"
          linkText="Sign In"
          onPress={() => router.replace('/login')}
        />
      }>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <AuthInput
            label="First Name"
            placeholder="eg. John"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View className="flex-1">
          <AuthInput
            label="Last Name"
            placeholder="eg. Francisco"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
      </View>
      <AuthInput
        label="Email"
        placeholder="eg. john@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <AuthInput
        label="Password"
        placeholder="Create a password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <AuthButton label="Register" onPress={() => router.replace('/(tabs)/explore')} />
    </AuthScreenLayout>
  );
}
