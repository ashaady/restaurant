/**
 * API Client Wrapper
 * Centralized fetch utility for all backend API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: ApiError }> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.text();
        return {
          error: {
            message: error || `HTTP ${response.status}`,
            status: response.status,
          },
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        error: {
          message,
        },
      };
    }
  }

  async get<T>(endpoint: string): Promise<{ data?: T; error?: ApiError }> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body: any
  ): Promise<{ data?: T; error?: ApiError }> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(
    endpoint: string,
    body: any
  ): Promise<{ data?: T; error?: ApiError }> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async patch<T>(
    endpoint: string,
    body: any
  ): Promise<{ data?: T; error?: ApiError }> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<{ data?: T; error?: ApiError }> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();

// PayDunya API endpoints
export const paydunya = {
  initialize: (payload: any) => apiClient.post("/paydunya/initialize", payload),
  verify: (token: string) => apiClient.get(`/paydunya/verify/${token}`),
  callback: (payload: any) => apiClient.post("/paydunya/callback", payload),
};

// Orders API endpoints
export const orders = {
  create: (payload: any) => apiClient.post("/orders", payload),
  get: (orderId: string) => apiClient.get(`/orders/${orderId}`),
  update: (orderId: string, payload: any) =>
    apiClient.put(`/orders/${orderId}`, payload),
};

// Payments API endpoints
export const payments = {
  create: (payload: any) => apiClient.post("/payments", payload),
  get: (paymentId: string) => apiClient.get(`/payments/${paymentId}`),
  update: (paymentId: string, payload: any) =>
    apiClient.put(`/payments/${paymentId}`, payload),
  verify: (token: string) => apiClient.get(`/payments/verify/${token}`),
};
