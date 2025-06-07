export function processImageHtml(html: string): string {
  const s3Domain = process.env.NEXT_PUBLIC_IMAGE_S3_DOMAIN!;
  const cloudfrontDomain = process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT_DOMAIN!;

  return html.replace(/<img\s+([^>]*?)src="([^"]+)"([^>]*?)>/g, (match, before, src, after) => {
    try {
      let replacedSrc = src.replace(s3Domain, cloudfrontDomain);

      const url = new URL(replacedSrc);
      const pathParts = url.pathname.split('/');
      const filename = pathParts[pathParts.length - 1];
      const dotIndex = filename.lastIndexOf('.');

      if (dotIndex === -1) {
        pathParts[pathParts.length - 1] = `${filename}.jpeg`;
      } else {
        const baseName = filename.substring(0, dotIndex);
        const ext = filename.substring(dotIndex + 1).toLowerCase();

        if (ext !== 'jpeg') {
          pathParts[pathParts.length - 1] = `${baseName}.jpeg`;
        }
      }

      url.pathname = pathParts.join('/');
      replacedSrc = url.toString();

      return `<img ${before}src="${replacedSrc}"${after}>`;
    } catch {
      return match;
    }
  });
}
