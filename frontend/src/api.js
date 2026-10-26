const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const AUTH_TOKEN_KEY = 'taskflow-access-token';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers);
  if (options.body) headers.set('Content-Type', 'application/json');
  const accessToken = token || localStorage.getItem(AUTH_TOKEN_KEY);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  if (response.status === 204) return null;

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(result.error || 'The request could not be completed.', response.status);
  }
  return result;
}

export function register(name, email, password) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getCurrentUser(token) {
  return request('/auth/me', { token });
}

export function logout(token) {
  return request('/auth/logout', { method: 'POST', token });
}

export async function getTasks(token) {
  const result = await request('/tasks', { token });
  return result.tasks;
}

export async function createTask(task) {
  const result = await request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  });
  return result.task;
}

export function deleteTask(id) {
  return request(`/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
