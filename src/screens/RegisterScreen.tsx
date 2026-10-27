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

interface RegisterScreenProps {
  onRegister: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => AuthResult;
  onLogin: () => void;
}

export default function RegisterScreen({
  onRegister,
  onLogin,
}: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState('');
  const [messageIsError, setMessageIsError] = useState(true);

  const handleRegister = () => {
    if (!acceptedTerms) {
      setMessage('Please agree to the Terms & Privacy Policy.');
      setMessageIsError(true);
      return;
    }

    const result = onRegister(
      name,
      email,
      password,
      confirmPassword
    );

    setMessage(result.message);
    setMessageIsError(!result.success);
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
            Create{' '}
            <Text style={styles.purple}>Account</Text>
          </Text>

          <Text style={styles.subtitle}>
            Start your stronger, healthier journey.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor="#9991B0"
            style={styles.input}
            autoCapitalize="words"
            textContentType="name"
          />

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
              placeholder="At least 6 characters"
              placeholderTextColor="#9991B0"
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              textContentType="newPassword"
            />

            <TouchableOpacity
              onPress={() => setShowPassword((current) => !current)}
            >
              <Text style={styles.showPassword}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter your password"
              placeholderTextColor="#9991B0"
              style={styles.passwordInput}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              textContentType="newPassword"
            />

            <TouchableOpacity
              onPress={() =>
                setShowConfirmPassword((current) => !current)
              }
            >
              <Text style={styles.showPassword}>
                {showConfirmPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.termsRow}
            activeOpacity={0.8}
            onPress={() => setAcceptedTerms((current) => !current)}
          >
            <View
              style={[
                styles.checkbox,
                acceptedTerms && styles.checkboxChecked,
              ]}
            >
              {acceptedTerms && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>

            <Text style={styles.termsText}>
              I agree to the Terms & Privacy Policy
            </Text>
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
            onPress={handleRegister}
          >
            <Text style={styles.primaryButtonText}>
              Create Account
            </Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() =>
              setMessage('Google sign-up is not available in demo mode.')
            }
          >
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleText}>Sign up with Google</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
            </Text>

            <TouchableOpacity onPress={onLogin}>
              <Text style={styles.footerLink}>Log In</Text>
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
    paddingTop: 55,
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
    marginTop: 35,
    marginBottom: 22,
  },

  title: {
    color: '#171326',
    fontSize: 35,
    fontWeight: '900',
  },

  purple: {
    color: '#6F4BF2',
  },

  subtitle: {
    color: '#625B7D',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  form: {
    width: '100%',
  },

  label: {
    color: '#302849',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#D9D2F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    color: '#171326',
    backgroundColor: 'rgba(255,255,255,0.92)',
    fontSize: 13,
  },

  passwordContainer: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#D9D2F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },

  passwordInput: {
    flex: 1,
    color: '#171326',
    fontSize: 13,
    paddingVertical: 12,
  },

  showPassword: {
    color: '#6F4BF2',
    fontSize: 11,
    fontWeight: '700',
    paddingLeft: 8,
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 14,
    gap: 10,
  },

  checkbox: {
    width: 21,
    height: 21,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#A38DF2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: '#6F4BF2',
    borderColor: '#6F4BF2',
  },

  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  termsText: {
    flex: 1,
    color: '#625B7D',
    fontSize: 11,
  },

  message: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },

  primaryButton: {
    backgroundColor: '#CDFF7E',
    borderRadius: 28,
    minHeight: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 5,
  },

  primaryButtonText: {
    color: '#171326',
    fontSize: 15,
    fontWeight: '800',
  },

  arrow: {
    color: '#171326',
    fontSize: 21,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 20,
  },

  divider: {
    height: 1,
    backgroundColor: '#D9D2F0',
    flex: 1,
  },

  dividerText: {
    color: '#625B7D',
    fontSize: 11,
  },

  googleButton: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#D9D2F0',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
  },

  googleG: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4285F4',
  },

  googleText: {
    color: '#171326',
    fontSize: 12,
    fontWeight: '700',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },

  footerText: {
    color: '#625B7D',
    fontSize: 11,
  },

  footerLink: {
    color: '#6F4BF2',
    fontSize: 12,
    fontWeight: '800',
  },
});