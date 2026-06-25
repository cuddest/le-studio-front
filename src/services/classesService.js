import { listSchedules, listSlotsBySchedule } from './scheduleService';

/**
 * Converts API slot data to frontend format
 */
function formatSlot(slot, coach) {
  const startTime = new Date(slot.startTime || slot.start_time || slot.date || slot.createdAt);
  const endTime = new Date(slot.endTime || slot.end_time || slot.startTime || slot.start_time || slot.date || slot.createdAt);
  const duration = Math.round((endTime - startTime) / 60000);
  
  return {
    id: `slot-${slot.id}`,
    title: slot.name,
    discipline: slot.trainingTypeName || slot.training_type?.name || 'Training',
    duration: `${Number.isFinite(duration) && duration > 0 ? duration : 0} min`,
    coach: coach?.name || slot.coachName || 'TBA',
    price: '2000', // Default price, adjust based on business logic
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=700&h=450&fit=crop&q=80',
    description: `${slot.trainingTypeName || slot.training_type?.name || 'Training'} session at ${Number.isNaN(startTime.getTime()) ? 'TBA' : startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`,
    slotId: slot.id,
    date: slot.date || '',
    startTime: slot.startTime || slot.start_time || '',
    endTime: slot.endTime || slot.end_time || '',
    dayOfWeek: slot.dayOfWeek,
    level: slot.level || 'All Levels',
    slotType: slot.slotType || 'mixte',
    capacity: slot.capacity,
    bookedCount: slot.bookedCount || slot.booked_count || 0,
    isCancelled: Boolean(slot.isCancelled || slot.is_cancelled),
  };
}

/**
 * Fetches and groups all classes by level
 * Returns data in classCatalogByLevel format
 */
export async function fetchClassCatalog() {
  try {
    const schedules = (await listSchedules()).filter((s) => s.isPublished);

    // Build a map of all slots
    const allSlots = [];

    for (const schedule of schedules) {
      const scheduleId = schedule?.id || schedule?.ID;
      if (!scheduleId) {
        continue;
      }
      try {
        const slots = await listSlotsBySchedule(scheduleId, { includeCancelled: true });
        allSlots.push(...slots);
      } catch (error) {
        console.warn(`Failed to fetch slots for schedule ${scheduleId}:`, error);
      }
    }
    
    // Group slots by level
    const groupedByLevel = {};
    
    allSlots.forEach(slot => {
      const level = slot.level || 'All Levels';
      if (!groupedByLevel[level]) {
        groupedByLevel[level] = [];
      }
      
      const coach = slot.coach || {};
      const formatted = formatSlot(slot, coach);
      groupedByLevel[level].push(formatted);
    });
    
    // Define level order with intros
    const levelIntros = {
      'Beginner': 'Start with structure, breath cues, and low-impact progressions that build strong foundations.',
      'Intermediate': 'Progressive sessions designed to deepen control, endurance, and full-body integration.',
      'Advanced': 'High-intensity formats for experienced members seeking precision under fatigue and performance gains.',
      'All Levels': 'Classes designed for everyone, regardless of experience level.',
    };
    
    const levelOrder = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
    
    // Convert to classCatalogByLevel format
    const catalog = levelOrder
      .filter(level => groupedByLevel[level] && groupedByLevel[level].length > 0)
      .map(level => ({
        level,
        intro: levelIntros[level],
        offers: groupedByLevel[level],
      }));
    
    // If no slots found, create empty structure
    if (catalog.length === 0) {
      return [];
    }
    
    return catalog;
  } catch (error) {
    console.error('Error fetching class catalog:', error);
    throw error;
  }
}

/**
 * Fetch schedules with their slots (no client-side filtering)
 * Returns: [{ id, title, weekStart, weekEnd, publishedAt, slots: [formattedSlot,...] }, ...]
 */
export async function fetchSchedulesWithSlots() {
  try {
    const schedules = (await listSchedules()).filter((s) => s.isPublished);
    console.log('📍 Schedules from API:', schedules);
    const result = [];

    for (const schedule of schedules) {
      const scheduleId = schedule?.id || schedule?.ID;
      if (!scheduleId) continue;
      try {
        const slots = await listSlotsBySchedule(scheduleId, { includeCancelled: true });
        console.log(`📍 Slots for schedule ${scheduleId}:`, slots);
        const formatted = (slots || []).map((s) => ({
          ...s,
          id: s.id,
        }));
        result.push({
          id: scheduleId,
          title: schedule.title || schedule.Title || 'Schedule',
          weekStart: schedule.weekStart || schedule.WeekStart || '',
          weekEnd: schedule.weekEnd || schedule.WeekEnd || '',
          publishedAt: schedule.publishedAt || schedule.PublishedAt || '',
          slots: formatted,
        });
      } catch (err) {
        console.warn(`Failed to load slots for schedule ${scheduleId}:`, err);
        result.push({
          id: scheduleId,
          title: schedule.title || schedule.Title || 'Schedule',
          weekStart: schedule.weekStart || schedule.WeekStart || '',
          weekEnd: schedule.weekEnd || schedule.WeekEnd || '',
          publishedAt: schedule.publishedAt || schedule.PublishedAt || '',
          slots: [],
        });
      }
    }

    return result;
  } catch (error) {
    console.error('Error fetching schedules with slots:', error);
    throw error;
  }
}
