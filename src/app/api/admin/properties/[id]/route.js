import { NextResponse } from 'next/server';
import dbInit, { Property, PropertyImage } from '@/lib/dbInit'; // ✅ named imports

export async function GET(req, { params }) {
  const { id } = await params;
  await dbInit();

  const property = await Property.findByPk(id, {
    include: [{ model: PropertyImage, as: 'images', order: [['order', 'ASC']] }], // ✅ join images
  });

  if (!property) return NextResponse.json({ error: 'Didnt find property' }, { status: 404 });
  return NextResponse.json(property);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  await dbInit();
  const body = await req.json();
  await Property.update(body, { where: { id } });

  // ✅ Return updated property with images
  const property = await Property.findByPk(id, {
    include: [{ model: PropertyImage, as: 'images', order: [['order', 'ASC']] }],
  });

  return NextResponse.json(property);
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await dbInit();

    const property = await Property.findByPk(id);
    if (!property) {
      return NextResponse.json({ error: 'Didnt find property' }, { status: 404 });
    }

    await property.destroy();
    return NextResponse.json({ message: 'Property deleted' });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}