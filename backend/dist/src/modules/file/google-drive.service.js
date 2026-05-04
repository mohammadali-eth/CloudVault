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
exports.GoogleDriveService = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
const stream_1 = require("stream");
let GoogleDriveService = class GoogleDriveService {
    drive;
    constructor() {
        const auth = new googleapis_1.google.auth.JWT({
            email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
            key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });
        this.drive = googleapis_1.google.drive({ version: 'v3', auth });
    }
    async uploadFile(file, folderPath) {
        try {
            const fileMetadata = {
                name: file.originalname,
                parents: process.env.GOOGLE_DRIVE_FOLDER_ID ? [process.env.GOOGLE_DRIVE_FOLDER_ID] : [],
            };
            const media = {
                mimeType: file.mimetype,
                body: stream_1.Readable.from(file.buffer),
            };
            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: 'id, webViewLink',
            });
            return {
                id: response.data.id,
                url: response.data.webViewLink,
            };
        }
        catch (error) {
            console.error('Google Drive Upload Error:', error.response?.data || error.message || error);
            throw error;
        }
    }
};
exports.GoogleDriveService = GoogleDriveService;
exports.GoogleDriveService = GoogleDriveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleDriveService);
//# sourceMappingURL=google-drive.service.js.map