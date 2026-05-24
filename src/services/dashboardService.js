const API_BASE = import.meta.env.VITE_API_BASE || '';

function toBookingItem(b) {
  return {
    id: b.ID || b.id || b.booking_id || String(Math.random()),
    className: b.ClassName || b.SlotName || b.TrainingTypeName || (b.TrainingType && (b.TrainingType.Name || b.TrainingType.Title)) || 'Class',
    date: b.StartTime || b.Date || b.start_time || b.created_at || '',
    time: b.StartTime ? new Date(b.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    coach: b.CoachName || (b.Coach && `${b.Coach.FirstName || ''} ${b.Coach.LastName || ''}`) || '',
    status: b.Status || b.status || 'Scheduled',
  };
}

export async function getDashboard(token) {
  if (!API_BASE) throw new Error('VITE_API_BASE not configured');

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // fetch profile (for reward points) and bookings
  const [uRes, bRes] = await Promise.all([
    fetch(`${API_BASE}/users/me`, { headers }),
    fetch(`${API_BASE}/bookings`, { headers }),
  ].map((p) => p.catch((e) => null)));

  let rewardPoints = 0;
  if (uRes && uRes.ok) {
    const uj = await uRes.json().catch(() => ({}));
    const user = uj.data || uj;
    rewardPoints = user?.RewardPoints || user?.reward_points || 0;
  }

  let upcoming = [];
  let history = [];
  if (bRes && bRes.ok) {
    const bj = await bRes.json().catch(() => ({}));
    const bookings = bj.data || bj || [];
    const now = Date.now();
    const mapped = (bookings || []).map(toBookingItem);
    mapped.forEach((it, idx) => {
      const raw = bookings[idx] || {};
      const start = new Date(raw.StartTime || raw.start_time || raw.Date || raw.date || raw.created_at || null).getTime();
      if (!isNaN(start) && start > now) upcoming.push(it);
      else history.push(it);
    });
  }

  return {
    rewardPoints,
    upcomingBookings: upcoming,
    bookingHistory: history,
  };
}
