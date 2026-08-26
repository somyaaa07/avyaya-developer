import { NextResponse } from 'next/server';
import dbInit, { Property } from '@/lib/dbInit';

export async function GET() {
  await dbInit();

  const properties = await Property.findAll({
    attributes: ['city'],
    where: { status: 'active' },
  });

  const cities = [...new Set(
    properties.map(p => p.city).filter(Boolean)
  )].sort();

  return NextResponse.json(cities);
}