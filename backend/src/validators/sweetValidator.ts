import { z } from 'zod';

export const sweetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().nonnegative("Price must be >= 0"),
  quantity: z.number().int().nonnegative("Quantity must be >= 0")
});

export const purchaseSchema = z.object({
  quantity: z.number().int().positive("Purchase quantity must be > 0")
});

export const restockSchema = z.object({
  amount: z.number().int().positive("Restock amount must be > 0")
});

export const searchSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional()
});

export const updateSweetSchema = z.object({
  name: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  price: z.number().nonnegative().optional(),
  quantity: z.number().int().nonnegative().optional()
}).strict();
