import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { StorageConfigService } from './storage-config.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('storage-config')
@UseGuards(JwtAuthGuard)
export class StorageConfigController {
  constructor(private readonly storageConfigService: StorageConfigService) {}

  @Get()
  async getConfig(@Request() req: any) {
    return this.storageConfigService.getByUserId(req.user.id);
  }

  @Post()
  async saveConfig(@Request() req: any, @Body() data: any) {
    return this.storageConfigService.save(req.user.id, data);
  }
}
