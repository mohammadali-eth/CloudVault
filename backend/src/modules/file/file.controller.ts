import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10, {
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
  }))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folderPath') folderPath: string,
    @Request() req,
  ) {
    return this.fileService.uploadFiles(files, req.user.id, folderPath);
  }

  @Get()
  async getFiles(@Request() req) {
    return this.fileService.getUserFiles(req.user.id);
  }

  @Post(':id/delete') // Using POST for simpler frontend integration if needed, or DELETE
  async deleteFile(@Request() req, @Body('id') id: string) {
    return this.fileService.deleteFile(id, req.user.id);
  }
}
