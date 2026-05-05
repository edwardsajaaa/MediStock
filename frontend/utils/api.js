const API_URL = 'http://localhost:8080/api';

export const fetchItems = async ({ page = 1, limit = 20 } = {}) => {
  const res = await fetch(`${API_URL}/items?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Fetch failed');
  return res.json();
};

export const createItem = async (data) => {
  const res = await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Gagal membuat item (Status: ${res.status})`);
  }
  return res.json();
};

export const updateItem = async (id, data) => {
  const res = await fetch(`${API_URL}/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Gagal mengupdate item (Status: ${res.status})`);
  }
  return res.json();
};

export const fetchDashboardStats = async () => {
  const res = await fetch(`${API_URL}/dashboard/stats`);
  if (!res.ok) throw new Error('Fetch failed');
  return res.json();
};

export const fetchLedger = async ({ page = 1, limit = 20, type, item_id, date_from, date_to, search } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (type) params.append('type', type);
  if (item_id) params.append('item_id', item_id);
  if (date_from) params.append('date_from', date_from);
  if (date_to) params.append('date_to', date_to);
  if (search) params.append('search', search);
  const res = await fetch(`${API_URL}/ledger?${params.toString()}`);
  if (!res.ok) throw new Error('Fetch failed');
  return res.json();
};

export const createTransaction = async (data) => {
  const res = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to create transaction');
  }
  return res.json();
};
