export async function getPortfolio() {
  const response = await fetch('/api/v1/portfolio');
  if (!response.ok) throw new Error('Failed to fetch portfolio');
  return response.json();
}

export async function addHolding(data: any) {
  const response = await fetch('/api/v1/portfolio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add holding');
  return response.json();
}
