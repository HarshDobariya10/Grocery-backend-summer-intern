import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryCoreService } from 'src/core/category-core';
import { ProductCoreService } from 'src/core/product-core';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto';
import { CategoryMessages } from 'src/shared/keys';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryCoreService: CategoryCoreService,
    private readonly productCoreService: ProductCoreService,
  ) {}

  async getAllCategories(param: {
    baseQueryCoreDto: BaseQueryCoreDto;
    isActive?: boolean;
  }) {
    const { baseQueryCoreDto, isActive } = param;

    const whereQuery: any = {
      isDeleted: false,
      ...(isActive === true && { isActive: true }),
    };

    const categories = await this.categoryCoreService.findPaginate(
      baseQueryCoreDto,
      whereQuery,
    );

    const dataWithCount = await Promise.all(
      categories.list.map(async (category) => {
        const productCount = await this.productCoreService.getCount({
          where: {
            categoryId: category.id,
            isDeleted: false,
          },
        });

        return { ...category, productCount };
      }),
    );

    return { ...categories, list: dataWithCount };
  }

  async getCategoryById(id: string) {
    const category = await this.categoryCoreService.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!category) {
      throw new BadRequestException(CategoryMessages.NOT_FOUND);
    }

    return category;
  }
}