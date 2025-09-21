/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = (import.meta.env.VITE_BACKEND_URL ?? "https://incubyte-sweet-shop-task-backend-mdfzwh6oy-vora-namra-projects.vercel.app") + "/api/auth";

export async function registerUser(data: { name: string; email: string; password: string }) {
  try {
    const response = await axios.post(`${API_URL}/register`, data, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "Something went wrong",
      errors: error.response?.data?.errors || null
    };
  }
}

// Login user
export async function loginUser(data: { email: string; password: string }) {
  try {
    const response = await axios.post(`${API_URL}/login`, data, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "Something went wrong",
      errors: error.response?.data?.errors || null
    };
  }
}
