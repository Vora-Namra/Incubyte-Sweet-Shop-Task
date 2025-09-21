const API_URL =
  (import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api/sweets`
    : "https://incubyte-sweet-shop-task-backend-mdfzwh6oy-vora-namra-projects.vercel.app/api/sweets");
    
console.log("API URL:", API_URL);
async function handleResponse(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { message: data.message || "Something went wrong", errors: data.errors || null };
  }
  return data;
}

export async function getSweets(token: string) {
  const res = await fetch(`${API_URL}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(res);
}

export async function createSweet(
  token: string,
  data: { name: string; category: string; price: number; quantity: number }
) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function purchaseSweet(token: string, id: string, quantity: number) {
  const res = await fetch(`${API_URL}/${id}/purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ quantity })
  });
  return handleResponse(res);
}

export async function restockSweet(token: string, id: string, amount: number) {
  const res = await fetch(`${API_URL}/${id}/restock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ amount })
  });
  return handleResponse(res);
}


export async function deleteSweet(token: string, id: string) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

export async function searchSweets(
  token: string,
  filters: {
    name?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }
) {
  const query = new URLSearchParams();

  if (filters.name) query.append("name", filters.name);
  if (filters.category) query.append("category", filters.category);
  if (filters.minPrice) query.append("minPrice", filters.minPrice);
  if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);

  const res = await fetch(`${API_URL}/search?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function updateSweet(
  token: string,
  id: string,
  data: { name?: string; category?: string; price?: number; quantity?: number }
) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
