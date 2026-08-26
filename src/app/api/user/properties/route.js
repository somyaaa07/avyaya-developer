import { NextResponse }     from 'next/server';
import { getServerSession }  from 'next-auth';
import { authOptions }       from '@/app/api/auth/[...nextauth]/route';
import dbInit, { Property, PropertyImage } from '@/lib/dbInit';

// GET — user ki saari properties
export async function GET() {
  await dbInit();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 });
  }

  const properties = await Property.findAll({
    where: { user_id: session.user.id },
    order: [['created_at', 'DESC']],
    include: [{
      model: PropertyImage,
      as:    'images',
      limit: 1,
      order: [['order', 'ASC']],
    }],
  });

  return NextResponse.json(properties);
}

// POST — nayi property list karo
export async function POST(req) {
  await dbInit();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 });
  }

  const body = await req.json();
  const { images, ...propertyData } = body;

  if (!propertyData.title || !propertyData.price || !propertyData.city ||
      !propertyData.type  || !propertyData.property_type || !propertyData.location) {
    return NextResponse.json(
      { error: 'Saari required fields bharo' },
      { status: 400 }
    );
  }

  // Property banao
  const property = await Property.create({
    ...propertyData,
    user_id:       session.user.id,
    contact_email: session.user.email, // inquiry email yahan jayegi
    status:        'active',
  });

  // Images save karo
  if (images && images.length > 0) {
    await Promise.all(
      images.map((url, index) =>
        PropertyImage.create({
          property_id: property.id,
          url,
          order:       index,
        })
      )
    );
  }

  return NextResponse.json({ success: true, id: property.id });
}

// DELETE — apni property delete karo
export async function DELETE(req) {
  await dbInit();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id               = searchParams.get('id');

  const property = await Property.findOne({
    where: { id, user_id: session.user.id },
  });

  if (!property) {
    return NextResponse.json({ error: 'Property nahi mili' }, { status: 404 });
  }

  await PropertyImage.destroy({ where: { property_id: id } });
  await property.destroy();

  return NextResponse.json({ success: true });
}