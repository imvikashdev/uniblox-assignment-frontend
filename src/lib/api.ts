const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface ApiErrorResponse {
  message: string[] | string;
  error?: string;
  statusCode: number;
}

interface FetcherOptions extends RequestInit {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  payload?: unknown;
  headers?: Record<string, string>;
}

/**
 * Generic fetch function for API calls.
 * @param endpoint - The API endpoint (e.g., '/cart', '/order/checkout').
 * @param options - Fetch options including method, payload, headers.
 * @returns Promise<T> - A promise resolving to the parsed JSON response.
 * @throws {Error} - Throws an error with message from API or network issue.
 */
const fetcher = async <T>(
  endpoint: string,
  options: FetcherOptions = {},
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const {
    method = 'GET',
    payload,
    headers: customHeaders,
    ...restOptions
  } = options;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const headers = { ...defaultHeaders, ...customHeaders };

  const config: RequestInit = {
    method: method,
    headers: headers,
    ...restOptions,
  };

  if (
    payload &&
    (method === 'POST' || method === 'PUT' || method === 'PATCH')
  ) {
    config.body = JSON.stringify(payload);
  }

  console.log(`Calling API: ${method} ${url}`, payload ? { payload } : '');

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData: ApiErrorResponse | null = null;
      try {
        errorData = await response.json();
        console.error('API Error Response:', errorData);
      } catch (jsonError) {
        console.error('Failed to parse error JSON:', jsonError);
      }

      const errorMessage = errorData
        ? Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message
        : response.statusText || `HTTP error! status: ${response.status}`;

      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      console.log('API Success: 204 No Content');
      return null as T;
    }

    const data: T = await response.json();
    console.log('API Success Response:', data);
    return data;
  } catch (error) {
    console.error(`API call failed: ${method} ${url}`, error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unknown error occurred during the API call.');
    }
  }
};

interface AddToCartPayload {
  userId: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItemResponse {
  id: string;
  userId: string;
  itemId: string;
  name: string;
  price: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

interface AddToCartResponse {
  message: string;
  item: CartItemResponse;
}

interface CheckoutPayload {
  userId: string;
  discountCode?: string;
}

interface OrderItemResponse {
  id: string;
  orderId: string;
  itemId: string;
  name: string;
  price: string;
  quantity: number;
}

export interface OrderResponse {
  id: string;
  userId: string;
  subtotal: string;
  discountCode: string | null;
  discountAmount: string;
  total: string;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface CheckoutResponse {
  message: string;
  order: OrderResponse;
}

export const addToCart = (
  payload: AddToCartPayload,
): Promise<AddToCartResponse> => {
  return fetcher<AddToCartResponse>('/cart', {
    method: 'POST',
    payload: payload,
  });
};

export const getUserCart = (userId: string): Promise<CartItemResponse[]> => {
  if (!userId) {
    return Promise.resolve([]);
  }
  return fetcher<CartItemResponse[]>(`/cart/${userId}`);
};

export const userCheckout = (
  payload: CheckoutPayload,
): Promise<CheckoutResponse> => {
  return fetcher<CheckoutResponse>('/order/checkout', {
    method: 'POST',
    payload: payload,
  });
};
