import { useMemo } from 'react';
import { getMockDashboard } from '../services/dashboardService';

export function useUserDashboard(user) {
  return useMemo(() => getMockDashboard(user), [user]);
}
