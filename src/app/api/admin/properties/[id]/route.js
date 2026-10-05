import { NextResponse } from 'next/server';
import dbInit, { Property, PropertyImage } from '@/lib/dbInit';
import { requireAdmin } from '@/lib/auth';

// Admin can manage any property; a user can manage only their own.
function canManage(user, property) {
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const isOwner = String(property.user_id) === String(user?.id);
  return isAdmin || isOwner;
}

// GET — public
export async function GET(req, { params }) {
  const { id } = await params;
  await dbInit();

  const property = await Property.findByPk(id, {
    include: [{ model: PropertyImage, as: 'images' }],
    order: [[{ model: PropertyImage, as: 'images' }, 'order', 'ASC']],
  });

  if (!property) {
    return NextResponse.json({ error: 'Didnt find property' }, { status: 404 });
  }

  return NextResponse.json(property);
}

// PUT — ADMIN or the property's OWNER
export async function PUT(req, { params }) {
  const { error, user } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await dbInit();

  const existing = await Property.findByPk(id);
  if (!existing) {
    return NextResponse.json({ error: 'Didnt find property' }, { status: 404 });
  }

  if (!canManage(user, existing)) {
    return NextResponse.json(
      { error: 'You can only edit your own properties.' },
      { status: 403 }
    );
  }

  const body = await req.json();

  // These fields must never be updated from the request body
  const { id: _id, user_id, created_at, images, ...updates } = body;

  if (updates.type) updates.type = String(updates.type).toLowerCase();

  await Property.update(updates, { where: { id } });

  const property = await Property.findByPk(id, {
    include: [{ model: PropertyImage, as: 'images' }],
    order: [[{ model: PropertyImage, as: 'images' }, 'order', 'ASC']],
  });

  return NextResponse.json(property);
}

// DELETE — ADMIN or the property's OWNER
export async function DELETE(req, { params }) {
  const { error, user } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    await dbInit();

    const property = await Property.findByPk(id);
    if (!property) {
      return NextResponse.json(
        { error: 'Didnt find property' },
        { status: 404 }
      );
    }

    if (!canManage(user, property)) {
      return NextResponse.json(
        { error: 'You can only delete your own properties.' },
        { status: 403 }
      );
    }

    await property.destroy();
    return NextResponse.json({ message: 'Property deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json(
      { error: 'Error in deleting property' },
      { status: 500 }
    );
  }
}