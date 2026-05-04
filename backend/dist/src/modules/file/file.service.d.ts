import { PrismaService } from '../../prisma/prisma.service';
import { GoogleDriveService } from './google-drive.service';
export declare class FileService {
    private prisma;
    private googleDriveService;
    constructor(prisma: PrismaService, googleDriveService: GoogleDriveService);
    uploadFiles(files: Express.Multer.File[], userId: string, folderPath?: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        name: string;
        type: string;
        size: number;
        folderPath: string | null;
        userId: string;
    }[]>;
    getUserFiles(userId: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        name: string;
        type: string;
        size: number;
        folderPath: string | null;
        userId: string;
    }[]>;
    deleteFile(fileId: string, userId: string): Promise<{
        message: string;
    }>;
}
