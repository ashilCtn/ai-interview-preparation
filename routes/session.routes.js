import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { getSession, getSessions, createSession, deleteSession, pinOrNote, learnMore, loadMore } from '../controllers/session.controller.js';

const router = express.Router();

// Get all sessions
router.get('/', protect, getSessions);

// Get single session
router.get('/:id', protect, getSession);

// Create session + generate Q&A
router.post('/', protect, createSession);

// Delete session
router.delete('/:id', protect, deleteSession);

// Pin or note a question
router.patch('/:id/qna/:qnaId', protect, pinOrNote);

// Learn More
router.post('/learn-more', protect, learnMore);

// Load More questions
router.post('/:id/load-more', protect, loadMore);


export default router;