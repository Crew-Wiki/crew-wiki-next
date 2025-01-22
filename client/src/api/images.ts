'use client';

import {UploadImageMeta} from '@type/Document.type';
import Resizer from 'react-image-file-resizer';
import AWS from 'aws-sdk';

const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
const region = process.env.NEXT_PUBLIC_BUCKET_REGION;
const accessKeyId = process.env.NEXT_PUBLIC_ACCESS_KEY;
const secretAccessKey = process.env.NEXT_PUBLIC_SECRET_KEY;

AWS.config.update({
  region,
  accessKeyId,
  secretAccessKey,
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: bucketName},
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
      const uploadImageKey = `${albumName}/${randomFileName}`;

      const upload = s3.upload({
        ACL: 'public-read',
        Bucket: bucketName,
        Key: uploadImageKey,
        Body: resizedImage,
      });

      const newMeta = imageMeta;
      const promise = await upload.promise();
      newMeta.s3URL = promise.Location;

      return newMeta;
    }),
  );

  return newMetaList;
}
