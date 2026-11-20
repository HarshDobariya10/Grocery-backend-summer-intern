import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto';
import { CategoryCoreService } from 'src/core/category-core';
import { ProductCoreService } from 'src/core/product-core';
import { CategoryMessages, ProductMessages } from 'src/shared/keys';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { AppSettingCoreService } from 'src/core/app-setting-core';

@Injectable()
export class ProductService {
  constructor(
    private productCoreService: ProductCoreService,
    private categoryCoreService: CategoryCoreService,
    private appSettingCoreService: AppSettingCoreService,
  ) {}

  // async getAllProducts(param: {
  //   baseQueryCoreDto: BaseQueryCoreDto;
  //   isActive?: boolean;
  //   categoryId?: string;
  // }) {
  //   const { baseQueryCoreDto, isActive, categoryId } = param;

  //   const whereQuery: any = {
  //     isDeleted: false,
  //     ...(typeof isActive === 'boolean' && { isActive }),
  //     ...(categoryId && { categoryId }),
  //   };

  //   return await this.productCoreService.findPaginate(baseQueryCoreDto, whereQuery);
  // }

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

  async createProduct(createProductDto: CreateProductDto) {
    const category = await this.categoryCoreService.findFirst({
      where: { id: createProductDto.categoryId, isDeleted: false },
    });

    if (!category) {
      throw new BadRequestException(CategoryMessages.NOT_FOUND);
    }

    const existingProduct = await this.productCoreService.findFirst({
      where: {
        categoryId: createProductDto.categoryId,
        name: createProductDto.name.trim(),
        isDeleted: false,
      },
    });

    if (existingProduct) {
      throw new BadRequestException(ProductMessages.ALREADY_EXISTS);
    }

    return await this.productCoreService.create({
      data: {
        ...createProductDto,
        name: createProductDto.name.trim(),
      } as any,
    });
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productCoreService.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!product) {
      throw new BadRequestException(ProductMessages.NOT_FOUND);
    }

    if (updateProductDto.categoryId) {
      const category = await this.categoryCoreService.findFirst({
        where: { id: updateProductDto.categoryId, isDeleted: false },
      });

      if (!category) {
        throw new BadRequestException(CategoryMessages.NOT_FOUND);
      }
    }

    const categoryId = updateProductDto.categoryId ?? product.categoryId;
    const name = (updateProductDto.name ?? product.name).trim();

    const duplicateProduct = await this.productCoreService.findFirst({
      where: {
        categoryId,
        name,
        isDeleted: false,
        NOT: { id },
      },
    });

    if (duplicateProduct) {
      throw new BadRequestException(ProductMessages.ALREADY_EXISTS);
    }

    return await this.productCoreService.update({
      where: { id },
      data: {
        ...updateProductDto,
        ...(updateProductDto.name && {
          name: updateProductDto.name.trim(),
        }),
      } as any,
    });
  }

  async deleteProduct(id: string) {
    const product = await this.productCoreService.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!product) {
      throw new BadRequestException(ProductMessages.NOT_FOUND);
    }

    await this.productCoreService.update({
      where: { id },
      data: { isDeleted: true } as any,
    });

    return { message: ProductMessages.DELETED_SUCCESS };
  }
}
