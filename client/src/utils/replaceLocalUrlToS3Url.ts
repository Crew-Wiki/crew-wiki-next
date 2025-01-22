import {UploadImageMeta} from '@type/Document.type';

export const replaceLocalUrlToS3Url = (contents: string, imageMetaList: UploadImageMeta[]) => {
  let newContents = contents;
  imageMetaList.forEach(({objectURL, s3URL}) => {
    newContents = newContents.replace(objectURL, s3URL);
  });

  return newContents;
};
