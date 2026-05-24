import HeroMediaSlider from '../components/home/HeroMediaSlider';
import AboutSection from '../components/home/AboutSection';
import CoachesPreviewSection from '../components/home/CoachesPreviewSection';
import WeeklyPlanningSection from '../components/home/WeeklyPlanningSection';
import FaqSection from '../components/home/FaqSection';
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
