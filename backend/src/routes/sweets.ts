import express from 'express';
import {
  createSweet,
  getSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} from '../controllers/sweetsController';
import { protect, adminOnly } from '../middlewares/auth';

const router = express.Router();

router.get('/', protect, getSweets);
router.get('/search', protect, searchSweets);
router.post('/', protect, createSweet);
router.put('/:id', protect, updateSweet);
router.delete('/:id', protect, adminOnly, deleteSweet);

router.post('/:id/purchase', protect, purchaseSweet);
router.post('/:id/restock', protect, adminOnly, restockSweet);

export default router;
