import { Link } from 'react-router-dom';
import HeroMediaSlider from '../components/home/HeroMediaSlider';
import AboutSection from '../components/home/AboutSection';
import CoachesPreviewSection from '../components/home/CoachesPreviewSection';
import WeeklyPlanningSection from '../components/home/WeeklyPlanningSection';
import FaqSection from '../components/home/FaqSection';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import {
  homeHeroMedia,
  instructors,
  weeklyPlanning,
  homeFaqs,
} from '../data';

export default function Home() {
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
              <Link to="/booking">
                <Button variant="oak" size="lg">
                  Book Now
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

      <CoachesPreviewSection coaches={instructors} />

      <WeeklyPlanningSection weekSchedule={weeklyPlanning} />

      <FaqSection items={homeFaqs} />
    </>
  );
}
