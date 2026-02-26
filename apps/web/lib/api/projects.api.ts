import { api } from './client';

export type ProjectStatus = 'PENDING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  projectId: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  budget?: number;
  clientId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    name: string;
    email: string;
  };
  tasks?: Task[];
  documents?: Document[];
  _count?: {
    tasks: number;
    documents: number;
  };
}

export interface CreateProjectData {
  name: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
  budget?: number;
  clientId: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}

export interface ProjectsResponse {
  data: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProjectsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus;
  clientId?: string;
}

export const projectsApi = {
  getAll: (query: ProjectsQuery = {}, token: string) => {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.search) params.append('search', query.search);
    if (query.status) params.append('status', query.status);
    if (query.clientId) params.append('clientId', query.clientId);

    const queryString = params.toString();
    return api.get<ProjectsResponse>(`/projects${queryString ? `?${queryString}` : ''}`, { token });
  },

  getById: (id: string, token: string) =>
    api.get<Project>(`/projects/${id}`, { token }),

  create: (data: CreateProjectData, token: string) =>
    api.post<Project>('/projects', data, { token }),

  update: (id: string, data: UpdateProjectData, token: string) =>
    api.patch<Project>(`/projects/${id}`, data, { token }),

  delete: (id: string, token: string) =>
    api.delete<void>(`/projects/${id}`, { token }),

  // Tasks
  getTasks: (projectId: string, token: string) =>
    api.get<Task[]>(`/projects/${projectId}/tasks`, { token }),

  createTask: (projectId: string, data: CreateTaskData, token: string) =>
    api.post<Task>(`/projects/${projectId}/tasks`, data, { token }),

  // Documents
  getDocuments: (projectId: string, token: string) =>
    api.get<Document[]>(`/projects/${projectId}/documents`, { token }),
};
