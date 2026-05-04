import { FileService } from './file.service';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    uploadFiles(files: Express.Multer.File[], folderPath: string, req: any): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        name: string;
        type: string;
        size: number;
        folderPath: string | null;
        userId: string;
    }[]>;
    getFiles(req: any): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        name: string;
        type: string;
        size: number;
        folderPath: string | null;
        userId: string;
    }[]>;
    deleteFile(req: any, id: string): Promise<{
        message: string;
    }>;
}
