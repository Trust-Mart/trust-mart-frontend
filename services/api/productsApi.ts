import httpClient from "../http/httpClient";

export type SellerProduct = {
  id: number;
  seller_id: string;
  name: string;
  description: string;
  image_cid: string[];
  price: number;
  quantity: number;
  currency: string;
  status: "active" | "pending" | string;
  ai_verification_score?: number | null;
  createdAt: string;
  updatedAt: string;
  seller?: { id: number; username?: string };
};

export type SellerProductsResponse = {
  status: boolean;
  message: string;
  data: {
    products: SellerProduct[];
    pagination: { page: number; limit: number; total: number; pages: number };
  };
  timestamp: string;
};

export const productsApi = {
  myProducts(page = 1, limit = 20) {
    return httpClient.get<SellerProductsResponse>(`/products/seller/my-products?page=${page}&limit=${limit}`);
  },
  getById(productId: string | number) {
    return httpClient.get<{
      status: boolean;
      message: string;
      data: { product: SellerProduct };
      timestamp: string;
    }>(`/products/${productId}`);
  },
  listAll(page = 1, limit = 20) {
    return httpClient.get<SellerProductsResponse>(`/products?page=${page}&limit=${limit}`);
  },
  update(productId: string | number, payload: UpdateProductPayload) {
    return httpClient.put<{
      status: boolean;
      message: string;
      data: { product: SellerProduct };
      timestamp: string;
    }>(`/products/${productId}`, payload);
  },
};

export type UpdateProductPayload = {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  currency?: string;
  status?: string;
};

export default productsApi;


