import { NextResponse } from 'next/server';
import { Op }           from 'sequelize';
import dbInit, { Property, PropertyImage, Agent } from '@/lib/dbInit';

export async function GET(req) {
  await dbInit();

  const { searchParams } = new URL(req.url);

  const type          = searchParams.get('type');
  const city          = searchParams.get('city');
  const property_type = searchParams.get('property_type');
  const minPrice      = searchParams.get('minPrice');
  const maxPrice      = searchParams.get('maxPrice');
  const minBeds       = searchParams.get('minBeds');
  const sort          = searchParams.get('sort') || 'newest';
  const search        = searchParams.get('search');

    console.log('Filter type:', type); 
  // ── Where clause ──
  const where = { status: 'active' };

  if (type)          where.type          = type;
  if (city)          where.city          = city;
  if (property_type) where.property_type = property_type;
  if (minBeds)       where.bedrooms      = { [Op.gte]: Number(minBeds) };

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = Number(minPrice);
    if (maxPrice) where.price[Op.lte] = Number(maxPrice);
  }

  if (search) {
    where[Op.or] = [
      { title:    { [Op.like]: `%${search}%` } },
      { city:     { [Op.like]: `%${search}%` } },
      { location: { [Op.like]: `%${search}%` } },
    ];
  }

  // ── Sort ──
  const orderMap = {
    newest:      [['created_at', 'DESC']],
    oldest:      [['created_at', 'ASC']],
    price_asc:   [['price', 'ASC']],
    price_desc:  [['price', 'DESC']],
  };
  const order = orderMap[sort] || orderMap.newest;

  const properties = await Property.findAll({
    where,
    order,
    include: [
      { model: PropertyImage, as: 'images', order: [['order', 'ASC']] },
    ],
  });

    console.log('Found:', properties.length); 
  return NextResponse.json(properties);
}