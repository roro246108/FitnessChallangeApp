import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';

import type { AuthResult } from '../viewmodels/AuthViewModel';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => AuthResult;
  onRegister: () => void;
  onForgotPassword: () => string;
}

export default function LoginScreen({
  onLogin,
  onRegister,
  onForgotPassword,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageIsError, setMessageIsError] = useState(true);

  const handleLogin = () => {
    const result = onLogin(email, password);

    setMessage(result.message);
    setMessageIsError(!result.success);
  };

  const handleForgotPassword = () => {
    setMessage(onForgotPassword());
    setMessageIsError(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brand}>
          <Text style={styles.brandMark}>M</Text>
          <Text style={styles.brandText}>MOVEWELL</Text>
        </View>

        <View style={styles.intro}>
          <Text style={styles.title}>
            Welcome{' '}
            <Text style={styles.purple}>Back</Text>
          </Text>
          <Text style={styles.subtitle}>
            Your next level starts here.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#9991B0"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#9991B0"
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              textContentType="password"
            />

            <TouchableOpacity
              onPress={() => setShowPassword((current) => !current)}
              accessibilityLabel={
                showPassword ? 'Hide password' : 'Show password'
              }
            >
              <Text style={styles.showPassword}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {message ? (
            <Text
              style={[
                styles.message,
                { color: messageIsError ? '#D9435F' : '#36834A' },
              ]}
            >
              {message}
            </Text>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.primaryButton}
            onPress={handleLogin}
          >
            <Text style={styles.primaryButtonText}>Log In</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() =>
              setMessage('Google sign-in is not available in demo mode.')
            }
          >
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don&apos;t have an account?{' '}
            </Text>
            <TouchableOpacity onPress={onRegister}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

         
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6FF',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 65,
    paddingBottom: 30,
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  brandMark: {
    color: '#6F4BF2',
    fontSize: 31,
    fontWeight: '900',
  },

  brandText: {
    color: '#171326',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },

  intro: {
    marginTop: 55,
    marginBottom: 30,
  },

  title: {
    color: '#171326',
    fontSize: 39,
    fontWeight: '900',
  },

  purple: {
    color: '#6F4BF2',
  },

  subtitle: {
    color: '#625B7D',
    fontSize: 15,
    marginTop: 8,
  },

  form: {
    width: '100%',
  },

  label: {
    color: '#302849',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 15,
  },

  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#D9D2F0',
    borderRadius: 15,
    paddingHorizontal: 16,
    color: '#171326',
    backgroundColor: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },

  passwordContainer: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#D9D2F0',
    borderRadius: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },

  passwordInput: {
    flex: 1,
    color: '#171326',
    fontSize: 14,
    paddingVertical: 14,
  },

  showPassword: {
    color: '#6F4BF2',
    fontSize: 12,
    fontWeight: '700',
    paddingLeft: 8,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    paddingVertical: 15,
  },

  forgotText: {
    color: '#6F4BF2',
    fontWeight: '700',
    fontSize: 12,
  },

  message: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },

  primaryButton: {
    backgroundColor: '#CDFF7E',
    borderRadius: 28,
    minHeight: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
  },

  primaryButtonText: {
    color: '#171326',
    fontSize: 16,
    fontWeight: '800',
  },

  arrow: {
    color: '#171326',
    fontSize: 22,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 25,
  },

  divider: {
    height: 1,
    backgroundColor: '#D9D2F0',
    flex: 1,
  },

  dividerText: {
    color: '#625B7D',
    fontSize: 12,
  },

  googleButton: {
    minHeight: 53,
    borderWidth: 1,
    borderColor: '#D9D2F0',
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
  },

  googleG: {
    fontSize: 21,
    fontWeight: '900',
    color: '#4285F4',
  },

  googleText: {
    color: '#171326',
    fontSize: 13,
    fontWeight: '700',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },

  footerText: {
    color: '#625B7D',
    fontSize: 12,
  },

  footerLink: {
    color: '#6F4BF2',
    fontSize: 12,
    fontWeight: '800',
  },

  demoBox: {
    backgroundColor: '#ECE6FF',
    padding: 12,
    borderRadius: 12,
    marginTop: 24,
  },

  demoTitle: {
    color: '#6F4BF2',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 5,
  },

  demoText: {
    color: '#625B7D',
    fontSize: 11,
    marginTop: 3,
  },
});