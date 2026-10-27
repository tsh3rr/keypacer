/**
 * Width and height of a PNG, JPEG or WebP picture, read from its first bytes,
 * so every <img> in the blog carries its size and the page does not jump while
 * pictures load. Undefined for anything else.
 */
export function imageSize(b: Uint8Array): { width: number; height: number } | undefined {
  const u16 = (i: number) => (b[i] << 8) | b[i + 1];
  const u16le = (i: number) => b[i] | (b[i + 1] << 8);
  const u24le = (i: number) => b[i] | (b[i + 1] << 8) | (b[i + 2] << 16);
  const u32 = (i: number) => ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;
  const ascii = (i: number, n: number) => String.fromCharCode(...b.subarray(i, i + n));

  // PNG: signature, then the IHDR chunk with width and height.
  if (b.length >= 24 && u32(0) === 0x89504e47 && ascii(12, 4) === 'IHDR') return { width: u32(16), height: u32(20) };

  // JPEG: walk the segments to the frame header (SOF0–SOF15, not DHT, JPG or DAC).
  if (b.length >= 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) return undefined;
      const marker = b[i + 1];
      if (marker === 0xff) { i++; continue; }
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { width: u16(i + 7), height: u16(i + 5) };
      }
      i += 2 + u16(i + 2);
    }
    return undefined;
  }

  // WebP: lossy (VP8), lossless (VP8L) or extended (VP8X).
  if (b.length >= 30 && ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') {
    const kind = ascii(12, 4);
    if (kind === 'VP8 ') return { width: u16le(26) & 0x3fff, height: u16le(28) & 0x3fff };
    if (kind === 'VP8L') {
      const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (kind === 'VP8X') return { width: u24le(24) + 1, height: u24le(27) + 1 };
  }
  return undefined;
}
