const API_URL = 'http://localhost:8080/api';

export const fetchItems = async () => {
  const res = await fetch(`${API_URL}/items`);
  if (!res.ok) throw new Error('Fetch failed');
  return res.json();
};

export const createItem = async (data) => {
  const res = await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create item');
  return res.json();
};

export const fetchDashboardStats = async () => {
  const res = await fetch(`${API_URL}/dashboard/stats`);
  if (!res.ok) throw new Error('Fetch failed');
  return res.json();
};

export const fetchLedger = async () => {
  const res = await fetch(`${API_URL}/ledger`);
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
