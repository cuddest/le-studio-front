import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = location.state?.from || '/profile';

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(form);
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-charcoal-deep pt-28 pb-16 sm:pt-36 sm:pb-20">
        <Container>
          <div className="max-w-2xl">
            <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.35em] uppercase mb-4">
              Login
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-white tracking-tight">
              Welcome back
            </h1>
            <p className="mt-4 text-text-warm leading-relaxed max-w-md">
              Sign in to manage your bookings, rewards, and personal dashboard.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-alabaster py-12 sm:py-16">
        <Container>
          <form onSubmit={onSubmit} className="max-w-lg mx-auto bg-white border border-border-light rounded p-6 sm:p-8">
            <label className="block mb-4">
              <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-text-muted">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="mt-2 w-full rounded border border-border-light bg-alabaster px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-oak"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-text-muted">Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="mt-2 w-full rounded border border-border-light bg-alabaster px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-oak"
                required
              />
            </label>

            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>

            <p className="mt-5 text-sm text-text-muted">
              New here?{' '}
              <Link to="/register" className="text-oak hover:text-oak-dark transition-colors">
                Create an account
              </Link>
            </p>
          </form>
        </Container>
      </section>
    </>
  );
}
