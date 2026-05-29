// Frontend service to manage user bookings
import { getStoredToken } from './authStorage';
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

  const res = await fetch(`${API_BASE}/users/me/bookings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getStoredToken() || ''}`,
    },
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
    slotName: b.Slot?.Name || b.slot?.name || 'Session',
    startTime: b.Slot?.StartTime || b.slot?.start_time || '',
    className: b.Slot?.Name || b.slot?.name || 'Unknown Class',
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

  const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getStoredToken() || ''}`,
    },
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
    slotName: b.Slot?.Name || b.slot?.name || 'Session',
    startTime: b.Slot?.StartTime || b.slot?.start_time || '',
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

  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getStoredToken() || ''}`,
    },
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
    slotName: b.Slot?.Name || b.slot?.name || 'Session',
    startTime: b.Slot?.StartTime || b.slot?.start_time || '',
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

  const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getStoredToken() || ''}`,
    },
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
