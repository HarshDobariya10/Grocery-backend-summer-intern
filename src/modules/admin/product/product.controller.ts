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
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductService } from './product.service';

@ApiTags('Admin - Product')
@ApiBearerAuth()
@UseGuards(AdminLoginJwtGuard)
@Controller('admin/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  // @Get()
  // @ApiOperation({ summary: 'Get all products' })
  // @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  // async getAllProducts(
  //   @Query() baseQueryCoreDto: BaseQueryCoreDto,
  //   @Query('isActive') isActive?: string,
  // ) {
  //   return await this.productService.getAllProducts({
  //     baseQueryCoreDto,
  //     isActive: isActive === undefined ? undefined : isActive === 'true',
  //   });
  // }
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({
    name: 'stockStatus',
    required: false,
    enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'],
  })
  async getAllProducts(
    @Query() baseQueryCoreDto: BaseQueryCoreDto,
    @Query('isActive') isActive?: string,
    @Query('categoryId') categoryId?: string,
    @Query('stockStatus') stockStatus?: string,
  ) {
    return await this.productService.getAllProducts({
      baseQueryCoreDto,
      isActive: isActive === undefined ? undefined : isActive === 'true',
      categoryId,
      stockStatus,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  async getProductById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productService.getProductById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create product' })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productService.createProduct(createProductDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  async updateProduct(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  async deleteProduct(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productService.deleteProduct(id);
  }
}
