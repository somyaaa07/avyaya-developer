import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbInit, { Property, PropertyImage } from '@/lib/dbInit';

const imagesInclude = [{ model: PropertyImage, as: 'images' }];
const imagesOrder = [[{ model: PropertyImage, as: 'images' }, 'order', 'ASC']];

// Fields jo owner/admin update kar sakta hai
const EDITABLE_FIELDS = [
  'title',
  'description',
  'price',
  'type',
  'property_type',
  'location',
  'city',
  'area',
  'bedrooms',
  'bathrooms',
  // naye fields
  'nearby_landmarks',
  'amenities',
  'property_highlights',
  'age_of_property',
  'furnishing',
  'transaction_type',
  'balcony',
  'total_floors',
  'parking',
  'facing',
  'construction_type',
];

// Empty string ko null banana hai (INT columns me '' error deta hai)
const NULLABLE_FIELDS = [
  'area', 'bedrooms', 'bathrooms', 'balcony', 'total_floors',
  'age_of_property', 'furnishing', 'transaction_type',
  'parking', 'facing', 'construction_type',
];
function isAdminUser(user) {
  return user?.role?.toLowerCase() === 'admin';
}

// Admin kisi bhi property ko manage kare; user sirf apni
function canManage(user, property) {
  if (!user) return false;
  return isAdminUser(user) || String(property.user_id) === String(user.id);
}

// GET — PUBLIC (login zaruri nahi)
export async function GET(req, { params }) {
  const { id } = await params;
  await dbInit();

  const property = await Property.findByPk(id, {
    include: imagesInclude,
    order: imagesOrder,
  });

  if (!property) {
    return NextResponse.json({ error: 'Property nahi mili' }, { status: 404 });
  }

  // Inactive property sirf owner / admin ko dikhe, baaki ko 404
  if (property.status !== 'active') {
    const session = await getServerSession(authOptions);
    if (!canManage(session?.user, property)) {
      return NextResponse.json({ error: 'Property nahi mili' }, { status: 404 });
    }
    return NextResponse.json(property);
  }

  // Public ko user_id mat bhejo.
  // Agar contact_email bhi chhupana hai to yahan destructure me add kar do.
  const { user_id, ...safe } = property.toJSON();
  return NextResponse.json(safe);
}

// PUT — ADMIN ya property ka OWNER
export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await dbInit();

    const existing = await Property.findByPk(id);
    if (!existing) {
      return NextResponse.json({ error: 'Property nahi mili' }, { status: 404 });
    }

    if (!canManage(session.user, existing)) {
      return NextResponse.json(
        { error: 'You can only edit your own properties.' },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Sirf allowed fields lo
    const updates = {};
    for (const key of EDITABLE_FIELDS) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    // Empty string -> null
    for (const key of NULLABLE_FIELDS) {
      if (updates[key] === '') updates[key] = null;
    }

    // Status sirf admin badal sakta hai
    if (body.status !== undefined && isAdminUser(session.user)) {
      updates.status = body.status;
    }

    if (updates.type) updates.type = String(updates.type).toLowerCase();
    if (updates.property_type) {
      updates.property_type = String(updates.property_type).toLowerCase();
    }

    await existing.update(updates);

    const property = await Property.findByPk(id, {
      include: imagesInclude,
      order: imagesOrder,
    });

    return NextResponse.json(property);
  } catch (err) {
    console.error('Update error:', err);
    const isValidation = err.name === 'SequelizeValidationError';
    return NextResponse.json(
      { error: isValidation ? 'Invalid data' : 'Error in updating property' },
      { status: isValidation ? 400 : 500 }
    );
  }
}

// DELETE — ADMIN ya property ka OWNER
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await dbInit();

    const property = await Property.findByPk(id);
    if (!property) {
      return NextResponse.json({ error: 'Property nahi mili' }, { status: 404 });
    }

    if (!canManage(session.user, property)) {
      return NextResponse.json(
        { error: 'You can only delete your own properties.' },
        { status: 403 }
      );
    }

    await PropertyImage.destroy({ where: { property_id: id } });
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