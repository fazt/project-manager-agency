import { api } from './client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

export const usersApi = {
  getMe: (token: string) =>
    api.get<User>('/users/me', { token }),

  updateMe: (data: UpdateUserData, token: string) =>
    api.patch<User>('/users/me', data, { token }),

  deleteMe: (token: string) =>
    api.delete<void>('/users/me', { token }),

  uploadAvatar: async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/uploads/avatar`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload avatar');
    }

    return response.json();
  },
};
