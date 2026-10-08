import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { BarChart3, Fish, Leaf, MapPinned, ShieldCheck, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { apiRequest } from './lib/api';

type UserRole = 'FISHER' | 'BUYER' | 'ADMIN';

type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('tideledger-token'));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('tideledger-user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('tideledger-token', token);
    } else {
      localStorage.removeItem('tideledger-token');
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('tideledger-token');
    localStorage.removeItem('tideledger-user');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<LandingPage user={user} />} />
        <Route path="/login" element={<LoginPage onLogin={setUser} onToken={setToken} />} />
        <Route path="/register" element={<RegisterPage onLogin={setUser} onToken={setToken} />} />
        <Route path="/verify/:token" element={<VerificationPage />} />
        <Route path="/dashboard" element={user ? <DashboardRouter user={user} /> : <LandingPage user={user} />} />
        <Route path="/dashboard/fisher" element={user ? <FisherDashboard user={user} /> : <LandingPage user={user} />} />
        <Route path="/dashboard/buyer" element={user ? <BuyerDashboard user={user} /> : <LandingPage user={user} />} />
        <Route path="/dashboard/admin" element={user ? <AdminDashboard user={user} /> : <LandingPage user={user} />} />
      </Routes>
      {loading && <div className="fixed inset-0 bg-slate-900/10" />}
    </div>
  );
}

function Header({ user, logout }: { user: AppUser | null; logout: () => void }) {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-500 text-white">
            <Fish className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">TideLedger</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Every catch, with its story verified.</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 md:flex">
          <Link to="/">Home</Link>
          {user && <Link to="/dashboard">Dashboard</Link>}
          <Link to="/verify/TL-2026-000001">Traceability</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 sm:inline-flex">{user.role}</span>
              <button className="btn-secondary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function LandingPage({ user }: { user: AppUser | null }) {
  const navigate = useNavigate();
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="badge bg-ocean-100 text-ocean-700">Sustainable coastal governance</span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 md:text-6xl">Every catch, with its story verified.</h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">TideLedger helps fishers, buyers, and regulators verify catch origin, manage quotas, monitor compliance, and build transparent traceability from sea to shore.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="btn-primary" onClick={() => navigate(user ? '/dashboard' : '/register')}>{user ? 'Open Dashboard' : 'Get Started'}</button>
              <button className="btn-secondary" onClick={() => navigate('/verify/TL-2026-000001')}>Explore Marketplace</button>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="grid gap-4 md:grid-cols-2">
              <StatCard icon={<ShieldCheck className="h-5 w-5 text-ocean-700" />} label="Trust Score" value="91" accent="bg-emerald-100 text-emerald-700" />
              <StatCard icon={<MapPinned className="h-5 w-5 text-ocean-700" />} label="Zone Verified" value="94%" accent="bg-sky-100 text-sky-700" />
              <StatCard icon={<Leaf className="h-5 w-5 text-ocean-700" />} label="Quota Used" value="68%" accent="bg-amber-100 text-amber-700" />
              <StatCard icon={<BarChart3 className="h-5 w-5 text-ocean-700" />} label="Traceability" value="12K" accent="bg-violet-100 text-violet-700" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean-700">Platform features</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Built for coastal communities and responsible seafood markets</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard title="Smart Catch Recording" description="Capture GPS, species, quota, and catch metadata with offline drafts and simple fisher workflows." />
          <FeatureCard title="Explainable Trust Engine" description="Every score is broken down into transparent rule-based evidence and compliance checks." />
          <FeatureCard title="QR Traceability" description="Public verification links show trust status, fishing context, and event history without exposing personal data." />
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="text-3xl font-bold">Sustainability at the core</h3>
          <p className="mt-3 max-w-2xl text-slate-300">TideLedger translates catch records, quotas, and fishing-zone pressure into actionable marine resource monitoring so regulators and communities can protect coastal livelihoods.</p>
        </div>
      </section>
    </div>
  );
}

