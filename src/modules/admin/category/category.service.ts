import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto';
import { CategoryCoreService } from 'src/core/category-core';
import { CategoryMessages } from 'src/shared/keys';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { ProductCoreService } from 'src/core/product-core';

@Injectable()
export class CategoryService {
  constructor(
    private categoryCoreService: CategoryCoreService,
    private productCoreService: ProductCoreService,
  ) {}

  // async getAllCategories(param: {
  //   baseQueryCoreDto: BaseQueryCoreDto;
  //   isActive?: boolean;
  // }) {
  //   const { baseQueryCoreDto, isActive } = param;

  //   const whereQuery: any = {
  //     isDeleted: false,
  //     ...(isActive === true && { isActive: true }),
  //   };

  //   return await this.categoryCoreService.findPaginate(
  //     baseQueryCoreDto,
  //     whereQuery,
  //   );
  // }
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

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoryCoreService.findFirst({
      where: {
        name: createCategoryDto.name.trim().toLowerCase(),
        isDeleted: false,
      },
    });

    if (existingCategory) {
      throw new BadRequestException(CategoryMessages.ALREADY_EXISTS);
    }

    return await this.categoryCoreService.create({
      data: {
        ...createCategoryDto,
        name: createCategoryDto.name.trim(),
      } as any,
    });
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryCoreService.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!category) {
      throw new BadRequestException(CategoryMessages.NOT_FOUND);
    }

    if (updateCategoryDto.name) {
      const duplicateCategory = await this.categoryCoreService.findFirst({
        where: {
          name: updateCategoryDto.name.trim().toLowerCase(),
          isDeleted: false,
          NOT: { id },
        },
      });

      if (duplicateCategory) {
        throw new BadRequestException(CategoryMessages.ALREADY_EXISTS);
      }
    }

    return await this.categoryCoreService.update({
      where: { id },
      data: {
        ...updateCategoryDto,
        ...(updateCategoryDto.name && {
          name: updateCategoryDto.name.trim(),
        }),
      } as any,
    });
  }

  async deleteCategory(id: string) {
    const category = await this.categoryCoreService.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!category) {
      throw new BadRequestException(CategoryMessages.NOT_FOUND);
    }

    await this.categoryCoreService.update({
      where: { id },
      data: { isDeleted: true } as any,
    });

    return { message: CategoryMessages.DELETED_SUCCESS };
  }
}
