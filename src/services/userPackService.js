// Frontend service to manage user packs and training type compatibility
import { getStoredToken } from './authStorage';

const normalizeApiBase = (base) => {
  if (!base) return 'https://le-studio-api.onrender.com/api/v1';
  base = base.replace(/\/$/, '');
  if (!base.endsWith('/api/v1')) {
    base += '/api/v1';
  }
  return base;
};
const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE);

/**
 * Fetch available pack templates users can purchase
 */
export async function listPackTemplates() {
  if (!API_BASE) {
    throw new Error('API base URL not configured. Set VITE_API_BASE in .env');
  }

  const res = await fetch(`${API_BASE}/pack-templates`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to load pack templates (${res.status})`);
  }

  const payload = await res.json().catch(() => ({}));
  const list = payload.data || payload || [];

  return (list || []).map((template) => ({
    id: template.ID || template.id,
    name: template.Name || template.name || 'Pack',
    numberOfSessions: template.NumberOfSessions ?? template.number_of_sessions ?? 0,
    price: template.Price ?? template.price ?? 0,
    displayOrder: template.DisplayOrder ?? template.display_order ?? 0,
    isActive: template.IsActive ?? template.is_active ?? false,
    trainingTypeIds: extractTrainingTypeIdsFromTemplate(template),
    trainingTypeNames: extractTrainingTypeNamesFromTemplate(template),
  }));
}

/**
 * Request purchase of a pack template for the current user.
 * The backend creates a user-pack record; it may remain pending until payment is confirmed.
 */
export async function purchasePack(packTemplateId) {
  if (!API_BASE) {
    throw new Error('API base URL not configured. Set VITE_API_BASE in .env');
  }

  const token = getStoredToken();
  if (!token) {
    throw new Error('Not authenticated. Please login first.');
  }

  const res = await fetch(`${API_BASE}/user-packs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      pack_template_id: Number(packTemplateId),
      is_paid: false,
    }),
  });

  if (res.status === 401) {
    throw new Error('Unauthorized. Please login again.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to purchase pack (${res.status})`);
  }

  const payload = await res.json().catch(() => ({}));
  const pack = payload.data || payload;

  return {
    id: pack.ID || pack.id,
    userId: pack.UserID || pack.user_id,
    templateId: pack.PackTemplateID || pack.pack_template_id,
    totalSessions: pack.TotalSessions ?? pack.total_sessions ?? 0,
    usedSessions: pack.UsedSessions ?? pack.used_sessions ?? 0,
    remainingSessions: (pack.TotalSessions ?? pack.total_sessions ?? 0) - (pack.UsedSessions ?? pack.used_sessions ?? 0),
    isPaid: pack.IsPaid ?? pack.is_paid ?? false,
    status: pack.Status || pack.status || 'pending',
    createdAt: pack.CreatedAt || pack.created_at || '',
  };
}

/**
 * Fetch current user's packs (active ones with session counts)
 */
export async function listUserPacks() {
  if (!API_BASE) {
    throw new Error('API base URL not configured. Set VITE_API_BASE in .env');
  }

  const token = getStoredToken();
  if (!token) {
    throw new Error('Not authenticated. Please login first.');
  }

  const res = await fetch(`${API_BASE}/users/me/packs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    throw new Error('Unauthorized. Please login again.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to load packs (${res.status})`);
  }

  const payload = await res.json().catch(() => ({}));
  const list = payload.data || payload || [];

  return (list || []).map((p) => ({
    id: p.ID || p.id,
    userId: p.UserID || p.user_id,
    templateId: p.PackTemplateID || p.pack_template_id,
    templateName: p.PackTemplate?.Name || p.pack_template?.name || p.PackName || 'Pack',
    totalSessions: p.TotalSessions ?? p.total_sessions ?? 0,
    usedSessions: p.UsedSessions ?? p.used_sessions ?? 0,
    remainingSessions: (p.TotalSessions ?? p.total_sessions ?? 0) - (p.UsedSessions ?? p.used_sessions ?? 0),
    isPaid: p.IsPaid ?? p.is_paid ?? false,
    status: p.Status || p.status || 'pending', // pending, active, exhausted
    trainingTypeIds: extractTrainingTypeIds(p),
    createdAt: p.CreatedAt || p.created_at || '',
    expiresAt: p.ExpiresAt || p.expires_at || null,
  }));
}

/**
 * Extract training type IDs from various API response shapes
 */
