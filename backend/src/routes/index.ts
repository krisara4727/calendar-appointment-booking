import { Router } from 'express';
import { getFreeSlots } from '../controllers/slotController';
import { createEvent, getEvents } from '../controllers/eventController';

const router = Router();

// Slot routes
router.get('/slots/free', getFreeSlots);

// Event routes
router.post('/events', createEvent);
router.get('/events', getEvents);

export default router;
