// Export all services
export { authService } from './auth.service';
export { courseService } from './course.service';
export { paymentService } from './payment.service';
export { contactService } from './contact.service';
export { learningPathService } from './learningPath.service';
export { certificateService } from './certificate.service';
export { productService } from './product.service';

// Re-export types
export type { LoginCredentials, RegisterData, UpdateProfileData } from './auth.service';
export type { CourseFilters, CreateCourseData, UpdateCourseData, CourseReviewData } from './course.service';
export type { CreateCheckoutData, SubscriptionData } from './payment.service';
export type { SubmitContactData } from './contact.service';
