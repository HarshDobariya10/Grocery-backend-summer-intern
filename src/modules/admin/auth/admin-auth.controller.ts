import { Body, Controller, Post, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import {
  AdminLoginDto,
  AdminCreateDto,
} from './dto/admin-auth.dto';
import { GetUserRequestHeader, GetUserSession } from 'src/shared/decorators';
import { UserSessionType } from 'src/shared/types';

@ApiTags('Admin - Auth')
@ApiBearerAuth()
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'To let a admin sign up' })
  async signup(
    @Body() adminCreateDto: AdminCreateDto,
    @GetUserRequestHeader() headers: any,
  ) {
    return await this.adminAuthService.signup(adminCreateDto, headers);
  }

  @Post('login')
  @ApiOperation({ summary: 'To let a admin login' })
  async login(
    @Body() adminLoginDto: AdminLoginDto,
    @GetUserRequestHeader() headers: any,
  ) {
    return await this.adminAuthService.login(adminLoginDto, headers);
  }

  @Post(':sessionId/logout')
  @ApiOperation({ summary: 'Admin logout' })
  async logout(
    @Param('sessionId', new ParseUUIDPipe()) sessionId: string,
    @GetUserSession() sessionData: UserSessionType,
  ) {
    return await this.adminAuthService.logout(sessionId, sessionData);
  }
}
