import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class StorageConfigService {
  constructor(private prisma: PrismaService) {}

  async getByUserId(userId: string) {
    const config = await this.prisma.storageConfig.findUnique({
      where: { userId },
    });
    if (!config) return null;
    return config;
  }

  async save(userId: string, data: any) {
    const {
      googleEmail,
      googleKey,
      googleFolderId,
      cloudinaryName,
      cloudinaryKey,
      cloudinarySecret,
      telegramToken,
      telegramChatId,
    } = data;

    const configData = {
      googleEmail,
      googleKey,
      googleFolderId,
      cloudinaryName,
      cloudinaryKey,
      cloudinarySecret,
      telegramToken,
      telegramChatId,
    };

    return this.prisma.storageConfig.upsert({
      where: { userId },
      update: configData,
      create: {
        userId,
        ...configData,
      },
    });
  }
}
