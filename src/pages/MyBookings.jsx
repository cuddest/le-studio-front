import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader, AlertCircle, Trash2 } from 'lucide-react';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { listUserBookings, cancelBooking } from '../services/bookingService';
import { useAuth } from '../hooks/useAuth';

export default function MyBookings() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    async function loadBookings() {
      setLoading(true);
      setError('');
      try {
        const userBookings = await listUserBookings();
        // Sort by date, upcoming first
        const sorted = userBookings.sort(
          (a, b) => new Date(b.startTime) - new Date(a.startTime)
        );
        setBookings(sorted);
      } catch (err) {
        setError(err.message || 'Failed to load bookings');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [token, navigate]);

  const formatDateTime = (isoString) => {
    if (!isoString) return 'TBD';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'TBA';
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  async function handleCancelBooking(bookingId) {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setCancelError('');
    setCancelSuccess('');
    setCancellingId(bookingId);

    try {
      await cancelBooking(bookingId);
      setCancelSuccess('Booking cancelled successfully. Your session credit has been restored.');
      // Refresh bookings
      const updated = await listUserBookings();
      setBookings(updated.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)));
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  }

  // Helper to safely parse booking date
  const getBookingDate = (booking) => {
    if (!booking.startTime) return null;
    const date = new Date(booking.startTime);
    return isNaN(date.getTime()) ? null : date;
  };

  const upcomingBookings = bookings.filter((b) => {
    const bookingDate = getBookingDate(b);
    return b.status?.toLowerCase() !== 'cancelled' && bookingDate && bookingDate > new Date();
  });

  const pastBookings = bookings.filter((b) => {
    const bookingDate = getBookingDate(b);
    return bookingDate && bookingDate <= new Date();
  });

  // Debug: log all bookings
  if (bookings.length > 0) {
    console.log(`Total bookings: ${bookings.length}`);
    console.log('Upcoming:', upcomingBookings.length);
    console.log('Past:', pastBookings.length);
    console.log('Bookings:', bookings);
  }

  return (
    <>
      <section className="bg-charcoal-deep pt-28 pb-16 sm:pt-36 sm:pb-20">
        <Container>
          <div className="max-w-2xl">
            <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.35em] uppercase mb-4">
              My Bookings
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-white tracking-tight">
              Your reserved <em className="text-oak">sessions</em>
            </h1>
            <p className="mt-4 text-text-warm leading-relaxed max-w-lg">
              View and manage all your class bookings in one place.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-alabaster py-12 sm:py-16">
        <Container>
          {cancelSuccess && (
            <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
              ✓ {cancelSuccess}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
              ⚠ {error}
            </div>
          )}

          {cancelError && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
              ⚠ {cancelError}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="animate-spin text-oak" size={32} />
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-8 text-center">
              <AlertCircle className="inline mb-2 text-amber-600" size={32} />
              <p className="text-amber-900 font-medium text-lg mt-2">No bookings yet</p>
              <p className="text-sm text-amber-700 mt-1">
                Start by booking a class from the available sessions.
              </p>
              <Button
                onClick={() => navigate('/booking')}
                variant="oak"
                className="mt-4"
              >
                Browse Classes
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Upcoming Bookings */}
              <div>
                <h2 className="text-2xl font-serif text-charcoal mb-4">Upcoming Sessions</h2>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="rounded-lg border border-border-light bg-white p-4 sm:p-6 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-serif text-lg text-charcoal mb-1">
                              {booking.className}
                            </h3>
                            <p className="text-sm text-text-muted mb-2">
                              {formatDateTime(booking.startTime)}
                            </p>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusBadgeColor(
                                  booking.status
                                )}`}
                              >
                                {booking.status || 'Confirmed'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="self-start sm:self-center px-4 py-2 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors flex items-center gap-2 text-sm font-medium"
                          >
                            <Trash2 size={16} />
                            {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-border-light bg-white p-6 text-sm text-text-muted">
                    No upcoming bookings. <Link to="/booking" className="text-oak hover:text-oak-dark font-semibold">Book a class now</Link>.
                  </div>
                )}
              </div>

              {/* Past Bookings */}
              <div>
                <h2 className="text-2xl font-serif text-charcoal mb-4">Past Sessions</h2>
                {pastBookings.length > 0 ? (
                  <div className="space-y-3">
                    {pastBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="rounded-lg border border-border-light bg-white p-4 sm:p-6 opacity-75"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-serif text-lg text-charcoal mb-1">
                              {booking.className}
                            </h3>
                            <p className="text-sm text-text-muted">
                              {formatDateTime(booking.startTime)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusBadgeColor(
                                  booking.status
                                )}`}
                              >
                                {booking.status || 'Confirmed'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-border-light bg-white p-6 text-sm text-text-muted">
                    No past bookings.
                  </div>
                )}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

