import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Classes from './pages/Classes';
import Coaches from './pages/Coaches';
import Packs from './pages/Packs';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="classes" element={<Classes />} />
        <Route path="packs" element={<Packs />} />
        <Route path="booking" element={<Booking />} />
        <Route path="coaches" element={<Coaches />} />
        <Route path="trainers" element={<Coaches />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="profile"
          element={(
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          )}
        />
        <Route
          path="my-bookings"
          element={(
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          )}
        />
      </Route>
    </Routes>
  );
}
