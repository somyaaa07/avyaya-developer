import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbInit, { Property, PropertyImage } from '@/lib/dbInit';

// separate: true runs one extra query for images. No `limit` here:
// a limit would apply to the whole images query, not per property.
const imageInclude = {
  model: PropertyImage,
  as: 'images',
  separate: true,
  order: [['order', 'ASC']],
};

const SORTS = {
  newest: [['created_at', 'DESC']],
  oldest: [['created_at', 'ASC']],
  price_asc: [['price', 'ASC']],
  price_desc: [['price', 'DESC']],
};

// GET
//  /api/properties              -> PUBLIC: active properties, with filters
//  /api/properties?scope=mine   -> login required: user ko apni, admin ko saari
export async function GET(req) {
  await dbInit();
  const { searchParams } = new URL(req.url);
  const isMine = searchParams.get('scope') === 'mine';

  let where;
  let order = SORTS.newest;

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

    const type = searchParams.get('type');
    if (type) where.type = type.toLowerCase();

    const city = searchParams.get('city');
    if (city) where.city = city;

    const propertyType = searchParams.get('property_type');
    if (propertyType) where.property_type = propertyType.toLowerCase();

    // Price range
    const minRaw = searchParams.get('minPrice');
    const maxRaw = searchParams.get('maxPrice');
    const priceCond = {};
    if (minRaw && Number.isFinite(Number(minRaw))) priceCond[Op.gte] = Number(minRaw);
    if (maxRaw && Number.isFinite(Number(maxRaw))) priceCond[Op.lte] = Number(maxRaw);
    if (Reflect.ownKeys(priceCond).length) where.price = priceCond;

    // Minimum bedrooms
    const minBeds = parseInt(searchParams.get('minBeds') || '', 10);
    if (Number.isFinite(minBeds) && minBeds > 0) {
      where.bedrooms = { [Op.gte]: minBeds };
    }

    // Free-text search over title, location, city (use Op.iLike on PostgreSQL)
    const search = (searchParams.get('search') || '').trim();
    if (search) {
      const like = { [Op.like]: `%${search}%` };
      where[Op.or] = [{ title: like }, { location: like }, { city: like }];
    }

    order = SORTS[searchParams.get('sort')] || SORTS.newest;
  }

  const properties = await Property.findAll({
    where,
    order,
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

  try {
    const body = await req.json();
    const {
      images, title, description, price, type, property_type,
      location, city, area, bedrooms, bathrooms,
      nearby_landmarks, amenities, property_highlights,
      age_of_property, furnishing, transaction_type,
      balcony, total_floors, parking, facing, construction_type,
    } = body;

    if (!title || !price || !city || !type || !property_type || !location) {
      return NextResponse.json(
        { error: 'All fields are required' },
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
      area: area || null,
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
  } catch (err) {
    console.error('Property create error:', err);
    return NextResponse.json(
      { error: err.name === 'SequelizeValidationError' ? 'Invalid data' : 'Server error' },
      { status: err.name === 'SequelizeValidationError' ? 400 : 500 }
    );
  }
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