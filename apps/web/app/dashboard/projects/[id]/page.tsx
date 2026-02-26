'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/dashboard/header';
import { projectsApi, type Project, type Task, type TaskStatus } from '@/lib/api';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  ON_HOLD: 'bg-gray-100 text-gray-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const taskStatusColors: Record<string, string> = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  DONE: 'bg-green-100 text-green-800',
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'TODO' as TaskStatus });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('access_token') || '';
        const [projectData, tasksData] = await Promise.all([
          projectsApi.getById(params.id as string, token),
          projectsApi.getTasks(params.id as string, token),
        ]);
        setProject(projectData);
        setTasks(tasksData);
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token') || '';
      const task = await projectsApi.createTask(params.id as string, newTask, token);
      setTasks((prev) => [...prev, task]);
      setNewTask({ title: '', description: '', status: 'TODO' });
      setShowTaskForm(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('access_token') || '';
      await projectsApi.delete(params.id as string, token);
      router.push('/dashboard/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header breadcrumb={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Projects', href: '/dashboard/projects' }, { name: 'Loading...', href: '#' }]} />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Header breadcrumb={[{ name: 'Dashboard', href: '/dashboard' }, { name: 'Projects', href: '/dashboard/projects' }, { name: 'Not Found', href: '#' }]} />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Project not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        breadcrumb={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Projects', href: '/dashboard/projects' },
          { name: project.name, href: `/dashboard/projects/${project.id}` },
        ]}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[project.status]}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            {project.description && (
              <p className="mt-2 text-muted-foreground">{project.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Client</p>
            <p className="mt-1 font-medium text-foreground">{project.client?.name || 'N/A'}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Start Date</p>
            <p className="mt-1 font-medium text-foreground">
              {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">End Date</p>
            <p className="mt-1 font-medium text-foreground">
              {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Budget</p>
            <p className="mt-1 font-medium text-foreground">
              {project.budget ? `$${project.budget.toLocaleString()}` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-semibold text-foreground">Tasks</h2>
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Add Task
            </button>
          </div>

          {showTaskForm && (
            <form onSubmit={handleAddTask} className="border-b border-border p-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                  required
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="flex gap-2">
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, status: e.target.value as TaskStatus }))}
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="divide-y divide-border">
            {tasks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No tasks yet. Add your first task above.
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-foreground">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    )}
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${taskStatusColors[task.status]}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
