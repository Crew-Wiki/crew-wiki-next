export function processImageHtml(html: string): string {
  const s3Domain = process.env.NEXT_PUBLIC_IMAGE_S3_DOMAIN;
  const cloudfrontDomain = process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT_DOMAIN;

  return html.replace(/<img\s+([^>]*?)src="([^"]+)"([^>]*?)>/g, (match, before, src, after) => {
    try {
      const replacedSrc = src.replace(s3Domain, cloudfrontDomain);

      return `<img ${before}src="${replacedSrc}"${after}>`;
    } catch {
      return match;
    }
  });
}
