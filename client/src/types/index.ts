export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string;
  createdAt: string;
}

export interface College {
  id: string;
  name: string;
  slug: string;
  shortName?: string;
  description: string;
  overview?: string;
  city: string;
  state: string;
  address?: string;
  collegeType: 'GOVERNMENT' | 'PRIVATE' | 'DEEMED' | 'AUTONOMOUS';
  ownership?: string;
  establishedYear?: number;
  approvedBy: string[];
  affiliatedTo?: string;
  accreditation: string[];
  imageUrl?: string;
  officialUrl?: string;
  gallery: string[];
  feesMin: number;
  feesMax: number;
  rating: number;
  reviewCount: number;
  placementAverage?: number;
  placementHighest?: number;
  examsAccepted: string[];
  popularCourses: string[];
  facilities: string[];
  tags: string[];
  courses?: Course[];
  reviews?: Review[];
  notices?: Notice[];
  createdAt: string;
}

export interface Notice {
  id: string;
  collegeId: string;
  title: string;
  content: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  collegeId: string;
  name: string;
  category: string;
  degree?: string;
  duration: string;
  fees: number;
  eligibility?: string;
  examsAccepted: string[];
  seats?: number;
  college?: { name: string; shortName?: string };
}

export interface Review {
  id: string;
  collegeId: string;
  userId: string;
  rating: number;
  title?: string;
  comment: string;
  placementRating?: number;
  facultyRating?: number;
  campusRating?: number;
  valueForMoneyRating?: number;
  user?: { name: string; avatarUrl?: string };
  createdAt: string;
}

export interface SavedCollege {
  id: string;
  userId: string;
  collegeId: string;
  college: College;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CollegeFilters {
  search?: string;
  city?: string;
  state?: string;
  course?: string;
  collegeType?: string;
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  minPlacement?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ReviewData {
  rating: number;
  title?: string;
  comment: string;
  placementRating?: number;
  facultyRating?: number;
  campusRating?: number;
  valueForMoneyRating?: number;
}
