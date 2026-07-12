const AUTH_USERS_KEY = 'mangaflow:users';
const AUTH_SESSION_KEY = 'mangaflow:session';

export function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers() {
  return readJson(AUTH_USERS_KEY, {});
}

export function saveUsers(users) {
  writeJson(AUTH_USERS_KEY, users);
}

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export async function hashPassword(password) {
  if (window.crypto?.subtle && window.TextEncoder) {
    const data = new TextEncoder().encode(`mangaflow:${password}`);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  }
  return `fallback:${[...String(password)].reverse().join('')}`;
}

export function getSession() {
  const fromLocal = readJson(AUTH_SESSION_KEY, null);
  if (fromLocal) return fromLocal;
  try {
    return JSON.parse(sessionStorage.getItem(AUTH_SESSION_KEY));
  } catch {
    return null;
  }
}

export function saveSession(user, remember = true) {
  const session = {
    email: user.email,
    username: user.username,
    provider: user.provider,
    signedInAt: new Date().toISOString(),
  };
  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  window.google?.accounts?.id?.disableAutoSelect();
}

export function decodeGoogleJwt(token) {
  const payload = token.split('.')[1];
  const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
  const paddedPayload = normalizedPayload.padEnd(normalizedPayload.length + (4 - normalizedPayload.length % 4) % 4, '=');
  const json = atob(paddedPayload);
  return JSON.parse(decodeURIComponent([...json].map(char => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`).join('')));
}

export async function registerUser({ username, email, password, passwordConfirm }) {
  if (!/^[\p{L}\p{N}]{3,20}$/u.test(username)) {
    throw new Error('Логин должен быть от 3 до 20 символов: только буквы и цифры.');
  }
  if (password !== passwordConfirm) {
    throw new Error('Пароли не совпадают.');
  }
  const normalized = normalizeEmail(email);
  const users = getUsers();
  if (users[normalized]) {
    throw new Error('Аккаунт с такой почтой уже существует. Попробуйте войти.');
  }
  const user = {
    username,
    email: normalized,
    passwordHash: await hashPassword(password),
    provider: 'email',
    createdAt: new Date().toISOString(),
  };
  users[normalized] = user;
  saveUsers(users);
  return user;
}

export async function loginUser({ email, password, remember }) {
  const normalized = normalizeEmail(email);
  const users = getUsers();
  const user = users[normalized];
  if (!user) throw new Error('Аккаунт с такой почтой не найден.');
  if (user.provider === 'google' && !user.passwordHash) {
    throw new Error('Этот аккаунт создан через Google. Нажмите кнопку Google ниже.');
  }
  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) throw new Error('Неверный пароль.');
  saveSession(user, remember);
  return user;
}

export function signInWithGoogleProfile(profile) {
  const email = normalizeEmail(profile.email);
  if (!email || !email.includes('@')) throw new Error('Google не вернул корректную почту.');
  if (profile.email_verified === false) throw new Error('Google не подтвердил эту почту.');

  const users = getUsers();
  const user = users[email] || {
    username: profile.name || profile.given_name || email.split('@')[0],
    email,
    provider: 'google',
    createdAt: new Date().toISOString(),
  };

  user.provider = user.provider || 'google';
  user.googleLinked = true;
  user.googleSub = profile.sub || user.googleSub;
  user.avatar = profile.picture || user.avatar;
  user.username = user.username || profile.name || profile.given_name || email.split('@')[0];
  users[email] = user;
  saveUsers(users);
  saveSession(user, true);
  return user;
}
