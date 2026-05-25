import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const SCRYPT_KEYLEN = 64;
const SCRYPT_SALT_BYTES = 16;
const PREFIX = "scrypt:";

export function hashPassword(password: string): string {
  const salt = randomBytes(SCRYPT_SALT_BYTES);
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN);
  return `${PREFIX}${salt.toString("base64")}:${derived.toString("base64")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored) return false;
  if (!stored.startsWith(PREFIX)) return stored === password;

  const raw = stored.slice(PREFIX.length);
  const [saltB64, derivedB64] = raw.split(":");
  if (!saltB64 || !derivedB64) return false;

  const salt = Buffer.from(saltB64, "base64");
  const expected = Buffer.from(derivedB64, "base64");
  const actual = scryptSync(password, salt, expected.length);

  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

