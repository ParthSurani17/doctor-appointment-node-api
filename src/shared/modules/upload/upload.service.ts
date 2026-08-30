import { Injectable } from '@nestjs/common';
import { UploadFileDto } from './dto/upload.dto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3 } from 'aws-sdk';

@Injectable()
export class UploadService {
  async getPreSignedUrl(param: { uploadFileDto: UploadFileDto }) {
    const {
      uploadFileDto: { fileName, resourceType },
    } = param;

    const client = new S3Client({
      region: process.env.AWS_REGION as string,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });

    const bucket = process.env.AWS_BUCKET;
    const filePath = `${resourceType.toLowerCase()}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: filePath,
      ACL: 'public-read',
    });

    const preSignedUrl = await getSignedUrl(client, command, {
      expiresIn: 3600,
    });
    const outPutUrl = `https://${bucket}/${filePath}`;

    return {
      preSignedUrl,
      outPutUrl,
    };
  }

  removeFileFromS3(param: { uploadFileDto: UploadFileDto }) {
    const {
      uploadFileDto: { fileName, resourceType },
    } = param;

    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const filePath = `${resourceType.toLowerCase()}/${fileName}`;

    return new Promise((resolve, reject) => {
      return s3.deleteObject(
        {
          Bucket: process.env.AWS_BUCKET as string,
          Key: filePath,
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });
  }
}
