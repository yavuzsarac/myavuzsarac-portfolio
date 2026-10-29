export function readStorage(key, fallback, session = false) {
  try { return (session ? sessionStorage : localStorage).getItem(key) || fallback; }
  catch { return fallback; }
}
export function writeStorage(key, value, session = false) {
  try { (session ? sessionStorage : localStorage).setItem(key, value); } catch { /* Navigation still works without storage. */ }
}
