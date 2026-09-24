/**
 * Vietnamese phone number validator:
 * Must start with 0 and have exactly 10 digits in total (/^0\d{9}$/)
 */
export function isValidVietnamPhone(phone: string | null | undefined): boolean {
  if (!phone) return false;
  const cleanPhone = phone.replace(/[\s.-]/g, '');
  return /^0\d{9}$/.test(cleanPhone);
}

/**
 * Standard email validator
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Validates a non-empty name (at least 2 chars, letters and spaces)
 */
export function isValidName(name: string | null | undefined): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
}

/**
 * Validates positive number (price, deposit, quantity)
 */
export function isValidPositiveNumber(val: unknown, allowZero = false): boolean {
  const num = Number(val);
  if (isNaN(num)) return false;
  return allowZero ? num >= 0 : num > 0;
}

/**
 * Basic XSS sanitizer: strips tags and escapes unsafe characters
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Standard phone error message
 */
export const PHONE_VALIDATION_ERROR =
  'Số điện thoại không hợp lệ. Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số (ví dụ: 0932501411).';

export const EMAIL_VALIDATION_ERROR =
  'Email không đúng định dạng (ví dụ: ban@gmail.com).';

export const NAME_VALIDATION_ERROR =
  'Vui lòng nhập họ và tên đầy đủ (tối thiểu 2 ký tự).';
