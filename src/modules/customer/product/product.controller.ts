import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto';

@ApiTags('Customer - Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

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
  
}