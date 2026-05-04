import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { GoogleDriveService } from './google-drive.service';

@Module({
  controllers: [FileController],
  providers: [FileService, GoogleDriveService],
})
export class FileModule {}
