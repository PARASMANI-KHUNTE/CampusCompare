import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { discussionService } from '../services/discussion.service';
import { Loader } from '../components/ui/Loader';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ThumbsUp, User, Pencil, Trash2, X, Check } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export const Discussions = () => {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [deleteDiscussionId, setDeleteDiscussionId] = useState<string | null>(null);
  
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['discussions', 'global'],
    queryFn: () => discussionService.getDiscussions(undefined, 1, 50),
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) => 
      discussionService.createDiscussion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions', 'global'] });
      setNewTitle('');
      setNewContent('');
      toast.success('Discussion posted successfully');
      setIsSubmitting(false);
    },
    onError: () => {
      toast.error('Failed to post discussion');
      setIsSubmitting(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; title?: string; content?: string }) =>
      discussionService.updateDiscussion(data.id, { title: data.title, content: data.content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions', 'global'] });
      setEditingId(null);
      toast.success('Discussion updated');
    },
    onError: () => {
      toast.error('Failed to update discussion');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => discussionService.deleteDiscussion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions', 'global'] });
      toast.success('Discussion deleted');
    },
    onError: () => {
      toast.error('Failed to delete discussion');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to post a discussion');
      return;
    }
    if (newContent.trim()) {
      setIsSubmitting(true);
      createMutation.mutate({ title: newTitle, content: newContent });
    }
  };

  const handleUpvote = async (discussionId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to upvote');
      return;
    }
    try {
      await discussionService.upvoteDiscussion(discussionId);
      queryClient.invalidateQueries({ queryKey: ['discussions', 'global'] });
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  const startEditing = (discussion: any) => {
    setEditingId(discussion.id);
    setEditTitle(discussion.title || '');
    setEditContent(discussion.content);
  };

  const handleUpdate = (id: string) => {
    if (!editContent.trim()) return;
    updateMutation.mutate({ id, title: editTitle, content: editContent });
  };

  const handleDelete = (id: string) => {
    setDeleteDiscussionId(id);
  };

  const canModify = (discussionUserId: string) => {
    if (!user) return false;
    return user.id === discussionUserId;
  };

  const canDelete = (discussionUserId: string) => {
    if (!user) return false;
    return user.id === discussionUserId || user.role === 'ADMIN';
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Community Discussions</h1>
            <p className="text-gray-600 mt-2">Ask questions, share experiences, and connect with peers.</p>
          </div>
        </div>

        {isAuthenticated && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Start a Discussion</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Discussion Title (Optional)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <textarea
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 min-h-[100px] p-3 border"
                placeholder="What's on your mind? Ask a question or share something..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || !newContent.trim()}>
                  {isSubmitting ? 'Posting...' : 'Post Discussion'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {!isAuthenticated && (
          <div className="bg-primary-50 rounded-2xl border border-primary-100 p-6 text-center mb-8">
            <p className="text-primary-800 mb-4">Join the community to ask questions and share your knowledge.</p>
            <Link to="/login">
              <Button>Login to Post</Button>
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="py-12 flex justify-center"><Loader /></div>
          ) : data?.data?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No discussions yet.</p>
              <p className="text-gray-400 text-sm">Be the first to start a conversation!</p>
            </div>
          ) : (
            data?.data?.map((discussion) => (
              <div key={discussion.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                    <button 
                      onClick={() => handleUpvote(discussion.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <ThumbsUp className="w-5 h-5" />
                    </button>
                    <span className="font-medium text-gray-700">{discussion.upvotes}</span>
                  </div>
                  
                  <div className="flex-1">
                    {discussion.college && (
                      <Link to={`/colleges/${discussion.college.slug}`} className="inline-block mb-2 text-xs font-medium px-2 py-1 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 transition-colors">
                        {discussion.college.name}
                      </Link>
                    )}

                    {editingId === discussion.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
                          placeholder="Title (optional)"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <textarea
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 min-h-[80px]"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingId(null)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" /> Cancel
                          </button>
                          <button
                            onClick={() => handleUpdate(discussion.id)}
                            disabled={updateMutation.isPending}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" /> {updateMutation.isPending ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {discussion.title && (
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{discussion.title}</h3>
                        )}
                        <p className="text-gray-700 whitespace-pre-wrap mb-4">{discussion.content}</p>
                      </>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          {discussion.user?.avatarUrl ? (
                            <img src={discussion.user.avatarUrl} alt="" className="w-5 h-5 rounded-full" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                          <span className="font-medium">{discussion.user?.name}</span>
                        </div>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {editingId !== discussion.id && canModify(discussion.userId) && (
                          <button
                            onClick={() => startEditing(discussion)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete(discussion.userId) && (
                          <button
                            onClick={() => handleDelete(discussion.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4" />
                          <span>{discussion._count?.answers || 0} answers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

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
        message="Are you sure you want to delete this discussion? This will also delete all its answers."
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </PageContainer>
  );
};
