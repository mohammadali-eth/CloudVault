import { Module } from '@nestjs/common';
import { StorageConfigService } from './storage-config.service';
import { StorageConfigController } from './storage-config.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [StorageConfigService],
  controllers: [StorageConfigController],
  exports: [StorageConfigService],
})
export class StorageConfigModule {}
