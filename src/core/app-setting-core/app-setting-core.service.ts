import { Injectable } from '@nestjs/common';
import { AppSetting, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { AppSettingMessages } from 'src/shared/keys';
import { AppSettingCorePaginateDto } from './dto/app-setting-core.dto';

@Injectable()
export class AppSettingCoreService extends PrismaBaseRepository<
  AppSetting,
  AppSettingCorePaginateDto,
  Prisma.AppSettingCreateArgs,
  Prisma.AppSettingCreateManyArgs,
  Prisma.AppSettingUpdateArgs,
  Prisma.AppSettingUpdateManyArgs,
  Prisma.AppSettingFindUniqueArgs,
  Prisma.AppSettingFindFirstArgs,
  Prisma.AppSettingFindManyArgs,
  Prisma.AppSettingDeleteArgs,
  Prisma.AppSettingDeleteManyArgs,
  Prisma.AppSettingCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.appSetting, {
      NOT_FOUND: AppSettingMessages.NOT_FOUND,
      DELETED: AppSettingMessages.NOT_FOUND,
    });
  }
}
