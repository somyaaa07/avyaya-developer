import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbInit, { SavedProperty } from '@/lib/dbInit';

// GET /api/saved?property_id=5  — check if saved
export async function GET(req) {
  await dbInit();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ saved: false });

  const { searchParams } = new URL(req.url);
  const property_id = searchParams.get('property_id');

  const exists = await SavedProperty.findOne({
    where: { user_id: session.user.id, property_id },
  });

  return NextResponse.json({ saved: !!exists });
}

// POST /api/saved  — toggle save/unsave
export async function POST(req) {
  await dbInit();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 });
  }

  try {
    const { property_id } = await req.json();

    const existing = await SavedProperty.findOne({
      where: { user_id: session.user.id, property_id },
    });

    if (existing) {
      await existing.destroy();
      return NextResponse.json({ saved: false, message: 'Removed from saved' });
    } else {
      await SavedProperty.create({ user_id: session.user.id, property_id });
      return NextResponse.json({ saved: true, message: 'Saved!' });
    }

  } catch (error) {
    console.error('❌ Save toggle error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}