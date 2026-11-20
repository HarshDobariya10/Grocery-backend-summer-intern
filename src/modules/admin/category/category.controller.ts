import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto';
import { AdminLoginJwtGuard } from '../auth/guards/admin-login-jwt.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@ApiTags('Admin - Category')
@ApiBearerAuth()
@UseGuards(AdminLoginJwtGuard)
@Controller('admin/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

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

  @Post()
  @ApiOperation({ summary: 'Create category' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  async updateCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  async deleteCategory(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.categoryService.deleteCategory(id);
  }
}
