import { NextResponse } from 'next/server';
import dbInit from '@/lib/dbInit';
import Agent from '@/models/Agent';

export async function GET() {
  await dbInit();
  const agents = await Agent.findAll({ order: [['created_at', 'DESC']] });
  return NextResponse.json(agents);
}

export async function POST(req) {
  await dbInit();
  const body = await req.json();
  const agent = await Agent.create(body);
  return NextResponse.json(agent);
}