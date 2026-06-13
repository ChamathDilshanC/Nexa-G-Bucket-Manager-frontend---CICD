import { useRouter } from 'expo-router';
import { useState } from 'react';

import { AuthButton } from '@/components/auth/auth-button';
import { AuthFooterLink } from '@/components/auth/auth-footer-link';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthScreenLayout } from '@/components/auth/auth-screen-layout';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthScreenLayout
      title="Sign In"
      subtitle="Welcome back. Enter your credentials to access your buckets."
      footer={
        <AuthFooterLink
          text="Don't have an account?"
          linkText="Register"
          onPress={() => router.replace('/register')}
        />
      }>
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
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <AuthButton label="Sign In" onPress={() => router.replace('/(tabs)/explore')} />
    </AuthScreenLayout>
  );
}
