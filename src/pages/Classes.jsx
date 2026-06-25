import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Clock, MapPin, Users, Zap, Filter } from 'lucide-react';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { fetchSchedulesWithSlots } from '../services/classesService';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function toDayIndex(slot) {
  if (Number.isInteger(slot.dayOfWeek)) {
    return slot.dayOfWeek;
  }
  const dateSource = slot.date || slot.startTime || slot.start_time;
  const d = new Date(dateSource);
  if (!Number.isNaN(d.getTime())) {
    return d.getDay();
  }
  return -1;
}

function getDateFromSlot(slot) {
  const dateSource = slot.date || slot.startTime || slot.start_time;
  const d = new Date(dateSource);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function formatClock(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'TBA';
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function getDuration(startTime, endTime) {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
    const minutes = Math.round((end - start) / 60000);
    return minutes > 0 ? `${minutes} min` : null;
  } catch {
    return null;
  }
}

function formatDateLabel(value, format = 'dmy') {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'No date';
  if (format === 'full') {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function toDateKey(value) {
  if (!value) return '';

  if (typeof value === 'string') {
    const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateOnlyMatch) {
      return `${dateOnlyMatch[1]}-${dateOnlyMatch[2]}-${dateOnlyMatch[3]}`;
    }
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function slotSort(a, b) {
  const da = new Date(a.startTime || a.start_time || a.date || 0).getTime();
  const db = new Date(b.startTime || b.start_time || b.date || 0).getTime();
  return da - db;
}

function getWeekDates(referenceDate) {
  // Get the week that contains the reference date (Sunday to Saturday)
  const date = new Date(referenceDate);
  const day = date.getDay();
  const diff = date.getDate() - day;
  
  const weekStart = new Date(date.setDate(diff));
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    weekDates.push(d);
  }
  return weekDates;
}

export default function Classes() {
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSessions, setExpandedSessions] = useState(new Set());
  
  // Filter states
  const [filters, setFilters] = useState({
    schedule: 'all',
    coach: 'all',
    level: 'all',
    type: 'all',
    gender: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSchedulesWithSlots();
        console.log('🔍 Fetched schedules from API:', data);
        console.log('📊 Total sessions:', data.reduce((sum, s) => sum + (s.slots?.length || 0), 0));
        setSchedules(data);
      } catch (err) {
        console.error('Failed to load class catalog:', err);
        setError('Unable to load classes. Please try again later.');
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, []);

  // Get unique filter options
  const allSlots = schedules.flatMap((s) => s.slots || []);
  const filterOptions = {
    schedules: ['all', ...Array.from(new Set(schedules.map((s) => s.title))).filter(Boolean)],
    coaches: ['all', ...Array.from(new Set(allSlots.map((s) => s.coach || 'TBA'))).filter(Boolean)],
    levels: ['all', ...Array.from(new Set(allSlots.map((s) => s.level || 'All Levels'))).filter(Boolean)],
    types: ['all', ...Array.from(new Set(allSlots.map((s) => s.slotType || 'All Types'))).filter(Boolean)],
    genders: ['all', ...Array.from(new Set(allSlots.map((s) => s.gender || 'Mixte'))).filter(Boolean)],
  };

  // Get sessions for selected date
  const selectedDateKey = toDateKey(selectedDate);
  const sessionsForDay = allSlots
    .filter((slot) => toDateKey(slot.date || slot.startTime || slot.start_time) === selectedDateKey)
    .filter((slot) => {
      if (filters.schedule !== 'all') {
        const schedule = schedules.find((s) => s.slots?.includes(slot));
        if (!schedule || schedule.title !== filters.schedule) return false;
      }
      if (filters.coach !== 'all' && (slot.coach || 'TBA') !== filters.coach) return false;
      if (filters.level !== 'all' && (slot.level || 'All Levels') !== filters.level) return false;
      if (filters.type !== 'all' && (slot.slotType || 'All Types') !== filters.type) return false;
      if (filters.gender !== 'all' && (slot.gender || 'Mixte') !== filters.gender) return false;
      return true;
    })
    .sort(slotSort);

  // Get which schedule each session belongs to
  const getScheduleForSlot = (slot) => {
    return schedules.find((s) => s.slots?.includes(slot));
  };

  const toggleSessionExpanded = (slotId) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(slotId)) {
      newExpanded.delete(slotId);
    } else {
      newExpanded.add(slotId);
    }
    setExpandedSessions(newExpanded);
  };

  const goToPreviousDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const goToNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-charcoal-deep pt-20 pb-12">
        <Container>
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight">
              Weekly <em className="text-oak">Schedule</em>
            </h1>
            <p className="mt-4 text-text-warm text-base leading-relaxed max-w-2xl">
              Browse all session details: time, coach, level, capacity, and booking status. Select a day to see all available classes.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-alabaster py-12 sm:py-16">
        <Container>
          {loading && (
            <div className="text-center py-12">
              <p className="text-text-warm">Loading classes...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 text-center mb-8">
              {error}
            </div>
          )}

          {!loading && !error && schedules.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-warm">No classes available at the moment. Please check back soon.</p>
            </div>
          )}

          {!loading && !error && schedules.length > 0 && (
            <>
              {/* Week Calendar */}
              <div className="bg-white rounded-lg border border-border-light p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl text-charcoal">Select a day</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={goToPreviousDay}
                      type="button"
                      className="p-2 hover:bg-alabaster rounded-lg transition-colors"
                    >
                      <ChevronLeft size={20} className="text-charcoal" />
                    </button>
                    <button
                      onClick={goToNextDay}
                      type="button"
                      className="p-2 hover:bg-alabaster rounded-lg transition-colors"
                    >
                      <ChevronRight size={20} className="text-charcoal" />
                    </button>
                  </div>
                </div>

                {/* Day buttons - week containing selected date */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {getWeekDates(selectedDate).map((date) => {
                    const isSelected = date.toDateString() === selectedDate.toDateString();
                    return (
                      <button
                        key={date.toDateString()}
                        type="button"
                        onClick={() => setSelectedDate(new Date(date))}
                        className={`flex flex-col items-center justify-center px-4 py-3 rounded-lg whitespace-nowrap transition-colors flex-shrink-0 ${
                          isSelected
                            ? 'bg-charcoal text-white'
                            : 'bg-alabaster text-charcoal hover:bg-alabaster-dark border border-border-light'
                        }`}
                      >
                        <span className="text-xs uppercase tracking-[0.1em] font-semibold">{DAY_NAMES[date.getDay()]}</span>
                        <span className={`text-lg font-semibold ${isSelected ? 'text-oak' : 'text-charcoal'}`}>{date.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected date info and filters */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-3xl text-charcoal">
                      {formatDateLabel(selectedDate, 'full')}
                    </h3>
                    <p className="text-text-muted text-sm mt-1">
                      {sessionsForDay.length} session{sessionsForDay.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 border border-border-light rounded-lg hover:bg-alabaster transition-colors text-charcoal"
                  >
                    <Filter size={16} />
                    <span className="text-sm font-semibold">Filters</span>
                  </button>
                </div>

                {/* Filter controls */}
                {showFilters && (
                  <div className="bg-white border border-border-light rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {/* Schedule filter */}
                      <div>
                        <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-text-muted mb-2">
                          Schedule
                        </label>
                        <select
                          value={filters.schedule}
                          onChange={(e) => setFilters({ ...filters, schedule: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oak"
                        >
                          {filterOptions.schedules.map((option) => (
                            <option key={option} value={option}>
                              {option === 'all' ? 'All Schedules' : option}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Coach filter */}
                      <div>
                        <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-text-muted mb-2">
                          Coach
                        </label>
                        <select
                          value={filters.coach}
                          onChange={(e) => setFilters({ ...filters, coach: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oak"
                        >
                          {filterOptions.coaches.map((option) => (
                            <option key={option} value={option}>
                              {option === 'all' ? 'All Coaches' : option}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Level filter */}
                      <div>
                        <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-text-muted mb-2">
                          Level
                        </label>
                        <select
                          value={filters.level}
                          onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oak"
                        >
                          {filterOptions.levels.map((option) => (
                            <option key={option} value={option}>
                              {option === 'all' ? 'All Levels' : option}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Type filter */}
                      <div>
                        <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-text-muted mb-2">
                          Type
                        </label>
                        <select
                          value={filters.type}
                          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oak"
                        >
                          {filterOptions.types.map((option) => (
                            <option key={option} value={option}>
                              {option === 'all' ? 'All Types' : option}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Gender filter */}
                      <div>
                        <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-text-muted mb-2">
                          Gender
                        </label>
                        <select
                          value={filters.gender}
                          onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                          className="w-full px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oak"
                        >
                          {filterOptions.genders.map((option) => (
                            <option key={option} value={option}>
                              {option === 'all' ? 'All' : option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sessions list */}
              {sessionsForDay.length === 0 ? (
                <div className="bg-white border border-border-light rounded-lg p-8 text-center">
                  <p className="text-text-muted">No sessions available for this day with current filters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessionsForDay.map((slot) => {
                    const schedule = getScheduleForSlot(slot);
                    const isExpanded = expandedSessions.has(slot.id);
                    const scheduleColors = {
                      0: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700' },
                      1: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800' },
                      2: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
                      3: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
                      4: { bg: 'bg-pink-50', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-700' },
                    };
                    const scheduleIndex = schedules.findIndex((s) => s.id === schedule?.id);
                    const color = scheduleColors[scheduleIndex % 5];

                    return (
                      <div
                        key={slot.id}
                        className={`rounded-lg border transition-colors ${color.bg} ${color.border} border-2`}
                      >
                        {/* Session header - always visible */}
                        <button
                          onClick={() => toggleSessionExpanded(slot.id)}
                          type="button"
                          className="w-full text-left p-5 sm:p-6 focus:outline-none hover:opacity-80 transition-opacity"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`text-2xl font-semibold ${color.badge.replace('bg-', 'text-')}`}>
                                  {formatClock(slot.startTime)}
                                </span>
                                {getDuration(slot.startTime, slot.endTime) && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${color.badge}`}>
                                    {getDuration(slot.startTime, slot.endTime)}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-serif text-2xl text-charcoal">{slot.title || 'Session'}</h4>
                              <p className="text-sm text-text-muted mt-1">{slot.coach || 'TBA'}</p>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              {schedule && (
                                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${color.badge}`}>
                                  {schedule.title}
                                </span>
                              )}
                              <ChevronDown
                                size={20}
                                className={`text-charcoal transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </div>
                          </div>
                        </button>

                        {/* Session details - collapsible */}
                        {isExpanded && (
                          <div className="border-t border-current border-opacity-20 p-5 sm:p-6 pt-4 space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs uppercase tracking-[0.16em] font-semibold text-text-muted mb-1">
                                  Level
                                </p>
                                <p className="text-sm text-charcoal">{slot.level || 'All Levels'}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-[0.16em] font-semibold text-text-muted mb-1">
                                  Type
                                </p>
                                <p className="text-sm text-charcoal">{slot.slotType || 'Standard'}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-[0.16em] font-semibold text-text-muted mb-1">
                                  Gender
                                </p>
                                <p className="text-sm text-charcoal">{slot.gender || 'Mixte'}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-[0.16em] font-semibold text-text-muted mb-1">
                                  Capacity
                                </p>
                                <p className="text-sm text-charcoal">
                                  {slot.bookedCount || 0} / {slot.capacity || 0}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-[0.16em] font-semibold text-text-muted mb-1">
                                  Status
                                </p>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-semibold inline-block ${
                                    slot.isCancelled
                                      ? 'bg-red-200 text-red-700'
                                      : 'bg-green-200 text-green-700'
                                  }`}
                                >
                                  {slot.isCancelled ? 'Cancelled' : 'Active'}
                                </span>
                              </div>
                              {slot.price && (
                                <div>
                                  <p className="text-xs uppercase tracking-[0.16em] font-semibold text-text-muted mb-1">
                                    Price
                                  </p>
                                  <p className="text-sm font-serif text-charcoal">{slot.price} DA</p>
                                </div>
                              )}
                            </div>

                            {slot.description && (
                              <div className="bg-white bg-opacity-50 p-3 rounded text-sm text-charcoal">
                                {slot.description}
                              </div>
                            )}

                            <div className="pt-4 border-t border-current border-opacity-20">
                              <Link to="/booking">
                                <Button variant="oak" size="sm">
                                  Book Now
                                  <ArrowRight size={14} />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-charcoal-deep py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-tight">
              Ready to book your session?
            </h2>
            <p className="mt-4 text-text-warm text-sm sm:text-base leading-relaxed">
              Choose your session and complete your booking. If you need guidance, we'll help place you in the right class.
            </p>
            <div className="mt-8">
              <Link to="/booking">
                <Button variant="oak" size="lg">
                  Go to Booking
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

