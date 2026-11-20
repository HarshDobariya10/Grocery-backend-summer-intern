import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUserRequestHeader, GetUserSession } from 'src/shared/decorators';
import { UserSessionType } from 'src/shared/types';
import { DriverAuthService } from './auth.service';
import { DriverLoginDto } from './dto';

@ApiTags('Driver - Auth')
@ApiBearerAuth()
@Controller('driver/auth')
export class DriverAuthController {
  constructor(private authService: DriverAuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Log in a driver via Firebase phone auth token' })
  async login(
    @Body() userLoginDto: DriverLoginDto,
    @GetUserRequestHeader() headers: any,
  ) {
    return await this.authService.login(userLoginDto, headers);
  }

  @Post(':sessionId/logout')
  @ApiOperation({ summary: 'Log driver out' })
  async logout(
    @Param('sessionId', new ParseUUIDPipe()) sessionId: string,
    @GetUserSession() sessionData: UserSessionType,
  ) {
    return await this.authService.logout(sessionId, sessionData);
  }
}
