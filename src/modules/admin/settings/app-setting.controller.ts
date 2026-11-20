import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminLoginJwtGuard } from '../auth/guards/admin-login-jwt.guard';
import { UpdateAppSettingsDto } from './dto/app-setting.dto';
import { AppSettingService } from './app-setting.service';

@ApiTags('Admin - App Settings')
@ApiBearerAuth()
@UseGuards(AdminLoginJwtGuard)
@Controller('admin/settings')
export class AppSettingController {
  constructor(private appSettingService: AppSettingService) {}

  @Get()
  @ApiOperation({ summary: 'Get app settings' })
  async getSettings() {
    return await this.appSettingService.getSettings();
  }

  @Patch()
  @ApiOperation({ summary: 'Update app settings' })
  async updateSettings(@Body() updateAppSettingsDto: UpdateAppSettingsDto) {
    return await this.appSettingService.updateSettings(updateAppSettingsDto);
  }
}
