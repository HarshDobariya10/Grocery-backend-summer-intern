import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AddressService } from './address.service';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { UserLoginJwtGuard } from '../auth/guards/user-login-jwt.guard'
import { GetUserSession } from 'src/shared/decorators/user-session.decorator';
import { UserSessionType } from 'src/shared/types';

@ApiTags('Customer - Address')
@ApiBearerAuth()
@UseGuards(UserLoginJwtGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @ApiOperation({ summary: 'Get all saved addresses for the logged-in user' })
  @ApiQuery({ name: 'isDefault', required: false, type: Boolean })
  async getAllAddresses(
    @GetUserSession() sessionData: UserSessionType,
    @Query() baseQueryCoreDto: BaseQueryCoreDto,
    @Query('isDefault') isDefault?: string,
  ) {
    return this.addressService.getAllAddresses({
      userId: sessionData.user.id,
      baseQueryCoreDto,
      isDefault: isDefault === undefined ? undefined : isDefault === 'true',
    });
  }

  @Get(':id')
  @ApiOperation({summary: 'Get address for the logged-in user'})
  async getAddressById(
    @GetUserSession() sessionData: UserSessionType,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.addressService.getAddressById(id, sessionData.user.id);
  }

  @Post()
  @ApiOperation({summary: 'add user address'})
  async createAddress(
    @GetUserSession() sessionData: UserSessionType,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressService.createAddress(
      sessionData.user.id,
      createAddressDto,
    );
  }

  @Put(':id')
  @ApiOperation({summary: 'update user address'})
  async updateAddress(
    @GetUserSession() sessionData: UserSessionType,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.updateAddress(
      id,
      sessionData.user.id,
      updateAddressDto,
    );
  }

  @Delete(':id')
  @ApiOperation({summary: 'delete user address'})
  async deleteAddress(
    @GetUserSession() sessionData: UserSessionType,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.addressService.deleteAddress(id, sessionData.user.id);
  }

  @Patch(':id/default')
  @ApiOperation({summary: 'set as default address'})
  async setDefaultAddress(
    @GetUserSession() sessionData: UserSessionType,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.addressService.setDefaultAddress(id, sessionData.user.id);
  }
}