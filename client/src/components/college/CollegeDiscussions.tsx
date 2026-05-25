import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { discussionService } from '../../services/discussion.service';
import { useAuthStore } from '../../stores/authStore';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { MessageSquare, ThumbsUp, User, Pencil, Trash2, X, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface Props {
  collegeId: string;
}

export const CollegeDiscussions = ({ collegeId }: Props) => {
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedDiscussionId, setExpandedDiscussionId] = useState<string | null>(null);
  const [answerContent, setAnswerContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deleteDiscussionId, setDeleteDiscussionId] = useState<string | null>(null);
  const [deleteAnswerId, setDeleteAnswerId] = useState<string | null>(null);

  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['discussions', collegeId],
    queryFn: () => discussionService.getDiscussions(collegeId, 1, 10),
  });

  const createMutation = useMutation({
    mutationFn: (content: string) => discussionService.createDiscussion({ content, collegeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions', collegeId] });
      setNewContent('');
      toast.success('Question posted successfully');
      setIsSubmitting(false);
    },
    onError: () => {
      toast.error('Failed to post question');
      setIsSubmitting(false);
    },
  });

  const createAnswerMutation = useMutation({
    mutationFn: (data: { discussionId: string; content: string }) => 
      discussionService.createAnswer(data.discussionId, data.content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['discussions', collegeId] });
      queryClient.invalidateQueries({ queryKey: ['discussion', variables.discussionId] });
      setAnswerContent('');
      toast.success('Answer posted successfully');
    },
    onError: () => {
      toast.error('Failed to post answer');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; content: string }) =>
      discussionService.updateDiscussion(data.id, { content: data.content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions', collegeId] });
      setEditingId(null);
      toast.success('Post updated');
    },
    onError: () => {
      toast.error('Failed to update post');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => discussionService.deleteDiscussion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions', collegeId] });
      toast.success('Post deleted');
    },
    onError: () => {
      toast.error('Failed to delete post');
    },
  });

  const deleteAnswerMutation = useMutation({
    mutationFn: (id: string) => discussionService.deleteAnswer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions', collegeId] });
      // Also invalidate the expanded discussion detail
      if (expandedDiscussionId) {
        queryClient.invalidateQueries({ queryKey: ['discussion', expandedDiscussionId] });
      }
      toast.success('Answer deleted');
    },
    onError: () => {
      toast.error('Failed to delete answer');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to post a question');
      return;
    }
    if (newContent.trim()) {
      setIsSubmitting(true);
      createMutation.mutate(newContent);
    }
  };

  const handleAnswerSubmit = (e: React.FormEvent, discussionId: string) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to answer');
      return;
    }
    if (answerContent.trim()) {
      createAnswerMutation.mutate({ discussionId, content: answerContent });
    }
  };

  const handleUpvote = async (discussionId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to upvote');
      return;
    }
    try {
      await discussionService.upvoteDiscussion(discussionId);
      queryClient.invalidateQueries({ queryKey: ['discussions', collegeId] });
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  const canModify = (postUserId: string) => {
    if (!user) return false;
    return user.id === postUserId;
  };

  const canDelete = (postUserId: string) => {
    if (!user) return false;
    return user.id === postUserId || user.role === 'ADMIN';
  };

  return (
    <div className="space-y-6">
      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3 border min-h-[80px] text-sm"
            placeholder="Ask a question about this college..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            required
          />
          <div className="flex justify-end mt-2">
            <Button type="submit" size="sm" disabled={isSubmitting || !newContent.trim()}>
              Ask Question
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="text-center py-6 text-sm text-gray-500">Loading discussions...</div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-sm">No questions asked yet. Be the first to ask!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.data?.map((discussion) => (
            <div key={discussion.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex gap-3">
                <div className="flex flex-col items-center gap-1 min-w-[2.5rem]">
                  <button 
                    onClick={() => handleUpvote(discussion.id)}
                    className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-medium text-gray-700">{discussion.upvotes}</span>
                </div>
                
                <div className="flex-1">
                  {editingId === discussion.id ? (
                    <div className="space-y-2">
                      <textarea
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 min-h-[60px]"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <X className="w-3 h-3" /> Cancel
                        </button>
                        <button
                          onClick={() => updateMutation.mutate({ id: discussion.id, content: editContent })}
                          disabled={updateMutation.isPending}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3 h-3" /> {updateMutation.isPending ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-800 text-sm mb-2">{discussion.content}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">{discussion.user?.name || 'Anonymous'}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {editingId !== discussion.id && canModify(discussion.userId) && (
                        <button
                          onClick={() => {
                            setEditingId(discussion.id);
                            setEditContent(discussion.content);
                          }}
                          className="p-1 rounded-md hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {canDelete(discussion.userId) && (
                        <button
                          onClick={() => setDeleteDiscussionId(discussion.id)}
                          className="p-1 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button 
                        onClick={() => setExpandedDiscussionId(expandedDiscussionId === discussion.id ? null : discussion.id)}
                        className="flex items-center gap-1 hover:text-primary-600 transition-colors font-medium"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        {discussion._count?.answers || 0} answers
                      </button>
                    </div>
                  </div>

                  {expandedDiscussionId === discussion.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <DiscussionAnswers 
                        discussionId={discussion.id}
                        canDelete={canDelete}
                        onDeleteAnswer={(id) => deleteAnswerMutation.mutate(id)}
                        onDeleteRequest={(id) => setDeleteAnswerId(id)}
                      />
                      
                      {isAuthenticated && (
                        <form onSubmit={(e) => handleAnswerSubmit(e, discussion.id)} className="mt-4">
                          <textarea
                            className="w-full rounded-lg border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border text-xs"
                            placeholder="Write an answer..."
                            value={answerContent}
                            onChange={(e) => setAnswerContent(e.target.value)}
                            rows={2}
                          />
                          <div className="flex justify-end mt-2">
                            <Button type="submit" size="sm" variant="secondary" className="text-xs py-1 h-auto">
                              Post Answer
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDiscussionId !== null}
        onConfirm={() => {
          if (deleteDiscussionId) {
            deleteMutation.mutate(deleteDiscussionId);
            setDeleteDiscussionId(null);
          }
        }}
        onCancel={() => setDeleteDiscussionId(null)}
        title="Delete Discussion"
        message="Delete this discussion and all its answers?"
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmDialog
        isOpen={deleteAnswerId !== null}
        onConfirm={() => {
          if (deleteAnswerId) {
            deleteAnswerMutation.mutate(deleteAnswerId);
            setDeleteAnswerId(null);
          }
        }}
        onCancel={() => setDeleteAnswerId(null)}
        title="Delete Answer"
        message="Delete this answer?"
        confirmText="Delete"
        variant="danger"
        isLoading={deleteAnswerMutation.isPending}
      />
    </div>
  );
};

const DiscussionAnswers = ({ discussionId, canDelete, onDeleteAnswer, onDeleteRequest }: { discussionId: string; canDelete: (userId: string) => boolean; onDeleteAnswer: (id: string) => void; onDeleteRequest: (id: string) => void }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['discussion', discussionId],
    queryFn: () => discussionService.getDiscussionById(discussionId),
  });

  if (isLoading) return <div className="text-xs text-gray-500 text-center py-2">Loading answers...</div>;
  if (!data?.answers || data.answers.length === 0) return <div className="text-xs text-gray-500">No answers yet.</div>;

  return (
    <div className="space-y-3">
      {data.answers.map((answer) => (
        <div key={answer.id} className="bg-gray-50 p-3 rounded-lg flex gap-3">
          <div className="flex-1">
            <p className="text-gray-700 text-sm mb-1">{answer.content}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">{answer.user?.name || 'Anonymous'}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}</span>
              </div>
              {canDelete(answer.userId) && (
                <button
                  onClick={() => onDeleteRequest(answer.id)}
                  className="p-1 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete answer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
