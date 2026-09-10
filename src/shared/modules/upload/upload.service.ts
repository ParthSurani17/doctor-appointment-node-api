import { Injectable } from '@nestjs/common';
import { UploadFileDto } from './dto/upload.dto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3 } from 'aws-sdk';
import { promises as fs } from 'fs';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { RESOURCE_TYPE } from './dto/upload.dto';

@Injectable()
export class UploadService {
  async saveLocalFile(param: {
    file: { originalname: string; buffer: Buffer; mimetype: string; size: number };
    resourceType?: RESOURCE_TYPE;
  }) {
    const { file, resourceType } = param;
    const selectedResourceType: RESOURCE_TYPE =
      resourceType && Object.values(RESOURCE_TYPE).includes(resourceType)
        ? resourceType
        : RESOURCE_TYPE.DOCTOR;
    const folder = selectedResourceType.toLowerCase();
    const uploadDir = join(process.cwd(), 'uploads', folder);
    const safeBaseName = file.originalname
      .replace(extname(file.originalname), '')
      .replace(/[^a-z0-9-_]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
    const extension = extname(file.originalname).toLowerCase();
    const fileName = `${safeBaseName || 'upload'}-${Date.now()}-${randomUUID()}${extension}`;

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(join(uploadDir, fileName), file.buffer);

    const relativePath = `/uploads/${folder}/${fileName}`;

    return {
      fileName,
      path: relativePath,
      url: `${process.env.APP_URL || 'http://localhost:3000'}${relativePath}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

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
