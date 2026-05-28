import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    gender: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        gender: form.gender,
      };
      await register(payload);
      navigate('/profile', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-charcoal-deep pt-28 pb-16 sm:pt-36 sm:pb-20">
        <Container>
          <div className="max-w-2xl">
            <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.35em] uppercase mb-4">Register</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-white tracking-tight">Create your account</h1>
            <p className="mt-4 text-text-warm leading-relaxed max-w-md">
              Join the studio to manage bookings, collect rewards, and personalize your training journey.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-alabaster py-12 sm:py-16">
        <Container>
          <form onSubmit={onSubmit} className="max-w-lg mx-auto bg-white border border-border-light rounded p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <label className="block">
                <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-text-muted">First Name</span>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
                  className="mt-2 w-full rounded border border-border-light bg-alabaster px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-oak"
                  required
                />
              </label>

              <label className="block">
                <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-text-muted">Last Name</span>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
                  className="mt-2 w-full rounded border border-border-light bg-alabaster px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-oak"
                  required
                />
              </label>
            </div>

            <label className="block mb-4">
              <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-text-muted">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="mt-2 w-full rounded border border-border-light bg-alabaster px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-oak"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-text-muted">Phone (optional)</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="mt-2 w-full rounded border border-border-light bg-alabaster px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-oak"
              />
            </label>

            <label className="block mb-4">
              <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-text-muted">Gender (optional)</span>
              <select
                value={form.gender}
                onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
                className="mt-2 w-full rounded border border-border-light bg-alabaster px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-oak"
              >
                <option value="">Prefer not to say</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </label>

            <label className="block mb-4">
              <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-text-muted">Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="mt-2 w-full rounded border border-border-light bg-alabaster px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-oak"
                required
                minLength={8}
              />
            </label>

            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>

            <p className="mt-5 text-sm text-text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-oak hover:text-oak-dark transition-colors">Login</Link>
            </p>
          </form>
        </Container>
      </section>
    </>
  );
}
