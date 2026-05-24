// ─── Disciplines ───────────────────────────────────────────
export const disciplines = [
  {
    id: 1,
    title: 'Pilates Reformer',
    subtitle: 'Full Body Control',
    description:
      'Master precision and strength on our state-of-the-art black Reformer machines. Every movement is intentional, sculpting long, lean muscles while building deep core stability.',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=600&fit=crop&q=80',
    features: ['Core activation', 'Postural alignment', 'Muscle lengthening', 'Joint mobility'],
  },
  {
    id: 2,
    title: 'Hot Yoga & Hot Pilates',
    subtitle: 'Detox & Sweat',
    description:
      'Surrender to the heat. Our infrared-heated studio allows you to deepen your practice, release toxins, and find stillness in the intensity. A transformative, purifying experience.',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=600&fit=crop&q=80',
    features: ['Deep detoxification', 'Flexibility gains', 'Mental clarity', 'Stress release'],
  },
  {
    id: 3,
    title: 'Ashtanga & Mat Pilates',
    subtitle: 'Grounding & Breathwork',
    description:
      'Return to the roots of mindful movement. Through conscious breathwork and flowing sequences on the mat, discover grounding, inner strength, and a deeper connection to your body.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop&q=80',
    features: ['Breath mastery', 'Core grounding', 'Mind-body union', 'Flexibility'],
  },
];

// ─── Classes / Schedule ───────────────────────────────────
export const classes = [
  {
    id: 1,
    title: 'Full Body Control',
    discipline: 'Reformer Pilates',
    instructor: 'Amira B.',
    time: '08:00',
    duration: '55 min',
    level: 'Intermediate',
    day: 'Monday',
    spots: 8,
    spotsLeft: 3,
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=400&fit=crop&q=80',
    description: 'A full-body Reformer session focusing on controlled movements, core engagement, and postural alignment.',
  },
  {
    id: 2,
    title: 'Hot Flow Yoga',
    discipline: 'Hot Yoga',
    instructor: 'Yasmine K.',
    time: '09:30',
    duration: '60 min',
    level: 'All Levels',
    day: 'Monday',
    spots: 12,
    spotsLeft: 5,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&h=400&fit=crop&q=80',
    description: 'A heated vinyasa flow to detoxify, lengthen muscles, and cultivate inner stillness.',
  },
  {
    id: 3,
    title: 'Abs & Booty Up',
    discipline: 'Reformer Pilates',
    instructor: 'Amira B.',
    time: '10:30',
    duration: '45 min',
    level: 'All Levels',
    day: 'Tuesday',
    spots: 8,
    spotsLeft: 1,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop&q=80',
    description: 'Targeted Reformer work to sculpt and lift. Focused on glutes, core, and lower body precision.',
  },
  {
    id: 4,
    title: 'Gentle Pilates',
    discipline: 'Mat Pilates',
    instructor: 'Lina M.',
    time: '11:00',
    duration: '50 min',
    level: 'Beginner',
    day: 'Wednesday',
    spots: 10,
    spotsLeft: 7,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop&q=80',
    description: 'A nurturing mat session perfect for beginners. Focus on breath, alignment, and foundational movements.',
  },
  {
    id: 5,
    title: 'Ashtanga Primary',
    discipline: 'Ashtanga Yoga',
    instructor: 'Yasmine K.',
    time: '07:00',
    duration: '75 min',
    level: 'Intermediate',
    day: 'Thursday',
    spots: 12,
    spotsLeft: 4,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop&q=80',
    description: 'The traditional Ashtanga primary series. A moving meditation of breath-synchronized postures.',
  },
  {
    id: 6,
    title: 'Hot Pilates Sculpt',
    discipline: 'Hot Pilates',
    instructor: 'Amira B.',
    time: '17:00',
    duration: '50 min',
    level: 'Advanced',
    day: 'Thursday',
    spots: 10,
    spotsLeft: 2,
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&h=400&fit=crop&q=80',
    description: 'High-intensity Pilates in a heated room. Sculpt, sweat, and transform.',
  },
  {
    id: 7,
    title: 'Breathwork & Restore',
    discipline: 'Breathwork',
    instructor: 'Lina M.',
    time: '18:30',
    duration: '45 min',
    level: 'All Levels',
    day: 'Friday',
    spots: 15,
    spotsLeft: 9,
    image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=600&h=400&fit=crop&q=80',
    description: 'A restorative session of guided breathwork and gentle stretching to close the week with calm.',
  },
  {
    id: 8,
    title: 'Weekend Reformer Flow',
    discipline: 'Reformer Pilates',
    instructor: 'Amira B.',
    time: '09:00',
    duration: '55 min',
    level: 'All Levels',
    day: 'Saturday',
    spots: 8,
    spotsLeft: 0,
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=400&fit=crop&q=80',
    description: 'A flowing, energizing Reformer class to start your weekend with intention.',
  },
];

