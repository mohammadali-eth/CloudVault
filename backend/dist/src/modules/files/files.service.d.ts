import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class FilesService {
    private prisma;
    private configService;
    private drive;
    constructor(prisma: PrismaService, configService: ConfigService);
    private ensureFoldersExist;
    uploadFiles(userId: string, files: Express.Multer.File[], path?: string, relativePaths?: string[], provider?: string): Promise<{
        path: string;
        url: string;
        name: string;
        id: string;
        createdAt: Date;
        size: number;
        type: string;
        isFolder: boolean;
        provider: string;
        providerFileId: string | null;
        ownerId: string;
    }[]>;
    findAll(userId: string, path?: string): Promise<{
        path: string;
        url: string;
        name: string;
        id: string;
        createdAt: Date;
        size: number;
        type: string;
        isFolder: boolean;
        provider: string;
        providerFileId: string | null;
        ownerId: string;
    }[]>;
    deleteFile(userId: string, fileId: string): Promise<{
        path: string;
        url: string;
        name: string;
        id: string;
        createdAt: Date;
        size: number;
        type: string;
        isFolder: boolean;
        provider: string;
        providerFileId: string | null;
        ownerId: string;
    }>;
    replaceFile(userId: string, fileId: string, newFile: Express.Multer.File): Promise<{
        path: string;
        url: string;
        name: string;
        id: string;
        createdAt: Date;
        size: number;
        type: string;
        isFolder: boolean;
        provider: string;
        providerFileId: string | null;
        ownerId: string;
    }[]>;
}