function LoginPage({ onLogin, onToken }: { onLogin: (u: AppUser) => void; onToken: (t: string) => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('fisher@tideledger.demo');
  const [password, setPassword] = useState('Fisher@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest<{ token: string; user: AppUser }>(`/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('tideledger-user', JSON.stringify(data.user));
      onLogin(data.user);
      onToken(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-8">
      <div className="card p-6">
        <h2 className="mb-6 text-2xl font-bold">Welcome back</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full rounded-xl border border-slate-300 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" className="w-full rounded-xl border border-slate-300 px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
      </div>
    </div>
  );
}

function RegisterPage({ onLogin, onToken }: { onLogin: (u: AppUser) => void; onToken: (t: string) => void }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: 'Demo Fisher', email: 'demo@tideledger.demo', password: 'Demo@123', role: 'FISHER' });
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const data = await apiRequest<{ token: string; user: AppUser }>(`/auth/register`, {
        method: 'POST',
        body: JSON.stringify({ ...form, fisherId: 'FL-2002', licenseNumber: 'LIC-2002', fishingRegion: 'Kanyakumari' }),
      });
      localStorage.setItem('tideledger-user', JSON.stringify(data.user));
      onLogin(data.user);
      onToken(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to register');
    }
  };

  return (
    <div className="mx-auto max-w-lg p-8">
      <div className="card p-6">
        <h2 className="mb-6 text-2xl font-bold">Create your account</h2>
        <form className="space-y-4" onSubmit={submit}>
          <input className="w-full rounded-xl border border-slate-300 px-3 py-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
          <input className="w-full rounded-xl border border-slate-300 px-3 py-2" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" />
          <input type="password" className="w-full rounded-xl border border-slate-300 px-3 py-2" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" />
          <select className="w-full rounded-xl border border-slate-300 px-3 py-2" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as UserRole })}>
            <option value="FISHER">Fisher</option>
            <option value="BUYER">Buyer</option>
          </select>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button className="btn-primary w-full">Create account</button>
        </form>
      </div>
    </div>
  );
}

function DashboardRouter({ user }: { user: AppUser }) {
  const location = useLocation();
  useEffect(() => {
    if (user.role === 'FISHER') window.location.href = '/dashboard/fisher';
    if (user.role === 'BUYER') window.location.href = '/dashboard/buyer';
    if (user.role === 'ADMIN') window.location.href = '/dashboard/admin';
  }, [user]);
  return <div className="p-10 text-center text-slate-600">Redirecting to your dashboard...</div>;
}

