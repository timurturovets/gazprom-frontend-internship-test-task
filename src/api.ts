import { CommentItem, Post, User } from './types';

const BASE_URL = 'https://gorest.co.in/public/v2';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function buildHeaders(token: string) {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (token.trim()) headers.Authorization = `Bearer ${token.trim()}`;

  return headers;
}

interface PaginatedResponse<T> {
  items: T[];
  totalPages: number;
}

async function requestWithPagination<T>(url: string, token: string): Promise<PaginatedResponse<T>> {
  const response = await fetch(url, { headers: buildHeaders(token) });

  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(response.status, body || response.statusText || `Ошибка ${response.status}`);
  }

  const items = (await response.json()) as T[];
  const totalPages = Number(response.headers.get('x-pagination-pages') || '1');

  return {
    items,
    totalPages: Number.isNaN(totalPages) || totalPages < 1 ? 1 : totalPages,
  };
}

export async function fetchUsers(page: number, limit: number, token: string): Promise<PaginatedResponse<User>> {
  return requestWithPagination<User>(
    `${BASE_URL}/users?page=${page}&per_page=${limit}`, token
);
}

export async function fetchPosts(page: number, limit: number, token: string): Promise<PaginatedResponse<Post>> {
  return requestWithPagination<Post>(
    `${BASE_URL}/posts?page=${page}&per_page=${limit}`, token
  );
}

export async function fetchUserById(id: string, token: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/users/${id}`, { headers: buildHeaders(token) });
  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(
        response.status, 
        body 
        || response.statusText 
        || `Ошибка ${response.status}`
    );
  }
  return response.json();
}

export async function fetchPostById(id: string, token: string): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts/${id}`, { headers: buildHeaders(token) });
  
  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(
        response.status, 
        body 
        || response.statusText 
        || `Ошибка ${response.status}`
    );
  }

  return response.json();
}

export async function fetchPostComments(postId: string, token: string): Promise<CommentItem[]> {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, { headers: buildHeaders(token) });
  
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Ошибка ${response.status}: ${body}`);
  }
  
  return response.json();
}
