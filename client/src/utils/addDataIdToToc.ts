export const addDataIdToToc = (html: string) => {
  let idCounter = 0;

  const updatedHtml = html.replace(/<(h[1-3])([^>]*)>/g, (_, tag, attributes) => {
    return `<${tag} data-id="${idCounter++}"${attributes}>`;
  });

  return updatedHtml;
};
