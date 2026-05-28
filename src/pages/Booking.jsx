import { CalendarDays, Clock3, AlertCircle, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import BookSlotModal from '../components/modals/BookSlotModal';
import { listAllAvailableSlots } from '../services/scheduleService';
import { useAuth } from '../hooks/useAuth';

export default function Booking() {
  const navigate = useNavigate();
  const { user, token, userPacks, trainingTypes } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    async function loadSlots() {
      setLoading(true);
      setError('');
      try {
        const availableSlots = await listAllAvailableSlots();
        // Filter out cancelled slots and sort by start time
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

    loadSlots();
  }, [token, navigate]);

  async function handleBookSlot(slot) {
    setSelectedSlot(slot);
    setShowBookModal(true);
  }

  const handleBookingSuccess = () => {
    setBookingSuccess(`Successfully booked ${selectedSlot?.name}!`);
    setShowBookModal(false);
    setSelectedSlot(null);
    setTimeout(() => {
      navigate('/my-bookings');
    }, 1500);
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return 'TBD';
    try {
      const date = new Date(isoString);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return `${day} · ${time}`;
    } catch {
      return isoString;
    }
  };

  return (
    <>
      <section className="bg-charcoal-deep pt-28 pb-16 sm:pt-36 sm:pb-20">
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

      <section className="bg-alabaster py-12 sm:py-16">
        <Container>
          {bookingSuccess && (
            <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
              ✓ {bookingSuccess}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
              ⚠ {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="animate-spin text-oak" size={32} />
            </div>
          ) : slots.length === 0 ? (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-6 text-center">
              <AlertCircle className="inline mb-2 text-amber-600" size={24} />
              <p className="text-amber-900 font-medium">No available slots at the moment</p>
              <p className="text-sm text-amber-700 mt-1">Check back soon or contact us for more information</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {slots.map((slot) => (
                <Card key={slot.id} className="hover:shadow-md transition-shadow duration-300 flex flex-col">
                  <div className="flex-1">
                    <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.25em] uppercase mb-2">
                      {slot.trainingTypeName}
                    </p>
                    <h2 className="font-serif text-2xl text-charcoal mb-4">{slot.name}</h2>
                    <div className="space-y-2 text-sm text-text-muted mb-6">
                      <p className="flex items-center gap-2">
                        <Clock3 size={14} className="text-oak flex-shrink-0" />
                        {formatDateTime(slot.startTime)}
                      </p>
                      <p className="flex items-center gap-2">
                        <CalendarDays size={14} className="text-oak flex-shrink-0" />
                        {slot.capacity - slot.bookedCount} spot{slot.capacity - slot.bookedCount !== 1 ? 's' : ''} left
                      </p>
                      {slot.slotType !== 'mixte' && (
                        <p className="text-xs font-medium">
                          {slot.slotType === 'women_only' ? '👩 Women Only' : '👨 Men Only'}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleBookSlot(slot)}
                    className="w-full"
                  >
                    Book Slot
                  </Button>
                </Card>
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
