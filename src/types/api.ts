// User Types
export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profileData: {
    name: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    [key: string]: unknown;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Course Types
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type ContentType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  level: CourseLevel;
  thumbnail?: string;
  language: string;
  whatYouWillLearn?: string[];
  previewVideoUrl?: string;
  status: CourseStatus;
  instructorId: string;
  instructor?: Instructor;
  averageRating?: number;
  totalReviews?: number;
  totalEnrollments?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Instructor {
  id: string;
  userId: string;
  bio: string;
  expertise: string[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
    [key: string]: string | undefined;
  };
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  contentType: ContentType;
  videoUrl?: string;
  textContent?: string;
  duration?: number;
  orderIndex: number;
  isFree: boolean;
  quizzes?: Quiz[];
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

// Learning Types
export type CompletionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface UserProgress {
  courseId: string;
  courseTitle: string;
  enrollmentDate: string;
  completionStatus: CompletionStatus;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessedAt?: string;
}

export interface QuizAttemptResponse {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  passingScore: number;
  completedAt: string;
}

// Payment Types
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface PaymentCheckoutResponse {
  orderId: string;
  approvalUrl: string;
}

export interface PaymentCaptureResponse {
  success: boolean;
  message: string;
  payment: {
    id: string;
    userId: string;
    courseId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paypalOrderId: string;
    createdAt: string;
  };
  enrollment: {
    id: string;
    courseId: string;
    enrolledAt: string;
  };
}

// Certificate Types
export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  certificateCode: string;
  issuedAt: string;
  metadata: {
    studentName: string;
    courseName: string;
    instructorName: string;
    completionDate: string;
  };
  course?: Course;
  createdAt: string;
}

// Learning Path Types
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  difficulty: CourseLevel;
  orderIndex: number;
  isPublished: boolean;
  totalCourses: number;
  courses: CourseInPath[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseInPath extends Course {
  orderInPath: number;
}

// Contact Inquiry Types
export type InquiryStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED';

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInquiryStats {
  total: number;
  byStatus: {
    new: number;
    inProgress: number;
    resolved: number;
  };
}

// Product Types
export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  isPublished: boolean;
  orderIndex: number;
  features: ProductFeature[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFeature {
  id: string;
  productId: string;
  subtitle: string;
  subDescription: string;
  orderIndex: number;
  createdAt: string;
}

// Mentoring Types
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
export type SessionStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED_BY_STUDENT' | 'CANCELLED_BY_INSTRUCTOR';

export interface InstructorAvailability {
  id: string;
  instructorId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isActive: boolean;
  instructor?: {
    user: {
      profileData: {
        name: string;
      };
    };
  };
  createdAt: string;
}

export interface MentoringSession {
  id: string;
  instructorId: string;
  studentId: string;
  scheduledAt: string;
  duration: number;
  status: SessionStatus;
  topic: string;
  meetingLink?: string;
  instructorNotes?: string;
  studentNotes?: string;
  instructor?: {
    user: {
      profileData: {
        name: string;
      };
    };
  };
  student?: {
    user: {
      profileData: {
        name: string;
      };
    };
  };
  createdAt: string;
  updatedAt: string;
}

// Access Link Types
export interface AccessLink {
  id: string;
  token: string;
  url: string;
  courseId: string;
  courseTitle?: string;
  isUsed: boolean;
  usedBy?: string;
  usedAt?: string;
  expiresAt?: string;
  isExpired: boolean;
  createdBy?: {
    id: string;
    email: string;
    name: string;
  };
  createdAt: string;
}

export interface AccessLinkInfo {
  isValid: boolean;
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
    instructor: {
      name: string;
    };
  };
  maxUses: number;
  usedCount: number;
  expiresAt?: string;
}

// Request Types
export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateInstructorProfileRequest {
  bio: string;
  expertise: string[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  level: CourseLevel;
  thumbnail?: string;
  language: string;
  whatYouWillLearn?: string[];
  previewVideoUrl?: string;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  status?: CourseStatus;
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
}

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string;
  user: {
    profileData: {
      name: string;
      avatar?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProgressRequest {
  lessonId: string;
  completed: boolean;
}

export interface ProgressUpdateResponse {
  lessonProgress: {
    id: string;
    lessonId: string;
    completed: boolean;
    completedAt?: string;
  };
  courseProgress: {
    progress: number;
    completedLessons: number;
    totalLessons: number;
  };
}

export interface QuizAttemptRequest {
  answers: number[];
}

export interface CreateLearningPathRequest {
  title: string;
  description: string;
  thumbnail?: string;
  difficulty: CourseLevel;
  orderIndex: number;
  isPublished: boolean;
}

export interface UpdateLearningPathRequest extends Partial<CreateLearningPathRequest> {}

export interface AddCourseToPathRequest {
  courseId: string;
  orderInPath: number;
}

export interface ReorderCoursesRequest {
  courseOrders: {
    courseId: string;
    orderInPath: number;
  }[];
}

export interface CreateProductRequest {
  title: string;
  description: string;
  imageUrl?: string;
  isPublished: boolean;
  orderIndex: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface CreateFeatureRequest {
  subtitle: string;
  subDescription: string;
  orderIndex: number;
}

export interface UpdateFeatureRequest extends Partial<CreateFeatureRequest> {}

export interface ReorderFeaturesRequest {
  featureOrders: {
    featureId: string;
    orderIndex: number;
  }[];
}

export interface CreateAvailabilityRequest {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface UpdateAvailabilityRequest extends Partial<CreateAvailabilityRequest> {}

export interface BookSessionRequest {
  instructorId: string;
  scheduledAt: string;
  duration: number;
  topic: string;
}

export interface UpdateSessionRequest {
  status?: SessionStatus;
  meetingLink?: string;
  instructorNotes?: string;
  studentNotes?: string;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface UpdateContactRequest {
  status: InquiryStatus;
}

export interface CheckoutRequest {
  courseId: string;
}

export interface CreateSubscriptionRequest {
  planId: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export interface EnrolledCourse extends Course {
  enrolledAt: string;
  progress: number;
  completionStatus: CompletionStatus;
}

export interface CourseWithProgress extends Course {
  sections: Section[];
  enrollment: {
    enrolledAt: string;
    progress: number;
  };
  lessonProgress: {
    lessonId: string;
    completed: boolean;
    completedAt?: string;
  }[];
}

// API Error Response
export interface ApiError {
  error: string;
  status: number;
  field?: string[];
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
