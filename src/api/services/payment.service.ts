import apiClient from '../client';
import type { PaymentCheckoutResponse, PaymentCaptureResponse } from '../../types/api';

export interface CreateCheckoutData {
  courseId: string;
}

export interface SubscriptionData {
  planType: 'Basic' | 'Pro' | 'Lifetime';
}

export const paymentService = {
  /**
   * Create PayPal checkout session for course purchase
   */
  createCheckout: async (data: CreateCheckoutData): Promise<PaymentCheckoutResponse> => {
    return apiClient.post<PaymentCheckoutResponse>('/payments/checkout', data);
  },

  /**
   * Capture payment after PayPal approval
   */
  capturePayment: async (orderId: string): Promise<PaymentCaptureResponse> => {
    return apiClient.post<PaymentCaptureResponse>(`/payments/capture/${orderId}`);
  },

  /**
   * Verify payment status
   */
  verifyPayment: async (paymentId: string): Promise<{
    id: string;
    status: string;
    amount: number;
    currency: string;
    courseId: string;
    createdAt: string;
  }> => {
    return apiClient.get(`/payments/verify/${paymentId}`);
  },

  /**
   * Get user subscriptions
   */
  getSubscriptions: async (): Promise<unknown[]> => {
    return apiClient.get('/payments/subscriptions');
  },

  /**
   * Create subscription
   */
  createSubscription: async (data: SubscriptionData): Promise<{
    orderId: string;
    url: string;
    paymentId: string;
  }> => {
    return apiClient.post('/payments/subscriptions', data);
  },

  /**
   * Cancel subscription
   */
  cancelSubscription: async (subscriptionId: string): Promise<{ message: string }> => {
    return apiClient.delete(`/payments/subscriptions/${subscriptionId}`);
  },
};

export default paymentService;
