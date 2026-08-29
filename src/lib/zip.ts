/* ─────────────────────────────────────────────────────────────
   ساخت فایل ZIP بدون هیچ کتابخانه خارجی (روش STORE)
   ساختار استاندارد ZIP: Local File Headers + Central Directory + EOCD
   ───────────────────────────────────────────────────────────── */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const enc = new TextEncoder();

function dosDateTime(d: Date): { time: number; date: number } {
  return {
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
    date: (((d.getFullYear() - 1980) & 0x7f) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  };
}

const putU16 = (a: number[], v: number) => { a.push(v & 0xff, (v >> 8) & 0xff); };
const putU32 = (a: number[], v: number) => { a.push(v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff); };

/** دریافت لیست فایل‌ها [مسیر, محتوا] و ساخت Blob از نوع ZIP */
export function buildZip(files: [string, string][], folder = ""): Blob {
  const now = dosDateTime(new Date());
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const [name, content] of files) {
    const fullName = folder ? `${folder}/${name}` : name;
    const nameBytes = enc.encode(fullName);
    const data = enc.encode(content);
    const crc = crc32(data);

    /* local file header */
    const lh = new Uint8Array(30 + nameBytes.length);
    const l: number[] = [];
    putU32(l, 0x04034b50);
    putU16(l, 20);
    putU16(l, 0x0800); /* نام‌های UTF-8 */
    putU16(l, 0);      /* method: store */
    putU16(l, now.time);
    putU16(l, now.date);
    putU32(l, crc);
    putU32(l, data.length);
    putU32(l, data.length);
    putU16(l, nameBytes.length);
    putU16(l, 0);
    lh.set(l, 0);
    lh.set(nameBytes, 30);
    parts.push(lh, data);

    /* central directory header */
    const ch = new Uint8Array(46 + nameBytes.length);
    const c: number[] = [];
    putU32(c, 0x02014b50);
    putU16(c, 20);
    putU16(c, 20);
    putU16(c, 0x0800);
    putU16(c, 0);
    putU16(c, now.time);
    putU16(c, now.date);
    putU32(c, crc);
    putU32(c, data.length);
    putU32(c, data.length);
    putU16(c, nameBytes.length);
    putU16(c, 0);
    putU16(c, 0);
    putU16(c, 0);
    putU16(c, 0);
    putU32(c, 0);
    putU32(c, offset);
    ch.set(c, 0);
    ch.set(nameBytes, 46);
    central.push(ch);

    offset += lh.length + data.length;
  }

  /* end of central directory */
  const cdSize = central.reduce((s, a) => s + a.length, 0);
  const eo = new Uint8Array(22);
  const e: number[] = [];
  putU32(e, 0x06054b50);
  putU16(e, 0);
  putU16(e, 0);
  putU16(e, files.length);
  putU16(e, files.length);
  putU32(e, cdSize);
  putU32(e, offset);
  putU16(e, 0);
  eo.set(e, 0);

  const all: BlobPart[] = [...parts, ...central, eo].map((u) => u.buffer.slice(u.byteOffset, u.byteOffset + u.byteLength) as ArrayBuffer);
  return new Blob(all, { type: "application/zip" });
}
