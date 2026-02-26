'use client';

import { useState, useEffect } from 'react';
import { usersApi, type User } from '@/lib/api';

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token') || '';
        const userData = await usersApi.getMe(token);
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
        });
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSaving(true);

    try {
      const token = localStorage.getItem('access_token') || '';
      const updated = await usersApi.updateMe(formData, token);
      setUser(updated);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const token = localStorage.getItem('access_token') || '';
      await usersApi.uploadAvatar(file, token);
      setMessage({ type: 'success', text: 'Avatar updated successfully' });
      // Refresh user data
      const userData = await usersApi.getMe(token);
      setUser(userData);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload avatar' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
      <p className="mt-1 text-muted-foreground">
        Manage your account settings and profile information.
      </p>

      {message && (
        <div
          className={`mt-6 rounded-lg p-4 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Avatar Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">Avatar</h2>
        <div className="mt-4 flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              user?.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <label className="cursor-pointer rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent">
              Change avatar
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
            <p className="mt-2 text-xs text-muted-foreground">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">Role</label>
          <p className="mt-1 rounded-lg border border-input bg-muted px-4 py-2 text-muted-foreground">
            {user?.role}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">Member since</label>
          <p className="mt-1 rounded-lg border border-input bg-muted px-4 py-2 text-muted-foreground">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="mt-12 rounded-lg border border-destructive/50 p-6">
        <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
              const token = localStorage.getItem('access_token') || '';
              usersApi.deleteMe(token).then(() => {
                localStorage.clear();
                window.location.href = '/';
              });
            }
          }}
          className="mt-4 rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
