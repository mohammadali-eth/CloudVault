import { StorageConfigService } from './storage-config.service';
export declare class StorageConfigController {
    private readonly storageConfigService;
    constructor(storageConfigService: StorageConfigService);
    getConfig(req: any): Promise<{
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
    saveConfig(req: any, data: any): Promise<{
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
