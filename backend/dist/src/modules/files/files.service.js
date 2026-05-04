"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const googleapis_1 = require("googleapis");
const config_1 = require("@nestjs/config");
const stream_1 = require("stream");
let FilesService = class FilesService {
    prisma;
    configService;
    drive;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        const clientId = this.configService.get('GOOGLE_CLIENT_ID');
        const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
        const redirectUri = this.configService.get('GOOGLE_REDIRECT_URI');
        const refreshToken = this.configService.get('GOOGLE_DRIVE_REFRESH_TOKEN');
        if (clientId && clientSecret && refreshToken) {
            const oauth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, redirectUri);
            oauth2Client.setCredentials({ refresh_token: refreshToken });
            this.drive = googleapis_1.google.drive({ version: 'v3', auth: oauth2Client });
        }
        else {
            const clientEmail = this.configService.get('GOOGLE_DRIVE_CLIENT_EMAIL');
            const privateKey = this.configService.get('GOOGLE_DRIVE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
            const auth = new googleapis_1.google.auth.JWT({
                email: clientEmail,
                key: privateKey,
                scopes: ['https://www.googleapis.com/auth/drive'],
            });
            this.drive = googleapis_1.google.drive({ version: 'v3', auth });
        }
    }
    async uploadFiles(userId, files, path = '/') {
        const results = [];
        const folderId = this.configService.get('GOOGLE_DRIVE_FOLDER_ID');
        for (const file of files) {
            try {
                const driveResponse = await this.drive.files.create({
                    requestBody: {
                        name: file.originalname,
                        parents: folderId ? [folderId] : [],
                    },
                    media: {
                        mimeType: file.mimetype,
                        body: stream_1.Readable.from(file.buffer),
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
                        path: path,
                        ownerId: userId,
                    },
                });
                results.push(dbFile);
            }
            catch (error) {
                console.error('Drive upload error:', error);
                throw new common_1.InternalServerErrorException(`Failed to upload ${file.originalname}`);
            }
        }
        return results;
    }
    async findAll(userId, path = '/') {
        return this.prisma.file.findMany({
            where: {
                ownerId: userId,
                path: path,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteFile(userId, fileId) {
        const file = await this.prisma.file.findFirst({
            where: { id: fileId, ownerId: userId },
        });
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        try {
            if (file.url) {
                const match = file.url.match(/d\/([a-zA-Z0-9_-]+)/);
                if (match && match[1]) {
                    await this.drive.files.delete({ fileId: match[1], supportsAllDrives: true });
                }
            }
        }
        catch (error) {
            console.error('Drive delete error (ignoring):', error);
        }
        return this.prisma.file.delete({
            where: { id: fileId },
        });
    }
    async replaceFile(userId, fileId, newFile) {
        const oldFile = await this.prisma.file.findFirst({
            where: { id: fileId, ownerId: userId },
        });
        if (!oldFile)
            throw new common_1.NotFoundException('File not found');
        const filePath = oldFile.path;
        await this.deleteFile(userId, fileId);
        return this.uploadFiles(userId, [newFile], filePath);
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], FilesService);
//# sourceMappingURL=files.service.js.map