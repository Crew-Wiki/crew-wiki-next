'use client';

import {ENDPOINT} from '@constants/endpoint';
import {requestGetClient} from '@http/client';
import {UploadImageMeta} from '@type/Document.type';
import Resizer from 'react-image-file-resizer';

type PresignedUrlResponse = {
  url: string;
};

const uploadImageToS3 = async (uploadImageKey: string, image: File) => {
  const {url} = await requestGetClient<PresignedUrlResponse>({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    endpoint: `${ENDPOINT.getPresignedUrl}/${uploadImageKey}`,
  });

  await fetch(url, {
    method: 'PUT',
    body: image,
    headers: {
      'Content-Type': 'image/jpeg',
      'x-amz-meta-filetype': 'image/jpeg',
      'x-amz-meta-content-type': 'image/jpeg',
    },
  });
};

const resizeFile = (file: File) =>
  new Promise(res => {
    Resizer.imageFileResizer(file, 640, 640, 'JPEG', 70, 0, uri => res(uri), 'file');
  });

export type UploadImagesArgs = {
  documentUUID: string;
  uploadImageMetaList: UploadImageMeta[];
};

export async function uploadImages({documentUUID, uploadImageMetaList}: UploadImagesArgs) {
  const newMetaList = await Promise.all(
    uploadImageMetaList.map(async imageMeta => {
      const randomFileName = Math.random().toString(36).substr(2, 11);
      const resizedImage = (await resizeFile(imageMeta.file)) as File;
      const extension = resizedImage.type.split('/')[1];
      const uploadImageKey = `${documentUUID}/${randomFileName}.${extension}`;

      try {
        await uploadImageToS3(uploadImageKey, resizedImage);
      } catch (err) {
        console.error('S3 Upload Error:', err);
      }

      const newMeta = {...imageMeta, s3URL: `${process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT_DOMAIN}/${uploadImageKey}`};
      return newMeta;
    }),
  );

  return newMetaList;
}
