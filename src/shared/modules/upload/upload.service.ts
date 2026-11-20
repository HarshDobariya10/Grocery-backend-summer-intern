import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadFileDto } from './dto/upload.dto';
import admin from 'firebase-admin';

@Injectable()
export class UploadService {
  async getPreSignedUrl(param: { uploadFileDto: UploadFileDto }) {
    const { uploadFileDto } = param;
    const { fileName, resourceType } = uploadFileDto;

    const filePath = `${resourceType.toLowerCase()}/${fileName}`;
    const bucket = this.getBucket();
    const file = bucket.file(filePath);

    const [preSignedUrl] = await file.getSignedUrl({
      action: 'write',
      expires: Date.now() + 60 * 60 * 1000,
      version: 'v4',
    });
    const outPutUrl = this.getPublicFileUrl(bucket.name, filePath);

    return {
      preSignedUrl,
      outPutUrl,
    };
  }

  async removeFileFromS3(param: { uploadFileDto: UploadFileDto }) {
    const {
      uploadFileDto: { fileName, resourceType },
    } = param;

    const filePath = `${resourceType.toLowerCase()}/${fileName}`;
    const bucket = this.getBucket();

    await bucket.file(filePath).delete({ ignoreNotFound: true });

    return {
      status: true,
      message: 'File deleted successfully.',
    };
  }

  private getBucket() {
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
      throw new BadRequestException(
        'FIREBASE_STORAGE_BUCKET is not configured.',
      );
    }

    return admin.storage().bucket(bucketName);
  }

  private getPublicFileUrl(bucketName: string, filePath: string) {
    return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`;
  }
}
