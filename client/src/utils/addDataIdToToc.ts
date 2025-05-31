import { generateTOCNumber, HeadingCount, HeadingLevel } from "./tocUtils";

const extractHeadingLevels = (html: string): HeadingCount[] => {
  const headingMatches = html.matchAll(/<(h[1-3])([^>]*)>/g);
  return Array.from(headingMatches).map(match => ({
    level: parseInt(match[1][1]) as HeadingLevel,
    count: 1
  }));
};

export const addDataIdToToc = (html: string) => {
  const headingLevels = extractHeadingLevels(html);
  const tocNumbers = generateTOCNumber(headingLevels);
  let currentIndex = 0;

  return html.replace(/<(h[1-3])([^>]*)>([^<]*)<\/h[1-3]>/g, (_, tag, attributes, content) => {
    const space = attributes.trim() ? ' ' : '';
    const tocNumber = tocNumbers[currentIndex++];
    return `<${tag} data-id="${tocNumber}"${space}${attributes}><a href="#${tocNumber}">${content}</a></${tag}>`;
  });
};
