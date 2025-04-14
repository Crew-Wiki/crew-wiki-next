'use client';

import {UploadImageMeta} from '@type/Document.type';
import Resizer from 'react-image-file-resizer';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';

const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
const region = process.env.NEXT_PUBLIC_BUCKET_REGION;
const accessKeyId = process.env.NEXT_PUBLIC_ACCESS_KEY;
const secretAccessKey = process.env.NEXT_PUBLIC_SECRET_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const resizeFile = (file: File) =>
  new Promise(res => {
    Resizer.imageFileResizer(file, 640, 640, 'JPEG', 70, 0, uri => res(uri), 'file');
  });

export type UploadImagesArgs = {
  albumName: string;
  uploadImageMetaList: UploadImageMeta[];
};

export async function uploadImages({albumName, uploadImageMetaList}: UploadImagesArgs) {
  const newMetaList = await Promise.all(
    uploadImageMetaList.map(async imageMeta => {
      const randomFileName = Math.random().toString(36).substr(2, 11);
      const resizedImage = (await resizeFile(imageMeta.file)) as File;
      const extension = resizedImage.type.split('/')[1];
      const uploadImageKey = `${albumName}/${randomFileName}.${extension}`;

      try {
        await s3Client.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: uploadImageKey,
            Body: resizedImage,
            ContentType: resizedImage.type,
            CacheControl: 'public, max-age=31536000',
          }),
        );
      } catch (err) {
        console.error('S3 Upload Error:', err);
      }

      const newMeta = {...imageMeta, s3URL: `${process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT_DOMAIN}/${uploadImageKey}`};
      return newMeta;
    }),
  );

  return newMetaList;
}
