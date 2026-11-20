import { Controller, Get , Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto';

@ApiTags('Customer - Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

@Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async getAllCategories(
    @Query() baseQueryCoreDto: BaseQueryCoreDto,
    @Query('isActive') isActive?: string,
  ) {
    return await this.categoryService.getAllCategories({
      baseQueryCoreDto,
      isActive: isActive === undefined ? undefined : isActive === 'true',
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  async getCategoryById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.categoryService.getCategoryById(id);
  }
}