import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroMediaSlider from '../components/home/HeroMediaSlider';
import AboutSection from '../components/home/AboutSection';
import CoachesPreviewSection from '../components/home/CoachesPreviewSection';
import WeeklyPlanningSection from '../components/home/WeeklyPlanningSection';
import FaqSection from '../components/home/FaqSection';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { listCoaches } from '../services/coachService';
import { listSchedules, listSlotsBySchedule } from '../services/scheduleService';
import {
  homeHeroMedia,
  homeFaqs,
} from '../data';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Home() {
  const [coaches, setCoaches] = useState([]);
  const [weeklyPlanning, setWeeklyPlanning] = useState([]);

  useEffect(() => {
    // Fetch coaches
    const loadCoaches = async () => {
      try {
        const coachList = await listCoaches();
        setCoaches(coachList.slice(0, 3)); // Show first 3 coaches
      } catch (err) {
        console.warn('Failed to load coaches:', err);
        setCoaches([]);
      }
    };

    // Fetch schedules and slots to build weekly planning
    const loadWeeklyPlanning = async () => {
      try {
        const schedules = await listSchedules();
        const allSlots = [];

        for (const schedule of schedules) {
          const scheduleId = schedule?.id || schedule?.ID;
          if (!scheduleId) continue;
          try {
            const slots = await listSlotsBySchedule(scheduleId, { includeCancelled: true });
            allSlots.push(...slots);
          } catch (err) {
            console.warn(`Failed to fetch slots for schedule ${scheduleId}:`, err);
          }
        }

        // Group slots by day of week and find time windows
        const byDay = {};
        allSlots.forEach((slot) => {
          const dayIndex = slot.dayOfWeek ?? new Date(slot.date || slot.startTime || 0).getDay();
          if (!byDay[dayIndex]) {
            byDay[dayIndex] = [];
          }
          byDay[dayIndex].push(slot);
        });

        // Build weekly planning with day, theme (first slot name), and time window
        const planning = [];
        for (let i = 0; i < 7; i++) {
          if (byDay[i] && byDay[i].length > 0) {
            const slots = byDay[i];
            const startTimes = slots
              .map((s) => new Date(s.startTime || s.start_time || 0).getTime())
              .filter((t) => !isNaN(t));
            const endTimes = slots
              .map((s) => new Date(s.endTime || s.end_time || 0).getTime())
              .filter((t) => !isNaN(t));

            const minStart = startTimes.length > 0 ? Math.min(...startTimes) : 0;
            const maxEnd = endTimes.length > 0 ? Math.max(...endTimes) : 0;

            const formatTime = (timestamp) => {
              if (timestamp === 0) return 'TBA';
              const d = new Date(timestamp);
              return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            };

            planning.push({
              day: DAY_NAMES[i],
              theme: slots[0]?.name || 'Session',
              window: `${formatTime(minStart)} - ${formatTime(maxEnd)}`,
            });
          }
        }

        setWeeklyPlanning(planning.length > 0 ? planning : []);
      } catch (err) {
        console.warn('Failed to load weekly planning:', err);
        setWeeklyPlanning([]);
      }
    };

    loadCoaches();
    loadWeeklyPlanning();
  }, []);

  return (
    <>
      <HeroMediaSlider slides={homeHeroMedia} />

      <section className="bg-alabaster border-y border-border-light">
        <Container className="py-6 sm:py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.35em] uppercase mb-2">
                Quick Access
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-charcoal tracking-tight">
                Book your next session in a few clicks.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/classes">
                <Button variant="oak" size="lg">
                  See Classes
                </Button>
              </Link>
              <Link to="/my-bookings">
                <Button variant="outline" size="lg">
                  My Bookings
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <div id="about">
        <AboutSection
          quote="When women move with intention, confidence follows."
          description="Our studio philosophy blends pilates precision, breath-led focus, and progressive coaching. Whether you are returning to movement or deepening your current practice, every class is structured to help you feel stronger, safer, and more connected in your body."
          image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&h=1100&fit=crop&q=80"
        />
      </div>

      <CoachesPreviewSection coaches={coaches} />

      <WeeklyPlanningSection weekSchedule={weeklyPlanning} />

      <FaqSection items={homeFaqs} />
    </>
  );
}
