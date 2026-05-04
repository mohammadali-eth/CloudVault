export declare class GoogleDriveService {
    private drive;
    constructor();
    uploadFile(file: Express.Multer.File, folderPath?: string): Promise<{
        id: any;
        url: any;
    }>;
}
