import { Request, Response } from 'express';
import Sweet from '../models/Sweet';

export const createSweet = async (req: Request, res: Response) => {
  try {
    const { name, category, price, quantity } = req.body;
    if (!name || !category || price == null || quantity == null) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const sweet = await Sweet.create({ name, category, price, quantity });
    res.status(201).json(sweet);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSweets = async (_req: Request, res: Response) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const searchSweets = async (req: Request, res: Response) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const filter: any = {};

    if (name) filter.name = new RegExp(name as string, 'i');
    if (category) filter.category = new RegExp(category as string, 'i');
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    if (Object.keys(filter).length === 0) {
      return res.status(400).json({ message: 'Please provide at least one search filter' });
    }

    const sweets = await Sweet.find(filter);
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};




export const updateSweet = async (req: Request, res: Response) => {
  try {
    const updated = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSweet = async (req: Request, res: Response) => {
  try {
    const deleted = await Sweet.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const purchaseSweet = async (req: Request, res: Response) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    const PurchaseQuantity= req.body.quantity;
    if(PurchaseQuantity<=0) return res.status(400).json({message:'Purchase Quantity must be > 0'});
    if (!sweet) return res.status(404).json({ message: 'Not found' });
    if (sweet.quantity <= 0) return res.status(400).json({ message: 'Out of stock' });
    sweet.quantity = sweet.quantity - PurchaseQuantity;
    await sweet.save();
    res.json({ message: 'Purchased', sweet });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const restockSweet = async (req: Request, res: Response) => {
  try {
    console.log("restockSweet called with body:", req.body);
    const amount = Number(req.body.amount || 0);
    if (amount <= 0) return res.status(400).json({ message: 'Amount must be > 0' });
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Not found' });
    sweet.quantity = sweet.quantity + amount;
    await sweet.save();
    res.json({ message: 'Restocked', sweet });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
