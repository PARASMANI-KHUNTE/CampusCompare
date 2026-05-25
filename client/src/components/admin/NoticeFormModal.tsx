import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { adminService } from '../../services/admin.service';
import toast from 'react-hot-toast';
import { Upload, FileText, Image as ImageIcon } from 'lucide-react';

interface NoticeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  collegeId: string;
}

export const NoticeFormModal = ({ isOpen, onClose, collegeId }: NoticeFormModalProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const createMutation = useMutation({
    mutationFn: () => adminService.createNotice(collegeId, { ...formData, attachment: selectedFile || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
      toast.success('Notice posted successfully');
      setFormData({ title: '', content: '' });
      setSelectedFile(null);
      onClose();
    },
    onError: () => toast.error('Failed to post notice'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const isPending = createMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post a Notice">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <Input 
          label="Notice Title" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          required 
          placeholder="e.g. Admission Deadline Extended"
        />
        
        <div className="space-y-1">
          <label className="label">Content / Description</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            className="input min-h-[120px]"
            placeholder="Details about the notice..."
          />
        </div>

        <div className="space-y-1">
          <label className="label">Attachment (Optional)</label>
          <div 
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFile ? (
              <FileText className="w-8 h-8 text-primary-500 mb-2" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
            )}
            <p className="text-sm font-medium text-gray-900 text-center">
              {selectedFile ? selectedFile.name : 'Click to attach an image or document'}
            </p>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
          </div>
        </div>
        
        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button type="submit" isLoading={isPending}>Post Notice</Button>
        </div>
      </form>
    </Modal>
  );
};
