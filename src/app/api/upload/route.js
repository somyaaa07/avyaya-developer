import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// File ke starting bytes se asli type pata karte hain
function detectImageType(buf) {
  if (buf.length < 12) return null;

  // JPEG
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';

  // PNG
  if (
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
  ) {
    return 'png';
  }

  // GIF
  if (buf.slice(0, 3).toString('ascii') === 'GIF') return 'gif';

  // WEBP (RIFF....WEBP)
  if (
    buf.slice(0, 4).toString('ascii') === 'RIFF' &&
    buf.slice(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'webp';
  }

  return null;
}

export async function POST(req) {
  // Sirf admin upload kar sakta hai
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Max 5MB' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const ext = detectImageType(buffer);
    if (!ext) {
      return NextResponse.json(
        { error: 'Sirf JPG, PNG, WEBP ya GIF image allowed hai' },
        { status: 400 }
      );
    }

    // Original name se sirf safe characters rakhte hain
    const baseName =
      path
        .parse(file.name || 'image')
        .name.replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 60) || 'image';

    const filename = `${Date.now()}-${baseName}.${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error('❌ Upload error:', err);
    return NextResponse.json(
      { error: 'Upload nahi ho paya' },
      { status: 500 }
    );
  }
}