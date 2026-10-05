import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbInit, { Property, PropertyImage } from '@/lib/dbInit';

const imageInclude = {
  model: PropertyImage,
  as: 'images',
  separate: true,
  limit: 1,
  order: [['order', 'ASC']],
};

// GET
//  /api/properties              -> PUBLIC: saari active properties (login zaruri nahi)
//  /api/properties?scope=mine   -> login required: user ko apni, admin ko saari
export async function GET(req) {
  await dbInit();
  const { searchParams } = new URL(req.url);
  const isMine = searchParams.get('scope') === 'mine';

  let where;

  if (isMine) {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 });
    }

    const isAdmin = session.user.role?.toLowerCase() === 'admin';
    where = isAdmin ? {} : { user_id: session.user.id };
  } else {
    // Guest, registered ya logged-in: sabko active properties dikhengi
    where = { status: 'active' };
  }

  const properties = await Property.findAll({
    where,
    order: [['created_at', 'DESC']],
    include: [imageInclude],
  });

  // Public listing me private fields mat bhejo
  if (!isMine) {
    const safe = properties.map((p) => {
      const { contact_email, user_id, ...rest } = p.toJSON();
      return rest;
    });
    return NextResponse.json(safe);
  }

  return NextResponse.json(properties);
}

// POST — koi bhi logged-in user ya admin property list kar sakta hai
export async function POST(req) {
  await dbInit();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 });
  }

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
    // Hamesha session se, request body se kabhi nahi
    user_id: session.user.id,
    contact_email: session.user.email,
    status: 'active',
  });

  if (Array.isArray(images) && images.length > 0) {
    await PropertyImage.bulkCreate(
      images.map((url, index) => ({
        property_id: property.id,
        url,
        order: index,
      }))
    );
  }

  return NextResponse.json({ success: true, id: property.id });
}

// DELETE — user apni property delete kare, admin koi bhi
export async function DELETE(req) {
  await dbInit();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }

  const isAdmin = session.user.role?.toLowerCase() === 'admin';

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