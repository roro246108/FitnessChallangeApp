export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

const ADMIN_EMAILS: ReadonlySet<string> = new Set([
  'abrar@admin.com',
]);

export const isAdminEmail = (email: string): boolean =>
  ADMIN_EMAILS.has(email.trim().toLowerCase());

export const INITIAL_MOCK_USERS: MockUser[] = [
  {
    id: 'user-1',
    name: 'Rawan',
    email: 'rawan@example.com',
    password: 'Test1234',
  },
  {
    id: 'admin-1',
    name: 'Abrar Admin',
    email: 'abrar@admin.com',
    password: 'abrar123',
  },
];

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};