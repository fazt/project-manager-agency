import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, CreateTaskDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'List of projects' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.projectsService.findAll(userId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Project details' })
  async findOne(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.projectsService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project deleted' })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.projectsService.remove(userId, id);
  }

  // Tasks
  @Post(':id/tasks')
  @ApiOperation({ summary: 'Create a task for a project' })
  @ApiResponse({ status: 201, description: 'Task created' })
  async createTask(
    @CurrentUser('id') userId: string,
    @Param('id') projectId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.projectsService.createTask(userId, projectId, dto);
  }

  @Get(':id/tasks')
  @ApiOperation({ summary: 'Get all tasks for a project' })
  @ApiResponse({ status: 200, description: 'List of tasks' })
  async getTasks(
    @CurrentUser('id') userId: string,
    @Param('id') projectId: string,
  ) {
    return this.projectsService.getTasks(userId, projectId);
  }

  // Documents
  @Get(':id/documents')
  @ApiOperation({ summary: 'Get all documents for a project' })
  @ApiResponse({ status: 200, description: 'List of documents' })
  async getDocuments(
    @CurrentUser('id') userId: string,
    @Param('id') projectId: string,
  ) {
    return this.projectsService.getDocuments(userId, projectId);
  }
}
