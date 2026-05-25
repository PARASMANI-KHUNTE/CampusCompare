import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { adminService } from '../../services/admin.service';
import { College } from '../../types';
import toast from 'react-hot-toast';
import { Image as ImageIcon, Link as LinkIcon, Upload } from 'lucide-react';

interface CollegeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  college?: College | null;
}

export const CollegeFormModal = ({ isOpen, onClose, college }: CollegeFormModalProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Partial<College>>({
    name: '',
    description: '',
    city: '',
    state: '',
    collegeType: 'PRIVATE',
    feesMin: 0,
    feesMax: 0,
    officialUrl: '',
    imageUrl: '',
  });

  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (college) {
      setFormData(college);
      setImageMode('url'); // Default to URL mode when editing, they can switch if they want to upload a new one
      setSelectedFile(null);
    } else {
      setFormData({
        name: '',
        description: '',
        city: '',
        state: '',
        collegeType: 'PRIVATE',
        feesMin: 0,
        feesMax: 0,
        officialUrl: '',
        imageUrl: '',
      });
      setSelectedFile(null);
    }
  }, [college, isOpen]);

  const uploadMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => adminService.uploadCollegeImage(id, file),
    onSuccess: () => {
      toast.success('Image uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
      onClose();
    },
    onError: () => {
      toast.error('College saved, but failed to upload image');
      onClose();
    }
  });

  const createMutation = useMutation({
    mutationFn: adminService.createCollege,
    onSuccess: (newCollege) => {
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
      if (imageMode === 'upload' && selectedFile) {
        toast.success('College created, uploading image...');
        uploadMutation.mutate({ id: newCollege.id, file: selectedFile });
      } else {
        toast.success('College created successfully');
        onClose();
      }
    },
    onError: () => toast.error('Failed to create college'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<College>) => adminService.updateCollege(college!.id, data),
    onSuccess: (updatedCollege) => {
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
      if (imageMode === 'upload' && selectedFile) {
        toast.success('College updated, uploading new image...');
        uploadMutation.mutate({ id: updatedCollege.id, file: selectedFile });
      } else {
        toast.success('College updated successfully');
        onClose();
      }
    },
    onError: () => toast.error('Failed to update college'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up formData based on mode before submission
    const submitData = { ...formData };
    if (imageMode === 'upload') {
      // Don't send the URL string if they chose to upload a file (it will be updated via the upload endpoint)
      delete submitData.imageUrl;
    }

    if (college) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || uploadMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={college ? 'Edit College' : 'Add College'} className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="College Name" name="name" value={formData.name || ''} onChange={handleChange} required />
            <Input label="Official Website URL" name="officialUrl" type="url" placeholder="https://" value={formData.officialUrl || ''} onChange={handleChange} />
          </div>
          
          <div className="space-y-1">
            <label className="label">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              required
              className="input min-h-[80px]"
            />
          </div>
        </div>

        {/* Location & Type */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Location & Details</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <Input label="City" name="city" value={formData.city || ''} onChange={handleChange} required />
            </div>
            <Input label="State" name="state" value={formData.state || ''} onChange={handleChange} required />
            <Select
              label="Institution Type"
              name="collegeType"
              value={formData.collegeType || 'PRIVATE'}
              onChange={handleChange}
              options={[
                { value: 'GOVERNMENT', label: 'Government' },
                { value: 'PRIVATE', label: 'Private' },
                { value: 'DEEMED', label: 'Deemed' },
                { value: 'AUTONOMOUS', label: 'Autonomous' },
              ]}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Fees (₹)" name="feesMin" type="number" min="0" value={formData.feesMin || 0} onChange={handleChange} required />
            <Input label="Max Fees (₹)" name="feesMax" type="number" min="0" value={formData.feesMax || 0} onChange={handleChange} required />
          </div>
        </div>

        {/* Image Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">College Image</h4>
          
          <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setImageMode('url')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                imageMode === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LinkIcon className="w-4 h-4" /> Image URL
            </button>
            <button
              type="button"
              onClick={() => setImageMode('upload')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                imageMode === 'upload' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="w-4 h-4" /> Upload File
            </button>
          </div>

          {imageMode === 'url' ? (
            <Input 
              label="Image URL" 
              name="imageUrl" 
              type="url"
              placeholder="https://example.com/image.jpg" 
              value={formData.imageUrl || ''} 
              onChange={handleChange} 
            />
          ) : (
            <div className="space-y-1">
              <label className="label">Upload Image (Cloudinary)</label>
              <div 
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile ? selectedFile.name : 'Click to select an image'}
                </p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG or WEBP (max 5MB)</p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button type="submit" isLoading={isPending}>
            {college ? 'Update College' : 'Create College'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
