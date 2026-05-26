import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/auth.service';
import { PageContainer } from '../components/layout/PageContainer';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Camera, User, Trash2, Mail, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user, setUser, clearUser } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState(user?.name || '');
  const [isDeleting, setIsDeleting] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name: string }) => authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => authService.uploadAvatar(file),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success('Profile picture updated');
    },
    onError: () => toast.error('Failed to upload profile picture'),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => authService.deleteAccount(),
    onSuccess: () => {
      clearUser();
      toast.success('Account deleted successfully');
      navigate('/');
    },
    onError: () => toast.error('Failed to delete account'),
  });

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && name !== user?.name) {
      updateProfileMutation.mutate({ name });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      uploadAvatarMutation.mutate(file);
    }
  };

  if (!user) return null;

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Account Settings</h1>

        <div className="space-y-8">
          {/* Profile Picture Section */}
          <section className="card p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary-500" />
              Profile Picture
            </h2>
            
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
                  title="Change picture"
                  disabled={uploadAvatarMutation.isPending}
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Upload a new profile picture. Recommended size is 400x400px.</p>
                <p className="text-xs text-gray-400">JPG, PNG, or WEBP. Max size 5MB.</p>
                {uploadAvatarMutation.isPending && (
                  <p className="text-sm font-medium text-primary-600 mt-2 animate-pulse">Uploading...</p>
                )}
              </div>
            </div>
          </section>

          {/* Personal Info Section */}
          <section className="card p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" />
              Personal Information
            </h2>
            
            <form onSubmit={handleNameSubmit} className="space-y-6 max-w-md">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              
              <div className="space-y-1">
                <label className="label">Email Address</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
                <p className="text-xs text-gray-400 mt-1">Your email address cannot be changed.</p>
              </div>

              <Button
                type="submit"
                disabled={!name.trim() || name === user.name || updateProfileMutation.isPending}
                isLoading={updateProfileMutation.isPending}
              >
                Save Changes
              </Button>
            </form>
          </section>

          {/* Danger Zone */}
          <section className="card p-6 md:p-8 border-red-100 bg-red-50/30">
            <h2 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Danger Zone
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Permanently delete your account and all of your data, including reviews, saved colleges, and discussions. This action cannot be undone.
            </p>
            
            <Button
              variant="danger"
              onClick={() => setIsDeleting(true)}
            >
              Delete Account
            </Button>
          </section>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleting}
        onCancel={() => setIsDeleting(false)}
        onConfirm={() => deleteAccountMutation.mutate()}
        title="Delete Account"
        message="Are you absolutely sure you want to delete your account? All your reviews, saved colleges, and community discussions will be permanently erased. This action CANNOT be undone."
        confirmText="Yes, delete my account"
        variant="danger"
        isLoading={deleteAccountMutation.isPending}
      />
    </PageContainer>
  );
};
