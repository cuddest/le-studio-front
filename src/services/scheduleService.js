// Frontend service to fetch schedules and available slots
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
 * Fetch all available schedules
 */
export async function listSchedules(options = {}) {
  if (!API_BASE) {
    throw new Error('API base URL not configured. Set VITE_API_BASE in .env');
  }

  const params = new URLSearchParams();
  if (options.includeUnpublished) {
    params.set('include_unpublished', 'true');
  }
  // Force fresh data from server, bypass cache
  params.set('_t', Date.now());

  const url = params.toString() ? `${API_BASE}/schedules?${params.toString()}` : `${API_BASE}/schedules`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to load schedules (${res.status})`);
  }

  const payload = await res.json().catch(() => ({}));
  const list = payload.data || payload || [];

  return (list || []).map((s) => ({
    id: s.ID || s.id,
    title: s.Title || s.title || 'Schedule',
    weekStart: s.WeekStart || s.week_start || '',
    weekEnd: s.WeekEnd || s.week_end || '',
    publishedAt: s.PublishedAt || s.published_at || '',
    isPublished: s.IsPublished || s.is_published || false,
    createdAt: s.CreatedAt || s.created_at || '',
    updatedAt: s.UpdatedAt || s.updated_at || '',
  }));
}

/**
 * Fetch slots for a specific schedule
 * @param {uint} scheduleId - The schedule ID
 */
export async function listSlotsBySchedule(scheduleId, options = {}) {
  if (!API_BASE) {
    throw new Error('API base URL not configured. Set VITE_API_BASE in .env');
  }

  const params = new URLSearchParams();
  if (options.includeCancelled) {
    params.set('include_cancelled', 'true');
  }
  // Force fresh data from server, bypass cache
  params.set('_t', Date.now());

  const url = params.toString()
    ? `${API_BASE}/schedules/${scheduleId}/slots?${params.toString()}`
    : `${API_BASE}/schedules/${scheduleId}/slots`;

  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to load slots (${res.status})`);
  }

  const payload = await res.json().catch(() => ({}));
  const list = payload.data || payload || [];

  return (list || []).map((s) => ({
    id: s.ID || s.id,
    scheduleId: s.ScheduleID || s.schedule_id || scheduleId,
    name: s.Name || s.name || 'Session',
    startTime: s.StartTime || s.start_time || '',
    endTime: s.EndTime || s.end_time || '',
    date: s.Date || s.date || '',
    dayOfWeek: s.DayOfWeek || s.day_of_week,
    level: s.Level || s.level || '',
    capacity: s.Capacity || s.capacity || 0,
    bookedCount: s.BookedCount || s.booked_count || 0,
    trainingTypeId: s.TrainingTypeID || s.training_type_id,
    trainingTypeName: s.TrainingType?.Name || s.training_type?.name || 'Unknown',
    coachId: s.CoachID || s.coach_id,
    coachName: s.coach
      ? `${s.coach.first_name || ''} ${s.coach.last_name || ''}`.trim() || 'TBA'
      : 'TBA',
    slotType: s.SlotType || s.slot_type || 'mixte', // 'mixte', 'women_only', 'men_only'
    isCancelled: s.IsCancelled || s.is_cancelled || false,
    createdAt: s.CreatedAt || s.created_at || '',
    updatedAt: s.UpdatedAt || s.updated_at || '',
  }));
}

/**
 * Get all available slots across all schedules (for discovery)
 */
export async function listAllAvailableSlots() {
  try {
    const schedules = await listSchedules();
    const allSlots = [];

    for (const schedule of schedules) {
      if (!schedule.isPublished) continue; // Only show published schedules
      try {
        const slots = await listSlotsBySchedule(schedule.id);
        allSlots.push(...slots.map((slot) => ({ ...slot, scheduleName: schedule.title })));
      } catch {
        // Skip if schedule has no slots or error fetching
      }
    }

    return allSlots;
  } catch (err) {
    throw new Error(err.message || 'Failed to load available slots');
  }
}
