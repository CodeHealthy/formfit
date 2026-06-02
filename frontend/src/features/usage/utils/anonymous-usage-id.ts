const ANONYMOUS_USAGE_ID_KEY = 'formfit_anonymous_usage_id';

export function getAnonymousUsageId() {
  if (typeof window === 'undefined') {
    return '';
  }

  const existingId = window.localStorage.getItem(ANONYMOUS_USAGE_ID_KEY);

  if (existingId) {
    return existingId;
  }

  const newId =
    typeof window.crypto?.randomUUID === 'function'
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(ANONYMOUS_USAGE_ID_KEY, newId);

  return newId;
}
