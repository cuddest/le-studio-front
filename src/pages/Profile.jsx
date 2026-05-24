import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Gift,
  Calendar,
  History,
  CreditCard,
  Clock,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useReveal } from '../hooks/useReveal';
import { useAuth } from '../hooks/useAuth';
import { useUserDashboard } from '../hooks/useUserDashboard';

export default function Profile() {
  const [headerRef, headerVisible] = useReveal(0.1);
  const { user, updateUser, logout } = useAuth();
  const dashboard = useUserDashboard(user);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [saved, setSaved] = useState(false);

  const onSave = (event) => {
    event.preventDefault();
    updateUser({ ...user, ...form });
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <>
      <section className="bg-charcoal-deep pt-28 pb-16 sm:pt-36 sm:pb-20">
        <Container>
          <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
            <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.35em] uppercase mb-4">
              User Dashboard
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-white tracking-tight">
              Welcome back, <em className="text-oak">{(user?.name || 'Member').split(' ')[0]}</em>
            </h1>
            <p className="mt-3 text-text-warm text-base">
              View and edit your profile, check upcoming bookings, and track your reward points.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-alabaster py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="space-y-6">
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <Gift size={16} className="text-oak" />
                  <h3 className="font-sans text-sm font-semibold text-charcoal tracking-wide">
                    Reward Points
                  </h3>
                </div>
                <p className="font-serif text-4xl text-charcoal">{dashboard.rewardPoints}</p>
                <p className="text-text-muted text-sm mt-2">Available for future loyalty rewards.</p>
              </Card>

              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard size={16} className="text-oak" />
                  <h3 className="font-sans text-sm font-semibold text-charcoal tracking-wide">
                    Membership
                  </h3>
                </div>
                <p className="font-serif text-2xl text-charcoal">{user?.membership || 'Discovery'}</p>
                <p className="text-text-muted text-sm mt-2">Upgrade options will be connected to billing APIs later.</p>
                <Link to="/classes" className="inline-block mt-4 text-oak text-xs font-sans font-semibold tracking-[0.16em] uppercase hover:text-oak-dark">
                  Browse Classes
                </Link>
              </Card>

              <Card>
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 text-sm text-red-500/80 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <div className="flex items-center gap-3 mb-6">
                  <User size={16} className="text-oak" />
                  <h3 className="font-sans text-sm font-semibold text-charcoal tracking-wide">
                    User Info
                  </h3>
                </div>

                <form onSubmit={onSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="sm:col-span-1">
                    <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-text-muted">Full Name</span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                      className="mt-2 w-full rounded border border-border-light bg-alabaster px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-oak"
                      required
                    />
                  </label>

                  <label className="sm:col-span-1">
                    <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-text-muted">Phone</span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                      className="mt-2 w-full rounded border border-border-light bg-alabaster px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-oak"
                    />
                  </label>

                  <label className="sm:col-span-2">
                    <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-text-muted">Email</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                      className="mt-2 w-full rounded border border-border-light bg-alabaster px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-oak"
                      required
                    />
                  </label>

                  <div className="sm:col-span-2 flex items-center gap-3 pt-2">
                    <Button type="submit" size="sm">Save Changes</Button>
                    {saved && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700">
                        <CheckCircle2 size={14} />
                        Profile updated
                      </span>
                    )}
                  </div>
                </form>
              </Card>

              <Card>
                <div className="flex items-center gap-3 mb-6">
                  <Calendar size={16} className="text-oak" />
                  <h3 className="font-sans text-sm font-semibold text-charcoal tracking-wide">
                    Upcoming Bookings
                  </h3>
                </div>

                <div className="space-y-3">
                  {dashboard.upcomingBookings.map((booking) => (
                    <div key={booking.id} className="rounded border border-border-light bg-alabaster p-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-serif text-lg text-charcoal">{booking.className}</p>
                        <p className="text-text-muted text-xs mt-1">{booking.date} · {booking.coach}</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs text-oak font-sans tracking-wider uppercase">
                        <Clock size={12} />
                        {booking.time}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3 mb-6">
                  <History size={16} className="text-oak" />
                  <h3 className="font-sans text-sm font-semibold text-charcoal tracking-wide">
                    Booking History
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {dashboard.bookingHistory.map((item) => (
                    <div key={item.id} className="rounded border border-border-light p-3.5 flex items-center justify-between">
                      <div>
                        <p className="text-charcoal text-sm font-medium">{item.className}</p>
                        <p className="text-text-muted text-xs mt-0.5">{item.date}</p>
                      </div>
                      <span className="text-xs text-emerald-700 uppercase tracking-wider font-sans">{item.status}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
