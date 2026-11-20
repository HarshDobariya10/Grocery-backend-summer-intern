import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { ProductMessages } from 'src/shared/keys';
import { ProductCorePaginateDto } from './dto/product-core.dto';

@Injectable()
export class ProductCoreService extends PrismaBaseRepository<
  Product,
  ProductCorePaginateDto,
  Prisma.ProductCreateArgs,
  Prisma.ProductCreateManyArgs,
  Prisma.ProductUpdateArgs,
  Prisma.ProductUpdateManyArgs,
  Prisma.ProductFindUniqueArgs,
  Prisma.ProductFindFirstArgs,
  Prisma.ProductFindManyArgs,
  Prisma.ProductDeleteArgs,
  Prisma.ProductDeleteManyArgs,
  Prisma.ProductCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.product, {
      NOT_FOUND: ProductMessages.NOT_FOUND,
      DELETED: ProductMessages.DELETED,
    });
  }
}
