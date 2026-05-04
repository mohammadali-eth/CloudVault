import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GoogleDriveService } from './google-drive.service';

@Injectable()
export class FileService {
  constructor(
    private prisma: PrismaService,
    private googleDriveService: GoogleDriveService,
  ) {}

  async uploadFiles(files: Express.Multer.File[], userId: string, folderPath?: string) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map((file) => this.googleDriveService.uploadFile(file, folderPath));
    const results = await Promise.all(uploadPromises);

    const dbPromises = results.map((result, index) => {
      const file = files[index];
      return this.prisma.file.create({
        data: {
          name: file.originalname,
          url: result.url,
          type: file.mimetype,
          size: file.size,
          folderPath: folderPath || null,
          userId: userId,
        },
      });
    });

    return Promise.all(dbPromises);
  }

  async getUserFiles(userId: string) {
    return this.prisma.file.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteFile(fileId: string, userId: string) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file || file.userId !== userId) {
      throw new BadRequestException('File not found');
    }

    await this.prisma.file.delete({
      where: { id: fileId },
    });

    return { message: 'File deleted successfully' };
  }
}
