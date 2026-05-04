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
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const google_drive_service_1 = require("./google-drive.service");
let FileService = class FileService {
    prisma;
    googleDriveService;
    constructor(prisma, googleDriveService) {
        this.prisma = prisma;
        this.googleDriveService = googleDriveService;
    }
    async uploadFiles(files, userId, folderPath) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        const uploadPromises = files.map((file) => this.googleDriveService.uploadFile(file, folderPath));
        const results = await Promise.all(uploadPromises);
        const dbPromises = results.map((result, index) => {
            const file = files[index];
            return this.prisma.file.create({
                data: {
                    name: file.originalname,
                    url: result.url,
                    type: file.mimetype,
                    size: file.size,
                    folderPath: folderPath || null,
                    userId: userId,
                },
            });
        });
        return Promise.all(dbPromises);
    }
    async getUserFiles(userId) {
        return this.prisma.file.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteFile(fileId, userId) {
        const file = await this.prisma.file.findUnique({
            where: { id: fileId },
        });
        if (!file || file.userId !== userId) {
            throw new common_1.BadRequestException('File not found');
        }
        await this.prisma.file.delete({
            where: { id: fileId },
        });
        return { message: 'File deleted successfully' };
    }
};
exports.FileService = FileService;
exports.FileService = FileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        google_drive_service_1.GoogleDriveService])
], FileService);
//# sourceMappingURL=file.service.js.map