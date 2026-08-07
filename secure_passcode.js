async function hashMessage(message) {
  // Encode the string text into a byte array
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  // Compute the native hash using Web Crypto API
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert the ArrayBuffer to a readable Hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

// Browser-only: uses the Web Crypto API (window.crypto.subtle).
// Requires a secure context (https:// or localhost) — SubtleCrypto is
// unavailable on plain http:// origins.

function toBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derives an AES-256-GCM CryptoKey from an arbitrary-length secret string
 * by hashing it with SHA-256 (which conveniently produces 32 bytes — the
 * exact key length AES-256 needs).
 */
async function deriveKey(secret) {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(secret),
  );
  return crypto.subtle.importKey("raw", hash, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

/**
 * Encrypts `payload` (a string) with AES-256-GCM, key derived from `secret`.
 * Returns a single base64 string: iv (12 bytes) + ciphertext+authTag.
 * (SubtleCrypto appends the GCM auth tag to the ciphertext automatically.)
 */
async function encrypt(payload, secret) {
  const key = await deriveKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV, required size for GCM
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(payload),
  );

  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return toBase64(combined);
}

/**
 * Decrypts a base64 string produced by `encrypt`, re-deriving the key from `secret`.
 * Throws if the secret is wrong or the data was tampered with — GCM's auth tag
 * check fails loudly rather than returning garbage.
 */
async function decrypt(encoded, secret) {
  const key = await deriveKey(secret);
  const combined = fromBase64(encoded);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  ); // throws DOMException 'OperationError' if wrong key / tampered

  return new TextDecoder().decode(plaintext);
}