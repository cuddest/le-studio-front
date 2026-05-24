import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getDashboard } from '../services/dashboardService';

export function useUserDashboard() {
  const { token, user } = useAuth();
  const [dashboard, setDashboard] = useState({ rewardPoints: 0, upcomingBookings: [], bookingHistory: [] });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getDashboard(token);
        if (!mounted) return;
        setDashboard(data);
      } catch (e) {
        if (!mounted) return;
        setDashboard({ rewardPoints: 0, upcomingBookings: [], bookingHistory: [] });
      }
    }
    load();
    return () => (mounted = false);
  }, [token, user]);

  return dashboard;
}
