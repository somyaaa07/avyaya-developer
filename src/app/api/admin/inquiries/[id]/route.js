import { NextResponse } from 'next/server';
import dbInit, { Inquiry } from '@/lib/dbInit';

// PATCH — status update karo
export async function PATCH(req, { params }) {
  try {
    await dbInit();
    const { id }    = await params;
    const { status } = await req.json();

    await Inquiry.update({ status }, { where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Status update error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — inquiry delete karo
export async function DELETE(req, { params }) {
  try {
    await dbInit();
    const { id } = await params;

    await Inquiry.destroy({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Delete inquiry error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}