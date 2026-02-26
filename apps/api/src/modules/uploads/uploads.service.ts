import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UploadsService {
  constructor(private prisma: PrismaService) {}

  async uploadFile(userId: string, file: Express.Multer.File, projectId?: string) {
    // In a real app, upload to Cloudinary here
    const mockCloudinaryResponse = {
      url: `https://res.cloudinary.com/demo/image/upload/v${Date.now()}/${file.originalname}`,
      publicId: `uploads/${Date.now()}_${file.originalname}`,
    };

    if (projectId) {
      // Save as project document
      const document = await this.prisma.document.create({
        data: {
          name: file.originalname,
          url: mockCloudinaryResponse.url,
          type: file.mimetype,
          size: file.size,
          projectId,
        },
      });

      return document;
    }

    return mockCloudinaryResponse;
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    // In a real app, upload to Cloudinary here
    const mockCloudinaryResponse = {
      url: `https://res.cloudinary.com/demo/image/upload/v${Date.now()}/avatars/${file.originalname}`,
    };

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: mockCloudinaryResponse.url },
    });

    return { avatar: mockCloudinaryResponse.url };
  }

  async deleteFile(publicId: string) {
    // In a real app, delete from Cloudinary here
    return { deleted: true, publicId };
  }
}
