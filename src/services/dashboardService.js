export function getMockDashboard(user) {
  return {
    rewardPoints: user?.rewardPoints ?? 0,
    upcomingBookings: [
      {
        id: 'up-1',
        className: 'Full Body Control',
        date: 'Mar 20, 2026',
        time: '08:00',
        coach: 'Amira B.',
      },
      {
        id: 'up-2',
        className: 'Hot Flow Yoga',
        date: 'Mar 22, 2026',
        time: '09:30',
        coach: 'Yasmine K.',
      },
    ],
    bookingHistory: [
      {
        id: 'hist-1',
        className: 'Breathwork & Restore',
        date: 'Mar 12, 2026',
        status: 'Completed',
      },
      {
        id: 'hist-2',
        className: 'Foundations Reformer',
        date: 'Mar 09, 2026',
        status: 'Completed',
      },
      {
        id: 'hist-3',
        className: 'Hot Pilates Sculpt',
        date: 'Mar 05, 2026',
        status: 'Completed',
      },
    ],
  };
}
