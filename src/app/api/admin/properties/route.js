import { NextResponse } from 'next/server';
import { Op } from 'sequelize'; // ✅ moved to top
import dbInit, { Property, PropertyImage } from '@/lib/dbInit';

export async function GET(req) {
  await dbInit();

  const { searchParams } = new URL(req.url);
  const type     = searchParams.get('type');
  const city     = searchParams.get('city');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const where = {};

  // ✅ case-insensitive type match (buy = Buy = BUY)
if (type) where.type = { [Op.like]: type };   // ✅ MySQL compatible
  if (city) where.city = { [Op.like]: city }; 

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = Number(minPrice); // ✅ convert to number
    if (maxPrice) where.price[Op.lte] = Number(maxPrice); // ✅ convert to number
  }

  const properties = await Property.findAll({
    where,
    include: [{ model: PropertyImage, as: 'images', order: [['order', 'ASC']] }],
    order: [['created_at', 'DESC']],
  });

  return NextResponse.json(properties);
}

export async function POST(req) {
  await dbInit();

  try {
    const body = await req.json();

    const {
      title, description, price, type, property_type,
      location, city, area, bedrooms, bathrooms,
      agent_id, status,
      images = [],
    } = body;

    if (!title || !price || !city || !type || !property_type || !location) {
      return NextResponse.json(
        { error: 'Title, price, city, type, property_type aur location required hai.' },
        { status: 400 }
      );
    }

    const property = await Property.create({
      title,
      description,
      price,
      type:          type.toLowerCase(),  // ✅ always store as lowercase
      property_type,
      location,
      city,
      area:      area      || null,
      bedrooms:  bedrooms  || null,
      bathrooms: bathrooms || null,
      agent_id:  agent_id  || null,
      status:    status    || 'active',
    });

    if (images.length > 0) {
      const imageRows = images.map((url, index) => ({
        property_id: property.id,
        url,
        order: index,
      }));
      await PropertyImage.bulkCreate(imageRows);
    }

    const result = await Property.findByPk(property.id, {
      include: [{ model: PropertyImage, as: 'images' }],
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('❌ Property create error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}