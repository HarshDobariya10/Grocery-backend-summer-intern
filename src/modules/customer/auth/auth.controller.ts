import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GetUserRequestHeader, GetUserSession } from 'src/shared/decorators';
import { UserSessionType } from 'src/shared/types';
import { UserLoginDto } from './dto/user-create.dto';

@ApiTags('Customer - Auth')
@ApiBearerAuth()
@Controller('customer/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'To let a user login' })
  async login(
    @Body() userLoginDto: UserLoginDto,
    @GetUserRequestHeader() headers: any,
  ) {
    return await this.authService.verifyOtp(userLoginDto, headers);
  }

  @Post(':sessionId/logout')
  @ApiOperation({ summary: 'To let a user logout' })
  async logout(
    @Param('sessionId', new ParseUUIDPipe()) sessionId: string,
    @GetUserSession() sessionData: UserSessionType,
  ) {
    return await this.authService.logout(sessionId, sessionData);
  }
}
