import { NextResponse } from "next/server";
import { writeFile, mkdir } from 'fs/promises';
import path from "path";

export const runtime = 'nodejs'; // ✅ VERY IMPORTANT

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    console.log('File received:', file);

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;

    console.log('✅ File saved:', filepath);
    console.log('✅ Returning URL:', url);

    return NextResponse.json({ url });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}