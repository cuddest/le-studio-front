// Frontend service to fetch coaches from backend API
const normalizeApiBase = (base) => {
  if (!base) return 'https://le-studio-api.onrender.com/api/v1';
  // Remove trailing slash if present
  base = base.replace(/\/$/, '');
  // If base doesn't end with /api/v1, append it
  if (!base.endsWith('/api/v1')) {
    base += '/api/v1';
  }
  return base;
};
const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE);

export async function listCoaches() {
  if (!API_BASE) {
    throw new Error('API base URL not configured. Set VITE_API_BASE in .env');
  }

  const res = await fetch(`${API_BASE}/coaches`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to load coaches (${res.status})`);
  }

  const payload = await res.json().catch(() => ({}));
  const list = payload.data || payload || [];

  return (list || []).map((c) => ({
    id: c.ID || c.id,
    name: `${c.FirstName || c.first_name || ''} ${c.LastName || c.last_name || ''}`.trim() || c.Name || c.name || '',
    role: c.Role || c.role || '',
    specialty: c.Specialties || c.specialties || c.Specialty || c.specialty || '',
    image: c.PhotoURL || c.photo_url || c.image || '',
    bio: c.Bio || c.bio || '',
    certifications: c.Certifications || c.certifications || [],
    philosophy: c.Philosophy || c.philosophy || '',
  }));
}
