import { FilesService } from './files.service';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    uploadFiles(files: Express.Multer.File[], req: any, path: string): Promise<{
        path: string;
        url: string;
        name: string;
        id: string;
        createdAt: Date;
        type: string;
        size: number;
        ownerId: string;
    }[]>;
    getFiles(req: any, path: string): Promise<{
        path: string;
        url: string;
        name: string;
        id: string;
        createdAt: Date;
        type: string;
        size: number;
        ownerId: string;
    }[]>;
    deleteFile(id: string, req: any): Promise<{
        path: string;
        url: string;
        name: string;
        id: string;
        createdAt: Date;
        type: string;
        size: number;
        ownerId: string;
    }>;
    replaceFile(id: string, file: Express.Multer.File, req: any): Promise<{
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
