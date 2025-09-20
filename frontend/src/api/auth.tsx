// const API_URL = (import.meta.env.VITE_BACKEND_URL ?? "https://incubyte-sweet-shop-task-d2jr.vercel.app") + "/api/auth";
const API_URL = "http://localhost:5000/api/auth";
export async function registerUser(data: { name: string; email: string; password: string }) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}
