export const addDataIdToToc = (html: string) => {
  let idCounter = 0;

  return html.replace(/<(h[1-3])([^>]*)>/g, (_, tag, attributes) => {
    const space = attributes.trim() ? ' ' : '';
    return `<${tag} data-id="${idCounter++}"${space}${attributes}>`;
  });
};
