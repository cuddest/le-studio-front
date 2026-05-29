import { listSchedules, listSlotsBySchedule } from './scheduleService';

/**
 * Converts API slot data to frontend format
 */
function formatSlot(slot, coach) {
  const startTime = new Date(slot.start_time);
  const endTime = new Date(slot.end_time);
  const duration = Math.round((endTime - startTime) / 60000);
  
  return {
    id: `slot-${slot.id}`,
    title: slot.name,
    discipline: slot.training_type?.name || 'Training',
    duration: `${duration} min`,
    coach: coach?.name || 'TBA',
    price: '2000', // Default price, adjust based on business logic
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=700&h=450&fit=crop&q=80',
    description: `${slot.training_type?.name || 'Training'} session at ${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`,
    slotId: slot.id,
    startTime: slot.start_time,
    capacity: slot.capacity,
    bookedCount: slot.booked_count,
  };
}

/**
 * Fetches and groups all classes by level
 * Returns data in classCatalogByLevel format
 */
export async function fetchClassCatalog() {
  try {
    const schedules = await listSchedules();
    
    // Build a map of all slots
    const allSlots = [];
    
    for (const schedule of schedules) {
      const scheduleId = schedule?.id || schedule?.ID;
      if (!scheduleId) {
        continue;
      }
      try {
        const slots = await listSlotsBySchedule(scheduleId);
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