function extractTrainingTypeIds(pack) {
  const types = [];

  // Try PackTemplate.TrainingTypes (array of objects)
  if (pack.PackTemplate?.TrainingTypes) {
    pack.PackTemplate.TrainingTypes.forEach((t) => {
      if (t.ID || t.id) types.push(String(t.ID || t.id));
    });
  }

  // Try PackTemplate.training_types (array of objects or ids)
  if (pack.PackTemplate?.training_types && Array.isArray(pack.PackTemplate.training_types)) {
    pack.PackTemplate.training_types.forEach((t) => {
      if (typeof t === 'object') {
        if (t.ID || t.id) types.push(String(t.ID || t.id));
      } else if (t) {
        types.push(String(t));
      }
    });
  }

  // Try direct training_type_ids on pack
  if (pack.training_type_ids && Array.isArray(pack.training_type_ids)) {
    pack.training_type_ids.forEach((id) => {
      if (id) types.push(String(id));
    });
  }

  return [...new Set(types)]; // dedup
}

function extractTrainingTypeIdsFromTemplate(template) {
  const types = [];

  if (Array.isArray(template.TrainingTypes)) {
    template.TrainingTypes.forEach((t) => {
      if (t.ID || t.id) types.push(String(t.ID || t.id));
    });
  }

  if (Array.isArray(template.training_types)) {
    template.training_types.forEach((t) => {
      if (typeof t === 'object') {
        if (t.ID || t.id) types.push(String(t.ID || t.id));
      } else if (t) {
        types.push(String(t));
      }
    });
  }

  return [...new Set(types)];
}

function extractTrainingTypeNamesFromTemplate(template) {
  const names = [];

  if (Array.isArray(template.TrainingTypes)) {
    template.TrainingTypes.forEach((t) => {
      const name = t.Name || t.name || t.Code || '';
      if (name) names.push(name);
    });
  }

  if (Array.isArray(template.training_types)) {
    template.training_types.forEach((t) => {
      if (typeof t === 'object') {
        const name = t.Name || t.name || t.Code || '';
        if (name) names.push(name);
      }
    });
  }

  return [...new Set(names)];
}

/**
 * Fetch training types to build type hierarchy
 */
export async function listTrainingTypes() {
  const res = await fetch(`${API_BASE}/training-types`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to load training types (${res.status})`);
  }

  const payload = await res.json().catch(() => ({}));
  const list = payload.data || payload || [];

  return (list || []).map((t) => ({
    id: String(t.ID || t.id),
    name: t.Name || t.name || 'Unknown',
    parentId: t.ParentID ? String(t.ParentID) : t.parent_id ? String(t.parent_id) : null,
  }));
}

/**
 * Build type lineage (walk from child to parent)
 * @param {string} typeId - Training type ID to start from
 * @param {Array} types - All training types
 * @returns {Array} Array of type IDs from child up to root
 */
export function getTypeLineage(typeId, types) {
  const lineage = [];
  let currentId = typeId ? String(typeId) : null;
  const visited = new Set();

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);
    lineage.push(currentId);

    const type = types.find((t) => t.id === currentId);
    currentId = type?.parentId || null;
  }

  return lineage;
}

/**
 * Filter packs that include a specific training type (considering hierarchy)
 * @param {Array} packs - User's packs
 * @param {string} slotTrainingTypeId - Training type ID of the slot
 * @param {Array} types - All training types (for hierarchy)
 * @returns {Array} Filtered packs compatible with the slot
 */
export function filterPacksByTrainingType(packs, slotTrainingTypeId, types) {
  if (!slotTrainingTypeId) return packs; // If no type specified, all packs work

  const slotLineage = getTypeLineage(slotTrainingTypeId, types);

  return packs.filter((pack) => {
    // Pack must have remaining sessions
    if (pack.remainingSessions <= 0) return false;

    // Pack must be paid
    if (!pack.isPaid) return false;

    // Pack must be active
    if (pack.status !== 'active') return false;

    // Check if pack includes any type in the slot's lineage
    return pack.trainingTypeIds.some((packTypeId) => slotLineage.includes(packTypeId));
  });
}

/**
 * Validate if a user pack is eligible for a specific slot
 */
export function validatePackForSlot(pack, slotTrainingTypeId, types) {
  if (!pack) return { valid: false, reason: 'No pack selected' };
  if (pack.remainingSessions <= 0) return { valid: false, reason: 'Pack has no remaining sessions' };
  if (!pack.isPaid) return { valid: false, reason: 'Pack has not been paid' };
  if (pack.status !== 'active') return { valid: false, reason: `Pack is ${pack.status}` };

  const slotLineage = getTypeLineage(slotTrainingTypeId, types);
  const compatible = pack.trainingTypeIds.some((packTypeId) => slotLineage.includes(packTypeId));

  if (!compatible) {
    return { valid: false, reason: 'Pack does not include this training type' };
  }

  return { valid: true, reason: null };
}
