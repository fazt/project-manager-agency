'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/dashboard/header';
import { clientsApi, projectsApi, type Client, type Project } from '@/lib/api';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token') || '';
        const [clientData, projectsData] = await Promise.all([
          clientsApi.getById(params.id as string, token),
          projectsApi.getAll({ clientId: params.id as string }, token),
        ]);
        setClient(clientData);
        setFormData(clientData);
        setProjects(projectsData.data);
      } catch (error) {
        console.error('Failed to fetch client:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token') || '';
      const updated = await clientsApi.update(params.id as string, formData, token);
      setClient(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update client:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      const token = localStorage.getItem('access_token') || '';
      await clientsApi.delete(params.id as string, token);
      router.push('/dashboard/clients');
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isLoading) {
    return (
      <>
        <Header breadcrumb={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Clients', href: '/dashboard/clients' }, { name: 'Loading...', href: '#' }]} />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </>
    );
  }

  if (!client) {
    return (
      <>
        <Header breadcrumb={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Clients', href: '/dashboard/clients' }, { name: 'Not Found', href: '#' }]} />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Client not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        breadcrumb={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Clients', href: '/dashboard/clients' },
          { name: client.name, href: `/dashboard/clients/${client.id}` },
        ]}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${client.type === 'COMPANY' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                {client.type}
              </span>
            </div>
            {client.companyName && (
              <p className="mt-1 text-muted-foreground">{client.companyName}</p>
            )}
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Client Details */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">Client Details</h2>
            <div className="mt-4 space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">Notes</label>
                    <textarea
                      name="notes"
                      rows={3}
                      value={formData.notes || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{client.email}</p>
                  </div>
                  {client.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">{client.phone}</p>
                    </div>
                  )}
                  {client.address && (
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium text-foreground">{client.address}</p>
                    </div>
                  )}
                  {client.website && (
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <a href={client.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                        {client.website}
                      </a>
                    </div>
                  )}
                  {client.taxId && (
                    <div>
                      <p className="text-sm text-muted-foreground">Tax ID</p>
                      <p className="font-medium text-foreground">{client.taxId}</p>
                    </div>
                  )}
                  {client.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="font-medium text-foreground">{client.notes}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Projects</h2>
              <Link
                href={`/dashboard/projects/new?clientId=${client.id}`}
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                New Project
              </Link>
            </div>
            <div className="mt-4">
              {projects.length === 0 ? (
                <p className="text-center text-muted-foreground">No projects yet</p>
              ) : (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/dashboard/projects/${project.id}`}
                      className="block rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">{project.name}</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
