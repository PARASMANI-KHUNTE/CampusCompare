import { Router } from 'express';
import { getDiscussions, getDiscussionById, createDiscussion, createAnswer, upvoteDiscussion, upvoteAnswer, updateDiscussion, deleteDiscussion, deleteAnswer } from '../controllers/discussion.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getDiscussions);
router.get('/:id', getDiscussionById);

// Protected routes
router.post('/', authenticate, createDiscussion);
router.put('/:id', authenticate, updateDiscussion);
router.delete('/:id', authenticate, deleteDiscussion);
router.post('/:id/answers', authenticate, createAnswer);
router.post('/:id/upvote', authenticate, upvoteDiscussion);
router.post('/answers/:id/upvote', authenticate, upvoteAnswer);
router.delete('/answers/:id', authenticate, deleteAnswer);

export default router;
