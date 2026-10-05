import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, requireAdmin } from '@/lib/auth';
import dbInit, { Property, PropertyImage } from '@/lib/dbInit';

// GET — logged-in user's own properties (works for both user and admin)
export async function GET(req) {
  await dbInit();
  const { searchParams } = new URL(req.url);
  const isMine = searchParams.get('scope') === 'mine';

  let where;
  let limit;

  if (isMine) {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 });
    }

    const isAdmin = session.user.role?.toLowerCase() === 'admin';
    where = isAdmin ? {} : { user_id: session.user.id };
  } else {
    // Guest, registered ya logged-in: sabko active properties
    where = { status: 'active' };

    const type = searchParams.get('type');
    if (type) where.type = type.toLowerCase();

    const limitParam = parseInt(searchParams.get('limit') || '', 10);
    if (Number.isFinite(limitParam) && limitParam > 0) {
      limit = Math.min(limitParam, 50);
    }
  }

  const properties = await Property.findAll({
    where,
    order: [['created_at', 'DESC']],
    include: [imageInclude],
    ...(limit ? { limit } : {}),
  });

  if (!isMine) {
    const safe = properties.map((p) => {
      const { contact_email, user_id, ...rest } = p.toJSON();
      return rest;
    });
    return NextResponse.json(safe);
  }

  return NextResponse.json(properties);
}

// POST — any logged-in user OR admin can list a new property
export async function POST(req) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  await dbInit();

  const body = await req.json();
  const {
    images,
    title,
    description,
    price,
    type,
    property_type,
    location,
    city,
    area,
    bedrooms,
    bathrooms,
  } = body;

  if (!title || !price || !city || !type || !property_type || !location) {
    return NextResponse.json(
      { error: 'Saari required fields bharo' },
      { status: 400 }
    );
  }

  const property = await Property.create({
    title,
    description,
    price,
    type: String(type).toLowerCase(),
    property_type,
    location,
    city,
    area: area || null,
    bedrooms: bedrooms || null,
    bathrooms: bathrooms || null,
    // Always taken from the session, never from the request body
    user_id: session.user.id,
    contact_email: session.user.email,
    status: 'active',
  });

  if (images && images.length > 0) {
    await Promise.all(
      images.map((url, index) =>
        PropertyImage.create({
          property_id: property.id,
          url,
          order: index,
        })
      )
    );
  }

  return NextResponse.json({ success: true, id: property.id });
}

// DELETE — logged-in user can delete their own property
export async function DELETE(req) {
  await dbInit();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const isAdmin = session.user.role?.toLowerCase() === 'admin';

  // Admin can delete any property; a user only their own
  const property = await Property.findOne({
    where: isAdmin ? { id } : { id, user_id: session.user.id },
  });

  if (!property) {
    return NextResponse.json({ error: 'Property nahi mili' }, { status: 404 });
  }

  await PropertyImage.destroy({ where: { property_id: id } });
  await property.destroy();

  return NextResponse.json({ success: true });
}