// ─── Instructors ──────────────────────────────────────────
export const instructors = [
  {
    id: 1,
    name: 'Amira B.',
    role: 'Founder & Lead Instructor',
    specialty: 'Reformer Pilates · Hot Pilates',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&h=800&fit=crop&q=80',
    bio: 'Amira founded Le Studio Contrology with a vision to create a sacred space for women in Algiers. With over 10 years of practice and certifications from BASI Pilates and the Balanced Body University, she brings precision, warmth, and an unwavering commitment to each client\'s journey.',
    certifications: ['BASI Pilates Certified', 'Balanced Body Reformer', 'Hot Pilates Instructor'],
    philosophy: 'Movement should feel like coming home to your body.',
  },
  {
    id: 2,
    name: 'Yasmine K.',
    role: 'Senior Yoga Instructor',
    specialty: 'Hot Yoga · Ashtanga · Breathwork',
    image: 'https://images.unsplash.com/photo-1609942571720-c80cfb7328f9?w=600&h=800&fit=crop&q=80',
    bio: 'Yasmine\'s journey began with Ashtanga in India and evolved into a deep love for heated practice. She creates a space where stillness and intensity coexist—where every breath is an act of self-care.',
    certifications: ['RYT-500 Yoga Alliance', 'Ashtanga Authorized', 'Breathwork Facilitator'],
    philosophy: 'The heat doesn\'t break you. It reveals you.',
  },
  {
    id: 3,
    name: 'Lina M.',
    role: 'Mat Pilates & Wellness Coach',
    specialty: 'Mat Pilates · Gentle Flow · Breathwork',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop&q=80',
    bio: 'Lina believes in the power of slow, intentional movement. She specializes in working with beginners and those recovering from injury, creating a compassionate, judgment-free environment.',
    certifications: ['Stott Pilates Mat', 'Restorative Yoga', 'Prenatal Certified'],
    philosophy: 'Softness is not weakness. It is the deepest kind of strength.',
  },
];

// ─── Studio Rules ─────────────────────────────────────────
export const studioRules = [
  {
    id: 1,
    icon: 'sock',
    title: 'Grip Socks Required',
    description: 'For hygiene and safety on all equipment. Available for purchase at reception.',
  },
  {
    id: 2,
    icon: 'phone-off',
    title: 'Silence Your Phone',
    description: 'The studio is a mindful space. Please switch to silent mode before entering.',
  },
  {
    id: 3,
    icon: 'clock',
    title: 'Arrive 5 Minutes Early',
    description: 'Late arrivals may not be admitted to maintain the flow of the class.',
  },
  {
    id: 4,
    icon: 'droplets',
    title: 'Bring Your Water',
    description: 'Stay hydrated. Bring a reusable water bottle to every session.',
  },
  {
    id: 5,
    icon: 'towel',
    title: 'Bring a Towel',
    description: 'Essential for hot classes. A small towel for the mat and a larger one for yourself.',
  },
  {
    id: 6,
    icon: 'heart',
    title: 'Respect the Space',
    description: 'This is a women-only safe haven. Kindness, respect, and mindfulness are expected.',
  },
];

// ─── Membership Plans ─────────────────────────────────────
export const membershipPlans = [
  {
    id: 1,
    name: 'Découverte',
    nameEn: 'Discovery',
    price: '4,500',
    currency: 'DA',
    period: 'month',
    description: 'Perfect for those beginning their journey.',
    features: [
      '4 group classes per month',
      'Mat Pilates & Yoga access',
      'Online booking',
      'Welcome gift bag',
    ],
  },
  {
    id: 2,
    name: 'Équilibre',
    nameEn: 'Balance',
    price: '8,500',
    currency: 'DA',
    period: 'month',
    featured: true,
    description: 'Our most popular choice for committed practitioners.',
    features: [
      'Unlimited group classes',
      'Reformer & Hot classes included',
      '1 private session per month',
      'Priority booking',
      'Guest pass (1/month)',
    ],
  },
  {
    id: 3,
    name: 'Harmonie',
    nameEn: 'Harmony',
    price: '14,000',
    currency: 'DA',
    period: 'month',
    description: 'The complete, all-access experience.',
    features: [
      'Unlimited all classes & workshops',
      '4 private sessions per month',
      'Personalized wellness program',
      'Complimentary grip socks & towels',
      'VIP locker & amenities',
      'Priority for special events',
    ],
  },
];

