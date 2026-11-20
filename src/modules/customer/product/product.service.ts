import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductCoreService } from 'src/core/product-core';
import { ProductMessages } from 'src/shared/keys';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto';
import { AppSettingCoreService } from 'src/core/app-setting-core';

@Injectable()
export class ProductService {
  constructor(
    private readonly productCoreService: ProductCoreService,
    private readonly appSettingCoreService: AppSettingCoreService
  ) {}

  private async getGlobalThreshold(): Promise<number> {
    const setting = await this.appSettingCoreService.findUnique({
      where: { key: 'low_stock_threshold' },
    });
    return setting ? parseInt(setting.value) : 10;
  }

  private computeStockStatus(stockQty: number, threshold: number): string {
    if (stockQty === 0) return 'OUT_OF_STOCK';
    if (stockQty <= threshold) return 'LOW_STOCK';
    return 'IN_STOCK';
  }

  async getAllProducts(param: {
    baseQueryCoreDto: BaseQueryCoreDto;
    isActive?: boolean;
    categoryId?: string;
    stockStatus?: string;
  }) {
    const { baseQueryCoreDto, isActive, categoryId, stockStatus } = param;

    const threshold = await this.getGlobalThreshold();

    const whereQuery: any = {
      isDeleted: false,
      ...(isActive === true && { isActive: true }),
      ...(categoryId && { categoryId }),
      ...(stockStatus === 'OUT_OF_STOCK' && { stockQty: { equals: 0 } }),
      ...(stockStatus === 'LOW_STOCK' && {
        stockQty: { gt: 0, lte: threshold },
      }),
      ...(stockStatus === 'IN_STOCK' && { stockQty: { gt: threshold } }),
    };

    const result = await this.productCoreService.findPaginate(
      baseQueryCoreDto,
      whereQuery,
    );

    const list = result.list.map((product: any) => ({
      ...product,
      stockStatus: this.computeStockStatus(product.stockQty, threshold),
      threshold,
    }));

    return { ...result, list };
  }

  async getProductById(id: string) {
    const product = await this.productCoreService.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!product) {
      throw new BadRequestException(ProductMessages.NOT_FOUND);
    }

    const threshold = await this.getGlobalThreshold();

    return {
      ...product,
      stockStatus: this.computeStockStatus(
        (product as any).stockQty,
        threshold,
      ),
      threshold,
    };
  }
}