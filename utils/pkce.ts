export async function generateCodeVerifier(): Promise<string> {
  const array = new Uint8Array(64);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i++) array[i] = Math.floor(Math.random() * 256);
  }
  return base64UrlEncode(array);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  let digest: ArrayBuffer;
  if (typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest) {
    digest = await crypto.subtle.digest("SHA-256", data);
  } else {
    // Fallback: simple hash substitute (not cryptographically secure)
    let hash = 0;
    for (let i = 0; i < verifier.length; i++) hash = (hash << 5) - hash + verifier.charCodeAt(i);
    const buf = new ArrayBuffer(4);
    new DataView(buf).setInt32(0, hash);
    digest = buf;
  }
  const bytes = new Uint8Array(digest);
  return base64UrlEncode(bytes);
}

export async function createPkcePair(): Promise<{ verifier: string; challenge: string }> {
  const verifier = await generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  return { verifier, challenge };
}

function base64UrlEncode(input: Uint8Array): string {
  let str = "";
  for (let i = 0; i < input.byteLength; i++) str += String.fromCharCode(input[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}