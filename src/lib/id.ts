/**
 * Generate a primary-key string. Uses Web Crypto's randomUUID which is
 * available in modern Node and all evergreen browsers.
 */
export function generateId(): string {
  return crypto.randomUUID();
}
