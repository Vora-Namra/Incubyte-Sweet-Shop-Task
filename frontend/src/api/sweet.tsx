const API_URL = "http://localhost:5000/api/sweets";

export async function getSweets(token: string) {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function createSweet(token: string, data: { name: string; category: string; price: number; quantity: number }) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data)
  });
  return res.json();
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
  return res.json();
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
  return res.json();
}
