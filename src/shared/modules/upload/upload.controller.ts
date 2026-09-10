import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RESOURCE_TYPE, UploadFileDto } from './dto/upload.dto';
import { UseGuards } from '@nestjs/common';
import { AdminLoginJwtGuard } from '../../../modules/admin/auth/guards/admin-login-jwt.guard';

@ApiBearerAuth()
@ApiTags('Upload')
@UseGuards(AdminLoginJwtGuard)
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('local')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          callback(new BadRequestException('Only image files are allowed.'), false);
          return;
        }

        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiOperation({ summary: 'Upload a file locally and return its public URL' })
  async uploadLocalFile(
    @UploadedFile() file: any,
    @Query('resourceType') resourceType?: RESOURCE_TYPE,
  ) {
    if (!file) {
      throw new BadRequestException('File is required.');
    }

    return this.uploadService.saveLocalFile({
      file,
      resourceType,
    });
  }

  @Get('presinged-url')
  @ApiOperation({ summary: 'Get presinged url for upload file to s3 bucket' })
  async getPreSignedUrl(@Query() uploadFileDto: UploadFileDto) {
    return await this.uploadService.getPreSignedUrl({
      uploadFileDto,
    });
  }

  @ApiOperation({ summary: 'Delete file from s3 bucket' })
  @Delete('delete-file')
  async deleteFile(@Query() uploadFileDto: UploadFileDto) {
    return this.uploadService.removeFileFromS3({
      uploadFileDto,
    });
  }
}