// ─── Schedule Days ────────────────────────────────────────
export const scheduleDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// ─── Home Media (Cloudinary-ready) ───────────────────────
export const homeHeroMedia = [
  {
    id: 1,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1800&h=1000&fit=crop&q=80',
    alt: 'Women pilates session in studio',
    eyebrow: 'Women-Only Studio · Algiers',
    title: 'Strength in control,',
    accent: 'beauty in flow.',
    description:
      'A sanctuary for mindful movement in the heart of Algiers. Reformer Pilates, Hot Yoga, and breathwork designed for women who seek strength through intention.',
    primaryLabel: 'Book a Session',
    primaryLink: '/booking',
    secondaryLabel: 'Explore Classes',
    secondaryLink: '/classes',
  },
  {
    id: 2,
    type: 'video',
    url: 'https://player.vimeo.com/external/435511235.sd.mp4?s=0bbf5f8f2f35f3f6a67d01d7a2d8e14ce2f3af6f&profile_id=164&oauth2_token_id=57447761',
    poster: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1800&h=1000&fit=crop&q=80',
    alt: 'Reformer pilates flow',
    eyebrow: 'Reformer · Heat · Breath',
    title: 'Move with precision,',
    accent: 'train with purpose.',
    description:
      'Our coaching method combines structure and softness so every movement feels intentional, safe, and deeply effective.',
    primaryLabel: 'Start Booking',
    primaryLink: '/booking',
    secondaryLabel: 'Meet the Coaches',
    secondaryLink: '/coaches',
  },
  {
    id: 3,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1800&h=1000&fit=crop&q=80',
    alt: 'Pilates studio interior',
    eyebrow: 'Small Group Experience',
    title: 'Consistency creates',
    accent: 'lasting change.',
    description:
      'From beginner foundations to advanced sequences, each class is crafted for clear progression and measurable confidence.',
    primaryLabel: 'View Weekly Plan',
    primaryLink: '/booking',
    secondaryLabel: 'Read About Us',
    secondaryLink: '/#about',
  },
];

export const weeklyPlanning = [
  { day: 'Monday', theme: 'Core Foundations', window: '08:00 - 12:00' },
  { day: 'Tuesday', theme: 'Lower Body Focus', window: '09:00 - 18:30' },
  { day: 'Wednesday', theme: 'Beginner Flow', window: '10:00 - 20:00' },
  { day: 'Thursday', theme: 'Heat & Endurance', window: '07:00 - 19:30' },
  { day: 'Friday', theme: 'Restore & Breath', window: '11:00 - 21:00' },
  { day: 'Saturday', theme: 'Weekend Reformer', window: '09:00 - 15:00' },
];

export const homeFaqs = [
  {
    id: 1,
    question: 'Do I need prior experience to join classes?',
    answer:
      'No. We offer beginner-friendly sessions and clear progressions. Your coach will adapt cues and options to your level.',
  },
  {
    id: 2,
    question: 'What should I bring for my first session?',
    answer:
      'Bring comfortable activewear, water, and grip socks. For heated sessions, add a small towel.',
  },
  {
    id: 3,
    question: 'How do booking and cancellation work?',
    answer:
      'You can reserve through the booking page. Cancellations are accepted up to 12 hours before class start time.',
  },
  {
    id: 4,
    question: 'Is the studio women-only?',
    answer:
      'Yes. Le Studio Contrology is a women-only safe space designed for supportive, mindful training.',
  },
];

// ─── Class Catalog (Level + Pricing) ─────────────────────
export const classCatalogByLevel = [
  {
    level: 'Beginner',
    intro:
      'Start with structure, breath cues, and low-impact progressions that build strong foundations.',
    offers: [
      {
        id: 'beg-1',
        title: 'Foundations Reformer',
        discipline: 'Reformer Pilates',
        duration: '50 min',
        coach: 'Lina M.',
        price: '2200',
        image:
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&h=450&fit=crop&q=80',
        description:
          'Technique-focused intro class covering breath, carriage control, and safe alignment.',
      },
      {
        id: 'beg-2',
        title: 'Gentle Mat Flow',
        discipline: 'Mat Pilates',
        duration: '45 min',
        coach: 'Lina M.',
        price: '1800',
        image:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&h=450&fit=crop&q=80',
        description:
          'Low-impact flow to improve posture, mobility, and confidence in movement basics.',
      },
    ],
  },
  {
    level: 'Intermediate',
    intro:
      'Progressive sessions designed to deepen control, endurance, and full-body integration.',
    offers: [
      {
        id: 'int-1',
        title: 'Full Body Control',
        discipline: 'Reformer Pilates',
        duration: '55 min',
        coach: 'Amira B.',
        price: '2600',
        image:
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=700&h=450&fit=crop&q=80',
        description:
          'Build integrated strength through dynamic sequencing and controlled tempo work.',
      },
      {
        id: 'int-2',
        title: 'Hot Flow Yoga',
        discipline: 'Hot Yoga',
        duration: '60 min',
        coach: 'Yasmine K.',
        price: '2400',
        image:
          'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=700&h=450&fit=crop&q=80',
        description:
          'Heat-assisted vinyasa practice for stamina, focus, and controlled mobility.',
      },
    ],
  },
  {
    level: 'Advanced',
    intro:
      'High-intensity formats for experienced members seeking precision under fatigue and performance gains.',
    offers: [
      {
        id: 'adv-1',
        title: 'Hot Pilates Sculpt',
        discipline: 'Hot Pilates',
        duration: '50 min',
        coach: 'Amira B.',
        price: '2800',
        image:
          'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=700&h=450&fit=crop&q=80',
        description:
          'Athletic conditioning in a heated room with sculpt-focused resistance progressions.',
      },
      {
        id: 'adv-2',
        title: 'Ashtanga Primary',
        discipline: 'Ashtanga Yoga',
        duration: '75 min',
        coach: 'Yasmine K.',
        price: '3000',
        image:
          'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&h=450&fit=crop&q=80',
        description:
          'Structured primary series for discipline, breath stamina, and deeper mind-body control.',
      },
    ],
  },
];
