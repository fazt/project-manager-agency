import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, CreateTaskDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateProjectDto) {
    // Verify client belongs to user
    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId },
    });

    if (!client || client.userId !== userId) {
      throw new ForbiddenException('Client not found or access denied');
    }

    return this.prisma.project.create({
      data: {
        ...dto,
        userId,
      },
      include: {
        client: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { tasks: true, documents: true },
          },
        },
      }),
      this.prisma.project.count({ where: { userId } }),
    ]);

    return {
      data: projects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return project;
  }

  async update(userId: string, id: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.project.update({
      where: { id },
      data: dto,
      include: {
        client: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async remove(userId: string, id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.project.delete({
      where: { id },
    });

    return { message: 'Project deleted successfully' };
  }

  // Tasks
  async createTask(userId: string, projectId: string, dto: CreateTaskDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      throw new ForbiddenException('Project not found or access denied');
    }

    return this.prisma.task.create({
      data: {
        ...dto,
        projectId,
      },
    });
  }

  async getTasks(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      throw new ForbiddenException('Project not found or access denied');
    }

    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Documents
  async getDocuments(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      throw new ForbiddenException('Project not found or access denied');
    }

    return this.prisma.document.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
