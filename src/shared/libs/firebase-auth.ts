import * as fs from 'fs';
import admin from 'firebase-admin';

const SERVICE_ACCOUNT_PATH = './resource/serviceAccountKey.json';
const DEMO_TOKEN_PREFIX = 'demo-';

let firebaseEnabled = false;

/**
 * Initialises Firebase if the service-account key is present.
 * Without the key (and outside production) the app runs in DEMO MODE:
 * Firebase ID tokens are replaced by fake tokens of the form `demo-<id>`.
 */
export function initFirebase(): void {
  if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    admin.initializeApp({
      credential: admin.credential.cert(SERVICE_ACCOUNT_PATH),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    firebaseEnabled = true;
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Firebase key not found at ${SERVICE_ACCOUNT_PATH}`);
  }

  // eslint-disable-next-line no-console
  console.warn(
    `\n⚠️  ${SERVICE_ACCOUNT_PATH} not found — running in DEMO MODE.\n` +
      `   Send "Authorization: Bearer demo-<id>" instead of a Firebase ID token,\n` +
      `   e.g. "demo-9876543210" (phone login) or "demo-admin" (admin login).\n` +
      `   Firebase Storage uploads are unavailable in this mode.\n`,
  );
}

export function isFirebaseEnabled(): boolean {
  return firebaseEnabled;
}

/** Drop-in replacement for admin.auth().verifyIdToken(). */
export async function verifyFirebaseToken(
  token: string,
): Promise<admin.auth.DecodedIdToken> {
  if (firebaseEnabled) {
    return admin.auth().verifyIdToken(token);
  }

  if (!token.startsWith(DEMO_TOKEN_PREFIX) || token.length <= DEMO_TOKEN_PREFIX.length) {
    throw new Error('Demo mode: token must look like demo-<id>');
  }

  const id = token.slice(DEMO_TOKEN_PREFIX.length);
  const digits = id.replace(/\D/g, '');
  const phone = digits.length >= 6 ? `+91${digits.slice(-10)}` : `+910000${hashDigits(id)}`;

  return {
    uid: token,
    email: `${id}@demo.local`,
    phone_number: phone,
    name: `Demo ${id}`,
  } as unknown as admin.auth.DecodedIdToken;
}

function hashDigits(value: string): string {
  let h = 0;
  for (const c of value) h = (h * 31 + c.charCodeAt(0)) % 1_000_000;
  return String(h).padStart(6, '0');
}
