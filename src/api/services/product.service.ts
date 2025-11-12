import apiClient from '../client';
import type { Product, ProductFeature } from '../../types/api';

export interface CreateProductData {
  title: string;
  description: string;
  imageUrl?: string;
  orderIndex?: number;
  features?: Array<{
    subtitle: string;
    subDescription: string;
    orderIndex: number;
  }>;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  isPublished?: boolean;
}

export interface AddFeatureData {
  subtitle: string;
  subDescription: string;
  orderIndex: number;
}

export interface UpdateFeatureData extends Partial<AddFeatureData> {}

export interface ReorderFeaturesData {
  featureOrders: Array<{
    featureId: string;
    orderIndex: number;
  }>;
}

export const productService = {
  /**
   * Get all products (public)
   * @param includeAll - If true, includes both published and draft products
   */
  getProducts: async (includeAll: boolean = false): Promise<Product[]> => {
    const params = includeAll ? '?includeAll=true' : '';
    return apiClient.get<Product[]>(`/products${params}`);
  },

  /**
   * Get product by ID (public)
   */
  getProductById: async (productId: string): Promise<Product> => {
    return apiClient.get<Product>(`/products/${productId}`);
  },

  /**
   * Create product (admin only)
   */
  createProduct: async (data: CreateProductData): Promise<Product> => {
    return apiClient.post<Product>('/products', data);
  },

  /**
   * Update product (admin only)
   */
  updateProduct: async (productId: string, data: UpdateProductData): Promise<Product> => {
    return apiClient.put<Product>(`/products/${productId}`, data);
  },

  /**
   * Delete product (admin only)
   */
  deleteProduct: async (productId: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/products/${productId}`);
  },

  /**
   * Add feature to product (admin only)
   */
  addFeature: async (productId: string, data: AddFeatureData): Promise<ProductFeature> => {
    return apiClient.post<ProductFeature>(`/products/${productId}/features`, data);
  },

  /**
   * Update feature (admin only)
   */
  updateFeature: async (featureId: string, data: UpdateFeatureData): Promise<ProductFeature> => {
    return apiClient.put<ProductFeature>(`/products/features/${featureId}`, data);
  },

  /**
   * Delete feature (admin only)
   */
  deleteFeature: async (featureId: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/products/features/${featureId}`);
  },

  /**
   * Reorder features (admin only)
   */
  reorderFeatures: async (productId: string, data: ReorderFeaturesData): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>(`/products/${productId}/features/reorder`, data);
  },
};

export default productService;
