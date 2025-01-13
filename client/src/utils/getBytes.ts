export function getBytes(str: string) {
  let character;
  let charBytes = 0;

  for (let i = 0; i < str.length; i += 1) {
    character = str.charAt(i);

    if (escape(character).length > 4) charBytes += 2;
    else charBytes += 1;
  }

  return charBytes;
}
