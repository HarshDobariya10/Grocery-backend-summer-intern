import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { CategoryMessages } from 'src/shared/keys';
import { CategoryCorePaginateDto } from './dto/category-core.dto';

@Injectable()
export class CategoryCoreService extends PrismaBaseRepository<
  Category,
  CategoryCorePaginateDto,
  Prisma.CategoryCreateArgs,
  Prisma.CategoryCreateManyArgs,
  Prisma.CategoryUpdateArgs,
  Prisma.CategoryUpdateManyArgs,
  Prisma.CategoryFindUniqueArgs,
  Prisma.CategoryFindFirstArgs,
  Prisma.CategoryFindManyArgs,
  Prisma.CategoryDeleteArgs,
  Prisma.CategoryDeleteManyArgs,
  Prisma.CategoryCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.category, {
      NOT_FOUND: CategoryMessages.NOT_FOUND,
      DELETED: CategoryMessages.DELETED,
    });
  }
}

