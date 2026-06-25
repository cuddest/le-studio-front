import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Loader,
  MapPin,
  Package,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import BookSlotModal from '../components/modals/BookSlotModal';
import { listAllAvailableSlots } from '../services/scheduleService';
import { filterPacksByTrainingType } from '../services/userPackService';
import { useAuth } from '../hooks/useAuth';

const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getWeekDates(referenceDate) {
  const date = new Date(referenceDate);
  const day = date.getDay();
  const diff = date.getDate() - day;
  const weekStart = new Date(date);
  weekStart.setDate(diff);
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    weekDates.push(d);
  }
  return weekDates;
}

function toDateKey(value) {
  if (!value) return '';
  if (typeof value === 'string') {
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatClock(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDayHeading(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function Booking() {
  const navigate = useNavigate();
  const { token, user, userPacks, trainingTypes } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);

  // Week navigation
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    trainingType: 'all',
    coach: 'all',
    level: 'all',
    onlyCompatible: false,
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  async function loadSlots() {
    setLoading(true);
    setError('');
    try {
      const availableSlots = await listAllAvailableSlots();
      const filtered = availableSlots
        .filter((slot) => !slot.isCancelled && slot.bookedCount < slot.capacity)
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      setSlots(filtered);
    } catch (err) {
      setError(err.message || 'Failed to load available slots');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }

  function handleBookSlot(slot) {
    setSelectedSlot(slot);
    setShowBookModal(true);
  }

  function handleBookingSuccess() {
    setBookingSuccess(`Successfully booked ${selectedSlot?.name}!`);
    setShowBookModal(false);
    setSelectedSlot(null);
    setTimeout(() => {
      navigate('/my-bookings');
    }, 1500);
  }

  function changeWeek(delta) {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + delta * 7);
    setSelectedDate(next);
  }

  function resetFilters() {
    setFilters({ trainingType: 'all', coach: 'all', level: 'all', onlyCompatible: false });
  }

  // Pre-compute compatibility for each slot so we can show a badge in the list.
  const slotsWithCompat = useMemo(() => {
    return slots.map((slot) => {
      const compatiblePacks = filterPacksByTrainingType(
        userPacks || [],
        slot.trainingTypeId,
        trainingTypes || []
      );
      return { ...slot, compatiblePacks };
    });
  }, [slots, userPacks, trainingTypes]);

  // Filter options derived from the slot list.
  const filterOptions = useMemo(() => {
    const types = new Set();
    const coaches = new Set();
    const levels = new Set();
    for (const s of slots) {
      if (s.trainingTypeName) types.add(s.trainingTypeName);
      if (s.coachName && s.coachName !== 'TBA') coaches.add(s.coachName);
      if (s.level) levels.add(s.level);
    }
    return {
      trainingTypes: ['all', ...Array.from(types)],
      coaches: ['all', ...Array.from(coaches)],
      levels: ['all', ...Array.from(levels)],
    };
  }, [slots]);

  const hasActiveFilters =
    filters.trainingType !== 'all' ||
    filters.coach !== 'all' ||
    filters.level !== 'all' ||
    filters.onlyCompatible;

  // Filter slots: by week (selected date's week) + by active filters.
  const weekSlots = useMemo(() => {
    const week = getWeekDates(selectedDate);
    const weekKeys = new Set(week.map(toDateKey));
    return slotsWithCompat.filter((s) => {
      if (!weekKeys.has(toDateKey(s.startTime || s.dateTime || s.date))) return false;
      if (filters.trainingType !== 'all' && s.trainingTypeName !== filters.trainingType) return false;
      if (filters.coach !== 'all' && s.coachName !== filters.coach) return false;
      if (filters.level !== 'all' && s.level !== filters.level) return false;
      if (filters.onlyCompatible && s.compatiblePacks.length === 0) return false;
      return true;
    });
  }, [slotsWithCompat, selectedDate, filters]);

  // Group by day.
  const slotsByDay = useMemo(() => {
    const map = new Map();
    for (const s of weekSlots) {
      const key = toDateKey(s.startTime || s.dateTime || s.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(s);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, daySlots]) => ({
        key,
        date: parseDateKey(key),
        slots: daySlots.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
      }));
  }, [weekSlots]);

  const totalSlots = weekSlots.length;
  const compatibleSlots = weekSlots.filter((s) => s.compatiblePacks.length > 0).length;
  const packStats = useMemo(() => {
    const active = (userPacks || []).filter(
      (p) => p.isPaid && p.status === 'active' && p.remainingSessions > 0
    );
    const remaining = active.reduce((sum, p) => sum + p.remainingSessions, 0);
    return { active, remaining };
  }, [userPacks]);

  return (
    <>
      <section className="bg-charcoal-deep pt-28 pb-12 sm:pt-36 sm:pb-16">
        <Container>
          <div className="max-w-2xl">
            <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.35em] uppercase mb-4">
              Booking
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight">
              Reserve your <em className="text-oak">next class</em>
            </h1>
            <p className="mt-5 text-text-warm text-base leading-relaxed max-w-lg">
              Pick an available time slot and secure your place. Classes fill up fast, so book ahead!
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-alabaster py-8 sm:py-12">
        <Container>
          {bookingSuccess && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
              <Check size={18} className="flex-shrink-0" />
              <span>{bookingSuccess}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
              <X size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Pack status banner */}
          <div
            className={`mb-6 rounded-lg border p-4 flex flex-wrap items-center justify-between gap-3 ${
              packStats.active.length > 0
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package
                size={20}
                className={packStats.active.length > 0 ? 'text-emerald-700' : 'text-amber-700'}
              />
              <div>
                {packStats.active.length > 0 ? (
                  <p className="text-sm text-emerald-900">
                    <span className="font-semibold">
                      {packStats.active.length} active pack{packStats.active.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-emerald-800/80"> · {packStats.remaining} session{packStats.remaining !== 1 ? 's' : ''} remaining</span>
                  </p>
                ) : (
                  <p className="text-sm text-amber-900">
                    <span className="font-semibold">No active pack.</span>
                    <span className="text-amber-800/80"> You need an active pack to book a class.</span>
                  </p>
                )}
              </div>
            </div>
            <a
              href="/packs"
              className={`text-xs font-semibold uppercase tracking-[0.12em] underline ${
                packStats.active.length > 0 ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {packStats.active.length > 0 ? 'View packs' : 'Browse packages'}
            </a>
          </div>

          {/* Week calendar */}
          <div className="bg-white rounded-lg border border-border-light p-4 sm:p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl sm:text-2xl text-charcoal">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => changeWeek(-1)}
                  className="p-2 hover:bg-alabaster rounded-lg transition-colors"
                  aria-label="Previous week"
                >
                  <ChevronLeft size={18} className="text-charcoal" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    setSelectedDate(today);
                  }}
                  className="px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-charcoal hover:bg-alabaster rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => changeWeek(1)}
                  className="p-2 hover:bg-alabaster rounded-lg transition-colors"
                  aria-label="Next week"
                >
                  <ChevronRight size={18} className="text-charcoal" />
                </button>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {getWeekDates(selectedDate).map((date) => {
                const isSelected = toDateKey(date) === toDateKey(selectedDate);
                const slotsOnDay = slotsWithCompat.filter(
                  (s) => toDateKey(s.startTime || s.dateTime || s.date) === toDateKey(date)
                ).length;
                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => setSelectedDate(new Date(date))}
                    className={`flex flex-col items-center justify-center px-3 sm:px-4 py-3 rounded-lg whitespace-nowrap transition-colors flex-shrink-0 min-w-[64px] ${
                      isSelected
                        ? 'bg-charcoal text-white'
                        : 'bg-alabaster text-charcoal hover:bg-alabaster-dark border border-border-light'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-[0.1em] font-semibold opacity-80">
                      {DAY_NAMES_SHORT[date.getDay()]}
                    </span>
                    <span className={`text-lg font-semibold ${isSelected ? 'text-oak' : 'text-charcoal'}`}>
                      {date.getDate()}
                    </span>
                    {slotsOnDay > 0 && (
                      <span
                        className={`mt-0.5 text-[9px] font-semibold ${
                          isSelected ? 'text-oak' : 'text-text-muted'
                        }`}
                      >
                        {slotsOnDay} slot{slotsOnDay !== 1 ? 's' : ''}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters + summary */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-2xl text-charcoal">
                {formatDayHeading(selectedDate)}
              </h3>
              <p className="text-text-muted text-sm mt-1">
                {totalSlots === 0
                  ? 'No slots match your filters'
                  : `${totalSlots} slot${totalSlots !== 1 ? 's' : ''} available · ${compatibleSlots} compatible with your pack${compatibleSlots !== 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-3 py-2 text-xs text-text-muted hover:text-charcoal transition-colors"
                >
                  Clear filters
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors text-charcoal ${
                  showFilters ? 'border-oak bg-oak/5' : 'border-border-light hover:bg-alabaster'
                }`}
              >
                <Filter size={16} />
                <span className="text-sm font-semibold">Filters</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white border border-border-light rounded-lg p-4 sm:p-6 mb-6">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <FilterSelect
                  label="Training Type"
                  value={filters.trainingType}
                  onChange={(v) => setFilters({ ...filters, trainingType: v })}
                  options={filterOptions.trainingTypes}
                />
                <FilterSelect
                  label="Coach"
                  value={filters.coach}
                  onChange={(v) => setFilters({ ...filters, coach: v })}
                  options={filterOptions.coaches}
                />
                <FilterSelect
                  label="Level"
                  value={filters.level}
                  onChange={(v) => setFilters({ ...filters, level: v })}
                  options={filterOptions.levels}
                />
                <label className="flex items-center gap-2 self-end pb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.onlyCompatible}
                    onChange={(e) => setFilters({ ...filters, onlyCompatible: e.target.checked })}
                    className="h-4 w-4 accent-oak"
                  />
                  <span className="text-sm text-charcoal">Only slots that fit my pack</span>
                </label>
              </div>
            </div>
          )}

          {/* Slot list */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="animate-spin text-oak" size={32} />
            </div>
          ) : !user ? null : slotsByDay.length === 0 ? (
            <EmptyState
              hasFilters={hasActiveFilters}
              onResetFilters={resetFilters}
              totalSlotsInWeek={slotsWithCompat.filter((s) =>
                getWeekDates(selectedDate)
                  .map(toDateKey)
                  .includes(toDateKey(s.startTime || s.dateTime || s.date))
              ).length}
            />
          ) : (
            <div className="space-y-8">
              {slotsByDay.map(({ key, date, slots: daySlots }) => (
                <div key={key}>
                  <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted mb-3">
                    {formatDayHeading(date)}
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {daySlots.map((slot) => (
                      <SlotCard
                        key={slot.id}
                        slot={slot}
                        onBook={handleBookSlot}
                        canBook={slot.compatiblePacks.length > 0}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {showBookModal && selectedSlot && (
            <BookSlotModal
              slot={selectedSlot}
              userPacks={userPacks}
              trainingTypes={trainingTypes}
              onClose={() => {
                setShowBookModal(false);
                setSelectedSlot(null);
              }}
              onSuccess={handleBookingSuccess}
            />
          )}
        </Container>
      </section>
    </>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-border-light rounded-lg text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-oak"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === 'all' ? `All ${label.toLowerCase()}s` : opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function SlotCard({ slot, onBook, canBook }) {
  const isFull = slot.bookedCount >= slot.capacity;
  const isWomenOnly = slot.slotType === 'women_only';
  const isMenOnly = slot.slotType === 'men_only';
  const start = new Date(slot.startTime);
  const end = new Date(slot.endTime);
  const duration = Math.round((end - start) / 60000);
  const capacityPct = slot.capacity > 0 ? Math.min(100, (slot.bookedCount / slot.capacity) * 100) : 0;

  return (
    <div className="bg-white border border-border-light rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="bg-alabaster px-5 py-4 border-b border-border-light flex items-center justify-between">
        <div>
          <p className="font-mono text-2xl text-charcoal font-semibold tracking-tight">
            {formatClock(slot.startTime)}
          </p>
          {duration > 0 && (
            <p className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1">
              <Clock3 size={11} /> {duration} min
            </p>
          )}
        </div>
        {canBook ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-1">
            <Check size={11} /> PACK FITS
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 text-text-muted text-[10px] font-semibold px-2 py-1">
            <Package size={11} /> NO PACK
          </span>
        )}
      </div>

      <div className="px-5 py-4 flex-1 flex flex-col">
        {slot.trainingTypeName && (
          <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.25em] uppercase">
            {slot.trainingTypeName}
          </p>
        )}
        <h3 className="font-serif text-xl text-charcoal mt-1 mb-2 leading-snug">{slot.name}</h3>

        <div className="space-y-1.5 text-sm text-text-muted mb-4 flex-1">
          {slot.coachName && slot.coachName !== 'TBA' && (
            <p className="flex items-center gap-2">
              <Users size={13} className="text-oak flex-shrink-0" />
              {slot.coachName}
            </p>
          )}
          {slot.level && (
            <p className="flex items-center gap-2">
              <Sparkles size={13} className="text-oak flex-shrink-0" />
              {slot.level}
            </p>
          )}
          {(isWomenOnly || isMenOnly) && (
            <p className="text-xs font-medium text-oak">
              {isWomenOnly ? '👩 Women Only' : '👨 Men Only'}
            </p>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] text-text-muted mb-1.5">
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {slot.bookedCount}/{slot.capacity} spots
            </span>
            {isFull && <span className="text-rose-600 font-semibold">Full</span>}
          </div>
          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${capacityPct >= 90 ? 'bg-rose-400' : 'bg-oak'}`}
              style={{ width: `${capacityPct}%` }}
            />
          </div>
        </div>

        <Button
          onClick={() => onBook(slot)}
          disabled={isFull}
          variant={canBook ? 'primary' : 'outline'}
          size="sm"
          className="w-full"
        >
          {isFull ? 'Full' : canBook ? 'Book this class' : 'View options'}
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ hasFilters, onResetFilters, totalSlotsInWeek }) {
  if (totalSlotsInWeek === 0) {
    return (
      <div className="rounded-lg bg-white border border-dashed border-border-light p-10 text-center">
        <CalendarDays className="inline mb-3 text-text-muted" size={28} />
        <p className="text-charcoal font-medium">No classes scheduled this week</p>
        <p className="text-sm text-text-muted mt-1">Check the next week or browse the class catalog.</p>
      </div>
    );
  }
  return (
    <div className="rounded-lg bg-white border border-dashed border-border-light p-10 text-center">
      <Filter className="inline mb-3 text-text-muted" size={28} />
      <p className="text-charcoal font-medium">No slots match your current filters</p>
      <p className="text-sm text-text-muted mt-1">
        {hasFilters
          ? 'Try adjusting the filters to see more options.'
          : 'Switch days to find other available times.'}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-oak hover:text-oak-dark underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}
