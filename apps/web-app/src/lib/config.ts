/**
 * Application configuration
 * Centralizes environment variables and constants
 */

export const config = {
  // API Configuration
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333',

  // Contact Emails
  emails: {
    support: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@tryfinanceagenthq.com',
    privacy: process.env.NEXT_PUBLIC_PRIVACY_EMAIL ?? 'privacy@tryfinanceagenthq.com',
    legal: process.env.NEXT_PUBLIC_LEGAL_EMAIL ?? 'legal@tryfinanceagenthq.com',
  },

  // Firebase Configuration
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
} as const;
