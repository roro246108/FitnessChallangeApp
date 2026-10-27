import { useState } from 'react';

import {
  INITIAL_MOCK_USERS,
  isAdminEmail,
  validateEmail,
  validatePassword,
} from '../models/AuthModel';

import type { MockUser } from '../models/AuthModel';

export type AuthScreen = 'Onboarding' | 'Login' | 'Register' | 'Home';

export interface AuthResult {
  success: boolean;
  message: string;
  identity?: {
    name: string;
    email: string;
    isAdmin: boolean;
  };
}

export default function useAuthViewModel() {
  const [authScreen, setAuthScreen] =
    useState<AuthScreen>('Onboarding');

  const [users, setUsers] = useState<MockUser[]>(INITIAL_MOCK_USERS);

  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);

  const showLogin = () => setAuthScreen('Login');

  const showRegister = () => setAuthScreen('Register');

  const showOnboarding = () => setAuthScreen('Onboarding');

  const login = (email: string, password: string): AuthResult => {
    if (!email.trim() || !password) {
      return {
        success: false,
        message: 'Please enter your email and password.',
      };
    }

    if (!validateEmail(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
      };
    }

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!user) {
      return {
        success: false,
        message: 'Incorrect email or password. Try the demo account.',
      };
    }

    setCurrentUser(user);
    setAuthScreen('Home');

    return {
      success: true,
      message: 'Welcome back!',
      identity: {
        name: user.name,
        email: user.email,
        isAdmin: isAdminEmail(user.email),
      },
    };
  };

  const register = (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): AuthResult => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      return {
        success: false,
        message: 'Please fill in all fields.',
      };
    }

    if (!validateEmail(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
      };
    }

    if (!validatePassword(password)) {
      return {
        success: false,
        message: 'Password must be at least 6 characters.',
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match.',
      };
    }

    const alreadyExists = users.some(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (alreadyExists) {
      return {
        success: false,
        message: 'This email is already registered. Please log in.',
      };
    }

    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      password,
    };

    setUsers((current) => [...current, newUser]);
    setCurrentUser(newUser);
    setAuthScreen('Home');

    return {
      success: true,
      message: 'Account created successfully!',
      identity: {
        name: newUser.name,
        email: newUser.email,
        isAdmin: isAdminEmail(newUser.email),
      },
    };
  };

  const forgotPassword = (): string => {
    return 'Password recovery is not available in mock demo mode.';
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthScreen('Login');
  };

  return {
    authScreen,
    setAuthScreen,
    showLogin,
    showRegister,
    showOnboarding,
    login,
    register,
    forgotPassword,
    logout,
    currentUser,
  };
}