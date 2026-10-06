import { NextResponse }     from 'next/server';
import { getServerSession }  from 'next-auth';
import { authOptions }       from '@/app/api/auth/[...nextauth]/route';
import dbInit, { Property, PropertyImage } from '@/lib/dbInit';

/* ── Allowed values (form ke options se match karte hain) ───── */
const LISTING_TYPES  = ['buy', 'sell', 'rent'];
const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'plot', 'commercial', 'residential'];
const FURNISHING     = ['unfurnished', 'semi-furnished', 'furnished'];
const PARKING        = ['none', 'bike', 'car', 'both'];
const TRANSACTION    = ['new', 'resale'];
const FACING         = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];

const MAX_IMAGES = 20;
const MAX_TAGS   = 30;

class ValidationError extends Error {}
const fail = (msg) => { throw new ValidationError(msg); };

/* ── Validation helpers ─────────────────────────────────────── */
const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

const oneOf = (v, allowed, label, { optional = false } = {}) => {
  const s = typeof v === 'string' ? v.trim() : '';
  if (!s && optional) return '';
  if (!allowed.includes(s)) fail(`Invalid ${label}.`);
  return s;
};

const count = (v, label, max) => {
  if (v === '' || v == null) return null;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 0 || n > max) fail(`Invalid ${label}.`);
  return n;
};

const tags = (v, label) => {
  if (v == null) return [];
  if (!Array.isArray(v)) fail(`Invalid ${label}.`);
  const clean = v
    .map((x) => (typeof x === 'string' ? x.trim().slice(0, 60) : ''))
    .filter(Boolean);
  return [...new Set(clean)].slice(0, MAX_TAGS);
};

const imageUrls = (v) => {
  if (v == null) return [];
  if (!Array.isArray(v)) fail('Invalid images.');
  if (v.length > MAX_IMAGES) fail(`You can upload up to ${MAX_IMAGES} images.`);
  v.forEach((u) => {
    if (typeof u !== 'string' || u.length > 2048 || !/^(https?:\/\/|\/)/i.test(u)) fail('Invalid image URL.');
  });
  return v;
};

/* Sirf whitelisted fields nikalo. user_id / status / agent_id jaise fields client se kabhi nahi lete. */
function clean(body) {
  if (!body || typeof body !== 'object') fail('Invalid request.');

  const title    = text(body.title, 120);
  const location = text(body.location, 255);
  const city     = text(body.city, 100);
  if (!title || !location || !city) fail('Please fill in all required fields.');

  const price = Number(body.price);
  if (!Number.isFinite(price) || price <= 0 || price > 1e11) fail('Enter a valid price.');

  let area = null;
  if (body.area !== '' && body.area != null) {
    area = Number(body.area);
    if (!Number.isFinite(area) || area < 0 || area > 1e7) fail('Invalid area.');
  }

  const data = {
    title,
    description:         text(body.description, 2000),
    price,
    type:                oneOf(body.type, LISTING_TYPES, 'listing type'),
    property_type:       oneOf(body.property_type, PROPERTY_TYPES, 'property type'),
    location,
    city,
    area,
    bedrooms:            count(body.bedrooms, 'bedrooms', 50),
    bathrooms:           count(body.bathrooms, 'bathrooms', 50),
    balcony:             count(body.balcony, 'balconies', 50),
    total_floors:        count(body.total_floors, 'total floors', 200),
    age_of_property:     text(body.age_of_property, 50),
    construction_type:   text(body.construction_type, 100),
    furnishing:          oneOf(body.furnishing, FURNISHING, 'furnishing', { optional: true }),
    parking:             oneOf(body.parking, PARKING, 'parking', { optional: true }),
    facing:              oneOf(body.facing, FACING, 'facing', { optional: true }),
    transaction_type:    oneOf(body.transaction_type, TRANSACTION, 'transaction type', { optional: true }),
    amenities:           tags(body.amenities, 'amenities'),
    nearby_landmarks:    tags(body.nearby_landmarks, 'nearby landmarks'),
    property_highlights: tags(body.property_highlights, 'property highlights'),
  };

  return { data, images: imageUrls(body.images) };
}

/* ── GET — user ki saari properties ─────────────────────────── */
export async function GET() {
  try {
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
  } catch (err) {
    console.error('GET /api/user/properties failed:', err);
    return NextResponse.json({ error: 'Could not load your properties.' }, { status: 500 });
  }
}

/* ── POST — nayi property list karo ─────────────────────────── */
export async function POST(req) {
  try {
    await dbInit();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    let data, images;
    try {
      ({ data, images } = clean(body));
    } catch (e) {
      if (e instanceof ValidationError) {
        return NextResponse.json({ error: e.message }, { status: 400 });
      }
      throw e;
    }

    // Property + images ek saath save hote hain; images fail hui to property bhi nahi banegi
    const id = await Property.sequelize.transaction(async (t) => {
      const property = await Property.create(
        {
          ...data,
          user_id:       session.user.id,
          contact_email: session.user.email, // inquiry email yahan jayegi
          status:        'active',
        },
        { transaction: t }
      );

      if (images.length > 0) {
        await PropertyImage.bulkCreate(
          images.map((url, order) => ({ property_id: property.id, url, order })),
          { transaction: t }
        );
      }
      return property.id;
    });

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error('POST /api/user/properties failed:', err);
    return NextResponse.json({ error: 'Could not save the property. Please try again.' }, { status: 500 });
  }
}

/* ── DELETE — apni property delete karo ─────────────────────── */
export async function DELETE(req) {
  try {
    await dbInit();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 });
    }

    const id = new URL(req.url).searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Property id is required.' }, { status: 400 });
    }

    const property = await Property.findOne({
      where: { id, user_id: session.user.id },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }

    await Property.sequelize.transaction(async (t) => {
      await PropertyImage.destroy({ where: { property_id: property.id }, transaction: t });
      await property.destroy({ transaction: t });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/user/properties failed:', err);
    return NextResponse.json({ error: 'Could not delete the property.' }, { status: 500 });
  }
}