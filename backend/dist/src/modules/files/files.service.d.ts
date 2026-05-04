import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class FilesService {
    private prisma;
    private configService;
    private drive;
    constructor(prisma: PrismaService, configService: ConfigService);
    uploadFiles(userId: string, files: Express.Multer.File[], path?: string): Promise<{
        path: string;
        url: string;
        name: string;
        id: string;
        createdAt: Date;
        type: string;
        size: number;
        ownerId: string;
    }[]>;
    findAll(userId: string, path?: string): Promise<{
        path: string;
        url: string;
        name: string;
        id: string;
        createdAt: Date;
        type: string;
        size: number;
        ownerId: string;
    }[]>;
    deleteFile(userId: string, fileId: string): Promise<{
        path: string;
        url: string;
        name: string;
        id: string;
        createdAt: Date;
        type: string;
        size: number;
        ownerId: string;
    }>;
    replaceFile(userId: string, fileId: string, newFile: Express.Multer.File): Promise<{
        path: string;
        url: string;
        name: string;
        id: string;
        createdAt: Date;
        type: string;
        size: number;
        ownerId: string;
    }[]>;
}
