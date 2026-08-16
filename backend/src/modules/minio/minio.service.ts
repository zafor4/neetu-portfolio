import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand, 
  PutBucketPolicyCommand, ListObjectsV2Command, DeleteObjectCommand 
} from '@aws-sdk/client-s3';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = this.configService.get<number>('MINIO_PORT', 9000);
    const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin');
    const secretKey = this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin123');
    this.bucketName = this.configService.get<string>('MINIO_BUCKET', 'portfolio-assets');

    this.s3Client = new S3Client({
      endpoint: `http://${endpoint}:${port}`,
      region: 'us-east-1',
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      forcePathStyle: true,
    });
  }

  async onModuleInit() {
    try {
      await this.ensureBucketExists();
    } catch (err) {
      this.logger.warn(`MinIO connection warning: ${err.message}. Bucket creation will be retried on upload.`);
    }
  }

  private async ensureBucketExists() {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
      this.logger.log(`MinIO Bucket '${this.bucketName}' exists.`);
    } catch (err) {
      this.logger.log(`Bucket '${this.bucketName}' not found. Creating...`);
      await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
      
      const policy = JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      });
      await this.s3Client.send(new PutBucketPolicyCommand({ Bucket: this.bucketName, Policy: policy }));
    }
  }

  async uploadFile(file: Express.Multer.File, folder = 'images'): Promise<{ filename: string; url: string; size: number; key: string }> {
    await this.ensureBucketExists();
    const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'images';
    const filename = `${cleanFolder}/${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const endpoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = this.configService.get<number>('MINIO_PORT', 9000);
    const url = `http://${endpoint}:${port}/${this.bucketName}/${filename}`;

    return { key: filename, filename, url, size: file.size };
  }

  async listFiles() {
    await this.ensureBucketExists();
    const res = await this.s3Client.send(new ListObjectsV2Command({ Bucket: this.bucketName }));
    const endpoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = this.configService.get<number>('MINIO_PORT', 9000);

    if (!res.Contents) return [];

    return res.Contents.map((obj) => {
      const parts = obj.Key.split('/');
      const folder = parts.length > 1 ? parts[0] : 'root';
      const filename = parts.pop();
      return {
        key: obj.Key,
        folder,
        filename,
        size: obj.Size,
        lastModified: obj.LastModified,
        url: `http://${endpoint}:${port}/${this.bucketName}/${obj.Key}`,
      };
    });
  }

  async deleteFile(key: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
  }
}
