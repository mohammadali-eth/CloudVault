import { PrismaService } from '../../database/prisma.service';
export declare class StorageConfigService {
    private prisma;
    constructor(prisma: PrismaService);
    getByUserId(userId: string): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        googleEmail: string | null;
        googleKey: string | null;
        googleFolderId: string | null;
        cloudinaryName: string | null;
        cloudinaryKey: string | null;
        cloudinarySecret: string | null;
        telegramToken: string | null;
        telegramChatId: string | null;
    } | null>;
    save(userId: string, data: any): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        googleEmail: string | null;
        googleKey: string | null;
        googleFolderId: string | null;
        cloudinaryName: string | null;
        cloudinaryKey: string | null;
        cloudinarySecret: string | null;
        telegramToken: string | null;
        telegramChatId: string | null;
    }>;
}
