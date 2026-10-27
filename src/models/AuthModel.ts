export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const INITIAL_MOCK_USERS: MockUser[] = [
  {
    id: 'user-1',
    name: 'Rawan',
    email: 'rawan@example.com',
    password: 'Test1234',
  },
];

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};