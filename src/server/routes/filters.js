import { Router } from 'express';
import { getFilters } from '../controllers/filterController.js';

const router = Router();

router.get('/', getFilters);

export default router;
