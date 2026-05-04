import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { google, drive_v3 } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class FilesService {
  private drive: drive_v3.Drive;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');
    const refreshToken = this.configService.get<string>('GOOGLE_DRIVE_REFRESH_TOKEN');

    if (clientId && clientSecret && refreshToken) {
      const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
      oauth2Client.setCredentials({ refresh_token: refreshToken });
      this.drive = google.drive({ version: 'v3', auth: oauth2Client });
    } else {
      // Fallback to service account if refresh token is not set
      const clientEmail = this.configService.get<string>('GOOGLE_DRIVE_CLIENT_EMAIL');
      const privateKey = this.configService.get<string>('GOOGLE_DRIVE_PRIVATE_KEY')?.replace(/\\n/g, '\n');

      const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/drive'],
      });
      this.drive = google.drive({ version: 'v3', auth });
    }
  }

  private async ensureFoldersExist(userId: string, basePath: string, relativePath: string) {
    if (!relativePath || !relativePath.includes('/')) return basePath;

    const parts = relativePath.split('/');
    parts.pop(); // remove the file name
    let currentPath = basePath;

    for (const folderName of parts) {
      if (!folderName) continue;
      
      const normalizedPath = currentPath.endsWith('/') ? currentPath : `${currentPath}/`;
      
      const existingFolder = await this.prisma.file.findFirst({
        where: {
          ownerId: userId,
          path: normalizedPath,
          name: folderName,
          isFolder: true
        }
      });

      if (!existingFolder) {
        await this.prisma.file.create({
          data: {
            name: folderName,
            url: '',
            size: 0,
            type: 'folder',
            path: normalizedPath,
            isFolder: true,
            ownerId: userId
          }
        });
      }
      
      currentPath = `${normalizedPath}${folderName}/`;
    }

    return currentPath.endsWith('/') ? currentPath : `${currentPath}/`;
  }

  async uploadFiles(userId: string, files: Express.Multer.File[], path: string = '/', relativePaths: string[] = []) {
    const results = [];
    const folderId = this.configService.get<string>('GOOGLE_DRIVE_FOLDER_ID');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const relativePath = relativePaths[i] || file.originalname;
      const finalPath = await this.ensureFoldersExist(userId, path, relativePath);

      try {
        const driveResponse = await this.drive.files.create({
          requestBody: {
            name: file.originalname,
            parents: folderId ? [folderId] : [],
          },
          media: {
            mimeType: file.mimetype,
            body: Readable.from(file.buffer),
          },
          fields: 'id, webViewLink',
          supportsAllDrives: true,
        });

        const dbFile = await this.prisma.file.create({
          data: {
            name: file.originalname,
            url: driveResponse.data.webViewLink || '',
            size: file.size,
            type: file.mimetype,
            path: finalPath,
            isFolder: false,
            ownerId: userId,
          },
        });

        results.push(dbFile);
      } catch (error) {
        console.error('Drive upload error:', error);
        throw new InternalServerErrorException(`Failed to upload ${file.originalname}`);
      }
    }

    return results;
  }

  async findAll(userId: string, path: string = '/') {
    return this.prisma.file.findMany({
      where: {
        ownerId: userId,
        path: path,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteFile(userId: string, fileId: string) {
    const file = await this.prisma.file.findFirst({
      where: { id: fileId, ownerId: userId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Attempt to delete from Google Drive
    try {
      if (file.url) {
        // Extract ID from webViewLink (format: https://drive.google.com/file/d/ID/view...)
        const match = file.url.match(/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          await this.drive.files.delete({ fileId: match[1], supportsAllDrives: true });
        }
      }
    } catch (error) {
      console.error('Drive delete error (ignoring):', error);
    }

    return this.prisma.file.delete({
      where: { id: fileId },
    });
  }

  async replaceFile(userId: string, fileId: string, newFile: Express.Multer.File) {
    const oldFile = await this.prisma.file.findFirst({
      where: { id: fileId, ownerId: userId },
    });
    
    if (!oldFile) throw new NotFoundException('File not found');
    
    const filePath = oldFile.path;
    await this.deleteFile(userId, fileId);
    return this.uploadFiles(userId, [newFile], filePath);
  }
}
