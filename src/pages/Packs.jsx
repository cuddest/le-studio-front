import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, CreditCard, BadgeDollarSign } from 'lucide-react';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { listPackTemplates, purchasePack } from '../services/userPackService';
import { useAuth } from '../hooks/useAuth';

function formatPrice(price) {
  const value = Number(price || 0);
  return new Intl.NumberFormat('en-US').format(value);
}

export default function Packs() {
  const navigate = useNavigate();
  const { isAuthenticated, userPacks, packsLoading, refreshPacks } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasingId, setPurchasingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadTemplates() {
      setLoading(true);
      setError('');
      try {
        const list = await listPackTemplates();
        const active = list
          .filter((template) => template.isActive)
          .sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0));
        if (mounted) setTemplates(active);
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load pack templates');
          setTemplates([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadTemplates();

    return () => {
      mounted = false;
    };
  }, []);

  const activeCount = useMemo(() => templates.length, [templates]);

  async function handlePurchase(template) {
    setError('');
    setSuccessMessage('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/packs' } });
      return;
    }

    if (!window.confirm(`Request purchase for ${template.name}?`)) return;

    setPurchasingId(template.id);
    try {
      await purchasePack(template.id);
      setSuccessMessage(`Purchase request submitted for ${template.name}. An admin will confirm payment.`);
      await refreshPacks();
    } catch (err) {
      setError(err.message || 'Failed to request pack purchase');
    } finally {
      setPurchasingId(null);
    }
  }

  return (
    <>
      <section className="bg-charcoal-deep pt-28 pb-16 sm:pt-36 sm:pb-20">
        <Container>
          <div className="max-w-3xl">
            <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.35em] uppercase mb-4">
              Packs
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight">
              Choose a pack that matches your <em className="text-oak">training rhythm</em>
            </h1>
            <p className="mt-5 text-text-warm text-base leading-relaxed max-w-2xl">
              Browse active pack templates, request a purchase, and use your paid sessions to book classes.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-alabaster py-14 sm:py-20">
        <Container>
          <div className="mb-10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.35em] uppercase mb-2">
                  My Packs
                </p>
                <h2 className="font-serif text-3xl text-charcoal tracking-tight">
                  Your current pack balance
                </h2>
              </div>
              {!isAuthenticated && (
                <Link to="/login" className="text-sm font-semibold text-oak hover:text-oak-dark">
                  Login to buy packs
                </Link>
              )}
            </div>

            {packsLoading ? (
              <div className="rounded-lg border border-border-light bg-white p-6 text-sm text-text-muted">
                Loading your packs...
              </div>
            ) : isAuthenticated ? (
              userPacks.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {userPacks.map((pack) => (
                    <Card key={pack.id} className="border-border-light">
                      <p className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-oak mb-2">
                        {pack.status}
                      </p>
                      <h3 className="font-serif text-2xl text-charcoal">{pack.templateName}</h3>
                      <div className="mt-4 space-y-2 text-sm text-text-muted">
                        <p>
                          {pack.remainingSessions} remaining session{pack.remainingSessions !== 1 ? 's' : ''}
                        </p>
                        <p>{pack.isPaid ? 'Payment confirmed' : 'Pending payment confirmation'}</p>
                        <p>
                          {pack.expiresAt ? `Expires ${new Date(pack.expiresAt).toLocaleDateString()}` : 'No expiry listed'}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-border-light bg-white p-6 text-sm text-text-muted">
                  You do not have any packs yet. Buy one below to start booking sessions.
                </div>
              )
            ) : (
              <div className="rounded-lg border border-border-light bg-white p-6 text-sm text-text-muted">
                Login to view and manage your packs.
              </div>
            )}
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="font-sans text-oak text-[10px] font-semibold tracking-[0.35em] uppercase mb-2">
                Available Packs
              </p>
              <h2 className="font-serif text-3xl text-charcoal tracking-tight">
                Purchase a new pack
              </h2>
            </div>
            <Link to="/booking" className="text-sm font-semibold text-oak hover:text-oak-dark">
              Go to Booking
            </Link>
          </div>

          {successMessage && (
            <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 flex gap-2 items-start">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20 text-oak">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : templates.length === 0 ? (
            <div className="rounded-lg border border-border-light bg-white p-8 text-center">
              <CreditCard className="mx-auto text-oak" size={28} />
              <p className="mt-4 font-serif text-2xl text-charcoal">No active packs available</p>
              <p className="mt-2 text-sm text-text-muted">
                Check back later or contact the studio to learn about available packages.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-text-muted">
                  {activeCount} active pack{activeCount !== 1 ? 's' : ''} available
                </p>
                <Link to="/booking" className="text-sm font-semibold text-oak hover:text-oak-dark">
                  Go to Booking
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {templates.map((template) => (
                  <Card key={template.id} className="flex h-full flex-col border-border-light hover:shadow-md transition-shadow duration-300">
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-oak mb-2">
                            Pack Template
                          </p>
                          <h2 className="font-serif text-2xl text-charcoal">{template.name}</h2>
                        </div>
                        <div className="rounded-full bg-alabaster p-3 text-oak">
                          <BadgeDollarSign size={18} />
                        </div>
                      </div>

                      <div className="mt-5 space-y-3 text-sm text-text-muted">
                        <p>{template.numberOfSessions} session{template.numberOfSessions !== 1 ? 's' : ''}</p>
                        <p className="font-medium text-charcoal">DA {formatPrice(template.price)}</p>
                        <p>
                          {template.trainingTypeNames.length > 0
                            ? template.trainingTypeNames.join(' · ')
                            : 'All training types listed by admin'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button
                        variant="oak"
                        className="w-full"
                        disabled={purchasingId === template.id}
                        onClick={() => handlePurchase(template)}
                      >
                        {purchasingId === template.id ? 'Requesting...' : 'Buy Pack'}
                      </Button>
                      <p className="mt-3 text-xs text-text-muted leading-relaxed">
                        Purchase requests are created here. Payment is confirmed by the admin team.
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}
