import { CalendarDays, Clock3, UserRound } from 'lucide-react';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const bookingCards = [
  {
    id: 1,
    title: 'Intro Reformer',
    coach: 'Amira B.',
    time: 'Tue · 10:30',
    seats: '3 spots left',
  },
  {
    id: 2,
    title: 'Hot Flow Yoga',
    coach: 'Yasmine K.',
    time: 'Thu · 17:00',
    seats: '5 spots left',
  },
  {
    id: 3,
    title: 'Gentle Mat Pilates',
    coach: 'Lina M.',
    time: 'Fri · 18:30',
    seats: '9 spots left',
  },
];

export default function Booking() {
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
              Pick a time slot and secure your place. Booking logic is intentionally kept simple for now and can be connected to backend availability APIs later.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-alabaster py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {bookingCards.map((slot) => (
              <Card key={slot.id} className="hover:shadow-md transition-shadow duration-300">
                <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.25em] uppercase mb-2">
                  Group Session
                </p>
                <h2 className="font-serif text-2xl text-charcoal mb-4">{slot.title}</h2>
                <div className="space-y-2 text-sm text-text-muted mb-6">
                  <p className="flex items-center gap-2"><UserRound size={14} className="text-oak" />{slot.coach}</p>
                  <p className="flex items-center gap-2"><Clock3 size={14} className="text-oak" />{slot.time}</p>
                  <p className="flex items-center gap-2"><CalendarDays size={14} className="text-oak" />{slot.seats}</p>
                </div>
                <Button className="w-full">Book Slot</Button>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