function FisherDashboard({ user }: { user: AppUser }) {
  const [summary, setSummary] = useState<any>(null);
  const [species, setSpecies] = useState<any[]>([]);
  const [showCatchForm, setShowCatchForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    speciesId: '',
    quantity: '42',
    unit: 'kg',
    catchDate: new Date().toISOString().slice(0, 10),
    locationLat: '8.45',
    locationLng: '77.82',
    fishingZone: 'North Coast',
    notes: '',
  });

  useEffect(() => {
    apiRequest('/dashboard')
      .then((data) => setSummary(data))
      .catch(() => setSummary({ counts: { totalCatch: 12, totalFishers: 387 }, catches: [] }));

    apiRequest<any[]>('/species')
      .then((data) => setSpecies(data))
      .catch(() => setSpecies([]));
  }, []);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setFormError('GPS is not available on this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          locationLat: position.coords.latitude.toString(),
          locationLng: position.coords.longitude.toString(),
        }));
        setFormError('');
      },
      () => {
        setFormError('GPS permission was denied. Please enter a demo location manually.');
      },
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError('');
    setSuccess('');

    try {
      const payload = {
        speciesId: form.speciesId || species[0]?.id,
        quantity: Number(form.quantity),
        unit: form.unit,
        catchDate: form.catchDate,
        locationLat: Number(form.locationLat),
        locationLng: Number(form.locationLng),
        fishingZone: form.fishingZone,
        notes: form.notes,
      };

      const response = await apiRequest<any>('/catches', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSuccess(`Catch recorded successfully. Trust score: ${response.trust?.score ?? 0}.`);
      setShowCatchForm(false);
      setForm({
        speciesId: species[0]?.id ?? '',
        quantity: '42',
        unit: 'kg',
        catchDate: new Date().toISOString().slice(0, 10),
        locationLat: '8.45',
        locationLng: '77.82',
        fishingZone: 'North Coast',
        notes: '',
      });

      const latest = await apiRequest('/dashboard');
      setSummary(latest);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to record catch.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Good morning, {user.name}</p>
          <h2 className="text-3xl font-bold">Fisher dashboard</h2>
        </div>
        <button className="btn-primary" onClick={() => setShowCatchForm((prev) => !prev)}>+ Record Catch</button>
      </div>

      {showCatchForm && (
        <div className="mb-6 card p-5">
          <h3 className="mb-4 text-xl font-semibold">Record a catch</h3>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Species</label>
              <select value={form.speciesId || species[0]?.id || ''} onChange={(e) => setForm({ ...form, speciesId: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2">
                {species.map((item) => (
                  <option key={item.id} value={item.id}>{item.commonName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Quantity</label>
              <input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Unit</label>
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2">
                <option value="kg">kg</option>
                <option value="boxes">boxes</option>
                <option value="count">count</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Date</label>
              <input type="date" value={form.catchDate} onChange={(e) => setForm({ ...form, catchDate: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Latitude</label>
              <input value={form.locationLat} onChange={(e) => setForm({ ...form, locationLat: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Longitude</label>
              <input value={form.locationLng} onChange={(e) => setForm({ ...form, locationLng: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium">Fishing zone</label>
                <button type="button" onClick={handleUseLocation} className="btn-secondary text-xs">Use my GPS</button>
              </div>
              <input value={form.fishingZone} onChange={(e) => setForm({ ...form, fishingZone: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2" rows={3} placeholder="Optional note about the catch" />
            </div>

            {formError && <div className="md:col-span-2 text-sm text-red-600">{formError}</div>}
            {success && <div className="md:col-span-2 text-sm text-emerald-700">{success}</div>}

            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Saving...' : 'Submit catch'}</button>
              <button type="button" onClick={() => setShowCatchForm(false)} className="btn-secondary">Close</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Trust Score" value={`${summary?.counts?.totalCatch ? '91' : '—'}`} accent="bg-emerald-100 text-emerald-700" />
        <StatCard icon={<Leaf className="h-5 w-5" />} label="Quota Remaining" value="2,200 kg" accent="bg-sky-100 text-sky-700" />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Recent Catch" value={`${summary?.catches?.[0]?.quantity ?? 0} kg`} accent="bg-amber-100 text-amber-700" />
        <StatCard icon={<Users className="h-5 w-5" />} label="Total Records" value={`${summary?.counts?.totalCatch ?? 0}`} accent="bg-red-100 text-red-700" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-3 text-lg font-semibold">Recent catch records</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            {(summary?.catches ?? []).slice(0, 4).map((catchItem: any) => (
              <li key={catchItem.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span>{catchItem.species?.commonName ?? 'Unknown species'} · {catchItem.quantity} {catchItem.unit}</span>
                <span className="badge bg-emerald-100 text-emerald-700">{catchItem.trustStatus ?? 'VERIFIED'}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h3 className="mb-3 text-lg font-semibold">Notifications</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="rounded-xl bg-slate-50 p-3">Quota usage is nearing 80%.</li>
            <li className="rounded-xl bg-slate-50 p-3">Weather advisory updated for offshore zone.</li>
            <li className="rounded-xl bg-slate-50 p-3">Your QR batch TL-2026-000001 is live.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function BuyerDashboard({ user }: { user: AppUser }) {
  const [listings, setListings] = useState<any[]>([]);
  useEffect(() => {
    apiRequest<any[]>('/listings')
      .then((data) => setListings(data))
      .catch(() => setListings([]));
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h2 className="mb-6 text-3xl font-bold">Marketplace overview</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={<ShoppingCart className="h-5 w-5" />} label="Available Seafood" value={`${listings.length}`} accent="bg-sky-100 text-sky-700" />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Price Trend" value="+8.4%" accent="bg-emerald-100 text-emerald-700" />
        <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Traceability" value="98%" accent="bg-violet-100 text-violet-700" />
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {listings.slice(0, 6).map((listing, index) => (
          <div key={index} className="card p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-lg font-semibold">{listing.title ?? 'Fresh Seafood'}</span>
              <span className="badge bg-emerald-100 text-emerald-700">{listing.status ?? 'ACTIVE'}</span>
            </div>
            <p className="text-sm text-slate-500">{listing.species?.commonName ?? 'Sardine'} · {listing.quantity} kg</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xl font-bold">₹{listing.pricePerKg ?? 140}/kg</span>
              <button className="btn-primary">Buy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard({ user }: { user: AppUser }) {
  const [overview, setOverview] = useState<any>({});
  useEffect(() => {
    apiRequest('/admin/overview')
      .then((data) => setOverview(data))
      .catch(() => setOverview({ totalFishers: 420, activeFishers: 298, totalCatch: 14200, totalSpecies: 7, activeListings: 36, pendingOrders: 8, openViolations: 4 }));
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h2 className="mb-6 text-3xl font-bold">Admin dashboard</h2>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-7">
        <StatCard icon={<Users className="h-5 w-5" />} label="Total Fishers" value={`${overview.totalFishers ?? 420}`} accent="bg-sky-100 text-sky-700" />
        <StatCard icon={<BarChart3 className="h-5 w-5" />} label="Total Catch" value={`${overview.totalCatch ?? 14200}`} accent="bg-violet-100 text-violet-700" />
        <StatCard icon={<Fish className="h-5 w-5" />} label="Species" value={`${overview.totalSpecies ?? 7}`} accent="bg-emerald-100 text-emerald-700" />
        <StatCard icon={<Leaf className="h-5 w-5" />} label="Quota" value="68%" accent="bg-amber-100 text-amber-700" />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Listings" value={`${overview.activeListings ?? 36}`} accent="bg-pink-100 text-pink-700" />
        <StatCard icon={<ShoppingCart className="h-5 w-5" />} label="Orders" value={`${overview.pendingOrders ?? 8}`} accent="bg-indigo-100 text-indigo-700" />
        <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Violations" value={`${overview.openViolations ?? 4}`} accent="bg-red-100 text-red-700" />
      </div>
    </div>
  );
}

function VerificationPage() {
  const { token } = useParams();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest(`/public/traceability/${token}`)
      .then((payload) => setData(payload))
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="card p-6">
        <h2 className="mb-4 text-2xl font-bold">Public verification</h2>
        {error ? <p className="text-red-600">{error}</p> : data ? (
          <div className="space-y-4">
            <p className="text-xl font-semibold text-emerald-700">✓ Valid TideLedger Batch</p>
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Batch ID" value={data.qrCodeToken} />
              <InfoRow label="Species" value={data.species} />
              <InfoRow label="Catch Date" value={new Date(data.catchDate).toLocaleDateString()} />
              <InfoRow label="General Region" value={data.fishingZone} />
              <InfoRow label="Trust Status" value={data.trustStatus} />
              <InfoRow label="Quantity" value={`${data.quantity} kg`} />
            </div>
          </div>
        ) : <p>Loading verification...</p>}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="card p-4">
      <div className={`mb-3 inline-flex rounded-xl p-2 ${accent}`}>{icon}</div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="card p-6">
      <div className="mb-4 inline-flex rounded-xl bg-ocean-100 p-3 text-ocean-700"><ShieldCheck className="h-5 w-5"/></div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-slate-600">{description}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</div><div className="mt-1 font-semibold text-slate-800">{value}</div></div>;
}

export default App;
