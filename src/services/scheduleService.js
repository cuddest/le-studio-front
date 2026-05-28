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
export async function listSchedules() {
  if (!API_BASE) {
    throw new Error('API base URL not configured. Set VITE_API_BASE in .env');
  }

  const res = await fetch(`${API_BASE}/schedules`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to load schedules (${res.status})`);
  }

  const payload = await res.json().catch(() => ({}));
  const list = payload.data || payload || [];

  return (list || []).map((s) => ({
    id: s.ID || s.id,
    title: s.Title || s.title || 'Schedule',
    description: s.Description || s.description || '',
    startDate: s.StartDate || s.start_date || '',
    endDate: s.EndDate || s.end_date || '',
    isPublished: s.IsPublished || s.is_published || false,
    createdAt: s.CreatedAt || s.created_at || '',
  }));
}

/**
 * Fetch slots for a specific schedule
 * @param {uint} scheduleId - The schedule ID
 */
export async function listSlotsBySchedule(scheduleId) {
  if (!API_BASE) {
    throw new Error('API base URL not configured. Set VITE_API_BASE in .env');
  }

  const res = await fetch(`${API_BASE}/schedules/${scheduleId}/slots`);

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
    capacity: s.Capacity || s.capacity || 0,
    bookedCount: s.BookedCount || s.booked_count || 0,
    trainingTypeId: s.TrainingTypeID || s.training_type_id,
    trainingTypeName: s.TrainingType?.Name || s.training_type?.name || 'Unknown',
    slotType: s.SlotType || s.slot_type || 'mixte', // 'mixte', 'women_only', 'men_only'
    isCancelled: s.IsCancelled || s.is_cancelled || false,
    createdAt: s.CreatedAt || s.created_at || '',
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
