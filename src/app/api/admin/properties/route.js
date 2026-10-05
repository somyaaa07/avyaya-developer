import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbInit, { Property, PropertyImage } from '@/lib/dbInit';

// Images ke liye extra query (limit mat lagana, wo poori images query pe lagta hai)
const imageInclude = {
  model: PropertyImage,
  as: 'images',
  separate: true,
  order: [['order', 'ASC']],
};

const STATUSES = ['active', 'sold', 'rented'];

// Admin check: role 'admin' / 'Admin' dono chalega
async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session) return { error: 'Login required', status: 401 };
  if (session.user.role?.toLowerCase() !== 'admin') {
    return { error: 'Admin access required', status: 403 };
  }
  return { session };
}

// GET /api/admin/properties : ADMIN ko saari properties (har status), images ke saath
export async function GET() {
  try {
    await dbInit();

    const auth = await getAdminSession();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const properties = await Property.findAll({
      order: [['created_at', 'DESC']],
      include: [imageInclude],
    });

    return NextResponse.json(properties);
  } catch (err) {
    console.error('Admin properties GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/admin/properties : ADMIN nayi property add kare
export async function POST(req) {
  try {
    await dbInit();

    const auth = await getAdminSession();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const { session } = auth;

    const body = await req.json();
    const {
      images, title, description, price, type, property_type,
      location, city, area, bedrooms, bathrooms,
      nearby_landmarks, amenities, property_highlights,
      age_of_property, furnishing, transaction_type,
      balcony, total_floors, parking, facing, construction_type,
      agent_id, status,
    } = body;

    if (!title || !price || !city || !type || !property_type || !location) {
      return NextResponse.json(
        { error: 'Title, price, type, property type, location and city are required' },
        { status: 400 }
      );
    }

    const property = await Property.create({
      title,
      description,
      price,
      type: String(type).toLowerCase(),
      property_type: String(property_type).toLowerCase(),
      location,
      city,
      area: area ?? null,
      bedrooms: bedrooms ?? null,
      bathrooms: bathrooms ?? null,

      nearby_landmarks,
      amenities,
      property_highlights,
      age_of_property: age_of_property || null,
      furnishing: furnishing || null,
      transaction_type: transaction_type || null,
      balcony: balcony ?? null,
      total_floors: total_floors ?? null,
      parking: parking || null,
      facing: facing || null,
      construction_type: construction_type || null,

      agent_id: agent_id || null,
      user_id: session.user.id,
      contact_email: session.user.email,
      status: STATUSES.includes(status) ? status : 'active',
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
  } catch (err) {
    console.error('Admin property create error:', err);
    const isValidation = err.name === 'SequelizeValidationError';
    return NextResponse.json(
      { error: isValidation ? 'Invalid data' : 'Server error' },
      { status: isValidation ? 400 : 500 }
    );
  }
}