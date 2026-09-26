import 'server-only';

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export const DEFAULT_BOOKING_EMAIL = 'hieuthien2k2@gmail.com';

export interface BookingEmailSettingsRow {
  sender_email: string;
  app_password_encrypted: string;
}

function getEncryptionKey() {
  const secret = process.env.BOOKING_EMAIL_CREDENTIALS_KEY;
  if (!secret) throw new Error('Booking email encryption is not configured.');
  return createHash('sha256').update(secret).digest();
}

export function encryptBookingEmailPassword(password: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(password, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString('base64url')).join('.');
}

export function decryptBookingEmailPassword(encrypted: string) {
  const [encodedIv, encodedTag, encodedCiphertext, ...unexpectedParts] = encrypted.split('.');
  if (!encodedIv || !encodedTag || !encodedCiphertext || unexpectedParts.length) {
    throw new Error('Stored booking email credentials are invalid.');
  }

  const decipher = createDecipheriv('aes-256-gcm', getEncryptionKey(), Buffer.from(encodedIv, 'base64url'));
  decipher.setAuthTag(Buffer.from(encodedTag, 'base64url'));
  return Buffer.concat([
    decipher.update(Buffer.from(encodedCiphertext, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
}

export async function readBookingEmailSettingsRow() {
  const { data, error } = await createAdminClient()
    .from('booking_email_settings')
    .select('sender_email,app_password_encrypted')
    .eq('id', 'global')
    .maybeSingle();

  if (error) throw new Error('Unable to load booking email settings.');
  return data as BookingEmailSettingsRow | null;
}

export async function getBookingEmailConfiguration() {
  const row = await readBookingEmailSettingsRow();
  return {
    senderEmail: row?.sender_email ?? DEFAULT_BOOKING_EMAIL,
    appPassword: row
      ? decryptBookingEmailPassword(row.app_password_encrypted)
      : process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '') ?? '',
  };
}

export async function getAdminBookingEmailSettings() {
  const row = await readBookingEmailSettingsRow();
  return {
    senderEmail: row?.sender_email ?? DEFAULT_BOOKING_EMAIL,
    hasPassword: Boolean(row?.app_password_encrypted || process.env.GMAIL_APP_PASSWORD?.trim()),
  };
}

export function isValidBookingEmailAddress(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizeBookingEmailPassword(password: string) {
  return password.replace(/\s+/g, '');
}

export async function saveBookingEmailSettings(senderEmail: string, encryptedPassword: string) {
  const { error } = await createAdminClient()
    .from('booking_email_settings')
    .upsert({
      id: 'global',
      sender_email: senderEmail,
      app_password_encrypted: encryptedPassword,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) throw new Error('Unable to save booking email settings.');
}
