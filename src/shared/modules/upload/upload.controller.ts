import { Controller, Get, Delete, Query } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadFileDto } from './dto/upload.dto';

@ApiBearerAuth()
@ApiTags('Upload file to Firebase Storage')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Get('presinged-url')
  @ApiOperation({ summary: 'Get presigned url for upload file to Firebase Storage' })
  async getPreSignedUrl(@Query() uploadFileDto: UploadFileDto) {
    return await this.uploadService.getPreSignedUrl({
      uploadFileDto,
    });
  }

  @ApiOperation({ summary: 'Delete file from Firebase Storage' })
  @Delete('delete-file')
  async deleteFile(@Query() uploadFileDto: UploadFileDto) {
    return this.uploadService.removeFileFromS3({
      uploadFileDto,
    });
  }
}
