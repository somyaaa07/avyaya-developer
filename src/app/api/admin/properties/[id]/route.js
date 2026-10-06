import { NextResponse } from 'next/server';
import dbInit, { Property, PropertyImage } from '@/lib/dbInit';
import { requireAdmin } from '@/lib/auth';

const imagesInclude = [{ model: PropertyImage, as: 'images' }];
const imagesOrder = [[{ model: PropertyImage, as: 'images' }, 'order', 'ASC']];

// Empty string ko null banana hai (INT / ENUM columns me '' error deta hai)
const NULLABLE_FIELDS = [
  'area',
  'bedrooms',
  'bathrooms',
  'balcony',
  'total_floors',
  'age_of_property',
  'furnishing',
  'transaction_type',
  'parking',
  'facing',
  'construction_type',
  'agent_id',
];

// GET — public
export async function GET(req, { params }) {
  const { id } = await params;
  await dbInit();

  const property = await Property.findByPk(id, {
    include: imagesInclude,
    order: imagesOrder,
  });

  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  return NextResponse.json(property);
}

// PUT — ADMIN only (requireAdmin already check karta hai)
export async function PUT(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    await dbInit();

    const existing = await Property.findByPk(id);
    if (!existing) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const body = await req.json();

    // Ye fields request body se kabhi update nahi hone chahiye
    const { id: _id, user_id, created_at, updated_at, images, ...updates } = body;

    // Empty string -> null
    for (const key of NULLABLE_FIELDS) {
      if (updates[key] === '') updates[key] = null;
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

// DELETE — ADMIN only
export async function DELETE(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    await dbInit();

    const property = await Property.findByPk(id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
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