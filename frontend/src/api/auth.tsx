/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/auth.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export async function registerUser(data: { name: string; email: string; password: string }) {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "Something went wrong",
      errors: error.response?.data?.errors || null,
    };
  }
}

export async function loginUser(data: { email: string; password: string }) {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "Something went wrong",
      errors: error.response?.data?.errors || null,
    };
  }
}
