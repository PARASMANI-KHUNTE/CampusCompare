import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/apiResponse';
import prisma from '../config/prisma';
import { AuthRequest } from '../types';

export const getDiscussions = asyncHandler(async (req: Request, res: Response) => {
  const { collegeId } = req.query;

  const discussions = await prisma.discussion.findMany({
    where: collegeId ? { collegeId: collegeId as string } : undefined,
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      college: { select: { id: true, name: true } },
      _count: { select: { answers: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return successResponse(res, 'Discussions fetched successfully', discussions);
});

export const getDiscussionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const discussion = await prisma.discussion.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      college: { select: { id: true, name: true } },
      answers: {
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy: [{ isAccepted: 'desc' }, { upvotes: 'desc' }, { createdAt: 'asc' }],
      },
    },
  });

  if (!discussion) return errorResponse(res, 'Discussion not found', 404);

  return successResponse(res, 'Discussion fetched successfully', discussion);
});

export const createDiscussion = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, content, collegeId } = req.body;
  const userId = req.user!.id;

  if (!content) {
    return errorResponse(res, 'Content is required', 400);
  }

  const discussion = await prisma.discussion.create({
    data: {
      title: title || '',
      content,
      userId,
      collegeId: collegeId || null,
    },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
    }
  });

  return successResponse(res, 'Discussion created successfully', discussion, 201);
});

export const createAnswer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user!.id;

  if (!content) {
    return errorResponse(res, 'Content is required', 400);
  }

  const answer = await prisma.answer.create({
    data: {
      content,
      discussionId: id,
      userId,
    },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
    }
  });

  return successResponse(res, 'Answer created successfully', answer, 201);
});

export const upvoteDiscussion = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const discussion = await prisma.discussion.update({
    where: { id },
    data: { upvotes: { increment: 1 } },
  });

  return successResponse(res, 'Discussion upvoted', { discussion });
});

export const upvoteAnswer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const answer = await prisma.answer.update({
    where: { id },
    data: { upvotes: { increment: 1 } },
  });

  return successResponse(res, 'Answer upvoted', { answer });
});

export const updateDiscussion = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user!.id;

  const discussion = await prisma.discussion.findUnique({ where: { id } });
  if (!discussion) return errorResponse(res, 'Discussion not found', 404);

  // Only the owner can update
  if (discussion.userId !== userId) {
    return errorResponse(res, 'You can only edit your own posts', 403);
  }

  const updated = await prisma.discussion.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
    },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  return successResponse(res, 'Discussion updated successfully', updated);
});

export const deleteDiscussion = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const discussion = await prisma.discussion.findUnique({ where: { id } });
  if (!discussion) return errorResponse(res, 'Discussion not found', 404);

  // Owner or admin can delete
  if (discussion.userId !== userId && userRole !== 'ADMIN') {
    return errorResponse(res, 'Not authorized to delete this discussion', 403);
  }

  // Delete all answers first, then the discussion
  await prisma.answer.deleteMany({ where: { discussionId: id } });
  await prisma.discussion.delete({ where: { id } });

  return successResponse(res, 'Discussion deleted successfully', null);
});

export const deleteAnswer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const answer = await prisma.answer.findUnique({ where: { id } });
  if (!answer) return errorResponse(res, 'Answer not found', 404);

  // Owner or admin can delete
  if (answer.userId !== userId && userRole !== 'ADMIN') {
    return errorResponse(res, 'Not authorized to delete this answer', 403);
  }

  await prisma.answer.delete({ where: { id } });

  return successResponse(res, 'Answer deleted successfully', null);
});
