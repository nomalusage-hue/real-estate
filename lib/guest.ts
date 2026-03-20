// lib/guest.ts
export const getCurrentGuestId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('guest_id');
};