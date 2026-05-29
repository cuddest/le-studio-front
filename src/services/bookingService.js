// Frontend service to manage user bookings
import { getStoredToken } from './authStorage';
import { authenticatedFetch } from './apiClient';
const normalizeApiBase = (base) => {
  if (!base) return 'https://le-studio-api.onrender.com/api/v1';
  base = base.replace(/\/$/, '');
  if (!base.endsWith('/api/v1')) {
    base += '/api/v1';
  }
  return base;
};
const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE);

/**
 * Fetch the current user's bookings
 */
export async function listUserBookings() {
  if (!API_BASE) {
    throw new Error('API base URL not configured. Set VITE_API_BASE in .env');
  }

  const res = await authenticatedFetch(`${API_BASE}/users/me/bookings`, {
    method: 'GET',
  });

  if (res.status === 401) {
    throw new Error('Unauthorized. Please login again.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to load bookings (${res.status})`);
  }

  const payload = await res.json().catch(() => ({}));
  const list = payload.data || payload || [];

  return (list || []).map((b) => ({
    id: b.ID || b.id,
    userId: b.UserID || b.user_id,
    slotId: b.SlotID || b.slot_id,
    userPackId: b.UserPackID || b.user_pack_id,
    status: b.Status || b.status || 'confirmed',
    slotName: (b.slot?.name || b.Slot?.Name || b.slot?.Name || 'Session'),
    startTime: (b.slot?.start_time || b.Slot?.StartTime || b.slot?.StartTime || b.CreatedAt || b.created_at || ''),
    className: (b.slot?.name || b.Slot?.Name || b.slot?.Name || 'Unknown Class'),
    cancelledAt: b.CancelledAt || b.cancelled_at || null,
    createdAt: b.CreatedAt || b.created_at || '',
  }));
}

/**
 * Fetch a single booking by ID
 */
export async function getBooking(bookingId) {
  if (!API_BASE) {
    throw new Error('API base URL not configured. Set VITE_API_BASE in .env');
  }

  const res = await authenticatedFetch(`${API_BASE}/bookings/${bookingId}`, {
    method: 'GET',
  });

  if (res.status === 401) {
    throw new Error('Unauthorized. Please login again.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to load booking (${res.status})`);
  }

  const payload = await res.json().catch(() => ({}));
  const b = payload.data || payload;

  return {
    id: b.ID || b.id,
    userId: b.UserID || b.user_id,
    slotId: b.SlotID || b.slot_id,
    userPackId: b.UserPackID || b.user_pack_id,
    status: b.Status || b.status || 'confirmed',
    slotName: (b.slot?.name || b.Slot?.Name || b.slot?.Name || 'Session'),
    startTime: (b.slot?.start_time || b.Slot?.StartTime || b.slot?.StartTime || b.CreatedAt || b.created_at || ''),
    cancelledAt: b.CancelledAt || b.cancelled_at || null,
    createdAt: b.CreatedAt || b.created_at || '',
  };
}

/**
 * Create a new booking for the current user
 * @param {uint} slotId - The slot ID to book
 * @param {uint} userPackId - The user pack ID to use for this booking
 */
export async function createBooking(slotId, userPackId) {
  if (!API_BASE) {
    throw new Error('API base URL not configured. Set VITE_API_BASE in .env');
  }

  const res = await authenticatedFetch(`${API_BASE}/bookings`, {
    method: 'POST',
    body: JSON.stringify({
      slot_id: slotId,
      user_pack_id: userPackId,
    }),
  });

  if (res.status === 401) {
    throw new Error('Unauthorized. Please login again.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Booking failed (${res.status}). ${err?.error?.details || ''}`);
  }

  const payload = await res.json().catch(() => ({}));
  const b = payload.data || payload;

  return {
    id: b.ID || b.id,
    userId: b.UserID || b.user_id,
    slotId: b.SlotID || b.slot_id,
    userPackId: b.UserPackID || b.user_pack_id,
    status: b.Status || b.status || 'confirmed',
    slotName: (b.slot?.name || b.Slot?.Name || b.slot?.Name || 'Session'),
    startTime: (b.slot?.start_time || b.Slot?.StartTime || b.slot?.StartTime || b.CreatedAt || b.created_at || ''),
    createdAt: b.CreatedAt || b.created_at || '',
  };
}

/**
 * Cancel an existing booking
 * @param {uint} bookingId - The booking ID to cancel
 */
export async function cancelBooking(bookingId) {
  if (!API_BASE) {
    throw new Error('API base URL not configured. Set VITE_API_BASE in .env');
  }

  const res = await authenticatedFetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
    method: 'PATCH',
  });

  if (res.status === 401) {
    throw new Error('Unauthorized. Please login again.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Cancel booking failed (${res.status})`);
  }

  const payload = await res.json().catch(() => ({}));
  const b = payload.data || payload;

  return {
    id: b.ID || b.id,
    status: b.Status || b.status || 'cancelled',
    cancelledAt: b.CancelledAt || b.cancelled_at || null,
  };
}
