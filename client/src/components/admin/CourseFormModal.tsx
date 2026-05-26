import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { adminService } from '../../services/admin.service';
import { Course } from '../../types';
import toast from 'react-hot-toast';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: Course | null;
}

export const CourseFormModal = ({ isOpen, onClose, course }: CourseFormModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<Course>>({
    collegeId: '',
    name: '',
    category: '',
    duration: '',
    fees: 0,
  });

  const { data: colleges } = useQuery({
    queryKey: ['admin-colleges'],
    queryFn: adminService.getColleges,
  });

  useEffect(() => {
    if (course) {
      setFormData(course);
    } else {
      setFormData({
        collegeId: '',
        name: '',
        category: '',
        duration: '',
        fees: 0,
      });
    }
  }, [course, isOpen]);

  const createMutation = useMutation({
    mutationFn: adminService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['college'] });
      toast.success('Course created successfully');
      onClose();
    },
    onError: () => toast.error('Failed to create course'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Course>) => adminService.updateCourse(course!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['college'] });
      toast.success('Course updated successfully');
      onClose();
    },
    onError: () => toast.error('Failed to update course'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (course) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const collegeOptions = colleges?.map(c => ({ value: c.id, label: c.name })) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={course ? 'Edit Course' : 'Add Course'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="College"
          name="collegeId"
          value={formData.collegeId || ''}
          onChange={handleChange}
          options={collegeOptions}
          placeholder="Select a college"
          required
          disabled={!!course}
        />
        <Input
          label="Course Name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Category" name="category" value={formData.category || ''} onChange={handleChange} required />
          <Input label="Duration" name="duration" value={formData.duration || ''} onChange={handleChange} required />
        </div>
        <Input label="Fees" name="fees" type="number" min="0" value={formData.fees || 0} onChange={handleChange} required />
        
        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button type="submit" isLoading={isPending}>Save Course</Button>
        </div>
      </form>
    </Modal>
  );
};
