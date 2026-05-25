import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';
import { Loader } from '../components/ui/Loader';
import { ErrorState } from '../components/ui/ErrorState';
import { Button } from '../components/ui/Button';
import { Trash2, Edit, GraduationCap, Plus, Building2, BookOpen, Star, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { College, Course } from '../types';
import { CollegeFormModal } from '../components/admin/CollegeFormModal';
import { CourseFormModal } from '../components/admin/CourseFormModal';

const StatsCards = () => {
  const { data: colleges, isLoading: loadingColleges } = useQuery({
    queryKey: ['admin-colleges'],
    queryFn: adminService.getColleges,
  });
  const { data: courses, isLoading: loadingCourses } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: adminService.getCourses,
  });

  const stats = [
    { icon: Building2, label: 'Total Colleges', value: colleges?.length || 0, color: 'bg-primary-50 text-primary-600' },
    { icon: BookOpen, label: 'Total Courses', value: courses?.length || 0, color: 'bg-indigo-50 text-indigo-600' },
    { icon: Star, label: 'Avg Rating', value: colleges?.length ? ((colleges as College[]).reduce((s, c) => s + c.rating, 0) / colleges.length).toFixed(1) : '—', color: 'bg-amber-50 text-amber-600' },
    { icon: Shield, label: 'College Types', value: colleges ? new Set((colleges as College[]).map(c => c.collegeType)).size : 0, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-display font-bold text-gray-900 mt-0.5">
                {loadingColleges || loadingCourses ? '...' : stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const CollegesSection = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);

  const { data: colleges, isLoading, isError } = useQuery({
    queryKey: ['admin-colleges'],
    queryFn: adminService.getColleges,
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
      toast.success('College deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete college');
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (college: College) => {
    setEditingCollege(college);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCollege(null);
    setIsModalOpen(true);
  };

  if (isLoading) return <Loader text="Loading colleges..." />;
  if (isError) return <ErrorState message="Failed to load colleges data" />;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-600" />
              Colleges
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Manage college listings</p>
          </div>
          <Button size="sm" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-1" /> Add College
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">College Name</th>
                <th className="p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Type</th>
                <th className="p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">City</th>
                <th className="p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {colleges?.map((college: College) => (
                <tr key={college.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{college.name}</td>
                  <td className="p-4">
                    <span className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full font-medium">{college.collegeType}</span>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">{college.city}, {college.state}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-primary-600 p-1.5 rounded-lg hover:bg-primary-50 transition-all" onClick={() => handleEdit(college)}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all" onClick={() => handleDelete(college.id)} disabled={deleteMutation.isPending}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CollegeFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        college={editingCollege} 
      />
    </>
  );
};

const CoursesSection = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const { data: courses, isLoading, isError } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: adminService.getCourses,
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete course');
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  if (isLoading) return <Loader text="Loading courses..." />;
  if (isError) return <ErrorState message="Failed to load courses data" />;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Courses
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Manage course offerings</p>
          </div>
          <Button size="sm" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-1" /> Add Course
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Course Name</th>
                <th className="p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Category</th>
                <th className="p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">College</th>
                <th className="p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Duration</th>
                <th className="p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Fees</th>
                <th className="p-4 font-semibold text-gray-500 text-xs uppercase tracking-wider w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((course: Course) => (
                <tr key={course.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{course.name}</td>
                  <td className="p-4 text-gray-600 text-sm">{course.category}</td>
                  <td className="p-4 text-gray-600 text-sm">{course.college?.name || course.collegeId}</td>
                  <td className="p-4 text-gray-600 text-sm">{course.duration}</td>
                  <td className="p-4 font-medium text-gray-900">₹{course.fees.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-all" onClick={() => handleEdit(course)}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all" onClick={() => handleDelete(course.id)} disabled={deleteMutation.isPending}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CourseFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        course={editingCourse} 
      />
    </>
  );
};

export const AdminDashboard = () => {
  return (
    <div className="container-custom py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-primary-600" />
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Manage colleges and courses</p>
      </div>

      <StatsCards />

      <div className="space-y-8">
        <CollegesSection />
        <CoursesSection />
      </div>
    </div>
  );
};
