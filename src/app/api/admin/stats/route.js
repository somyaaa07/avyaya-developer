import { NextResponse } from 'next/server';
import dbInit, { User, Agent, Property, Inquiry } from '@/lib/dbInit';

export async function GET() {
  await dbInit();

  const [properties, agents, inquiries, users, newInquiries] = await Promise.all([
    Property.count(),
    Agent.count(),
    Inquiry.count(),
    User.count(),
    Inquiry.count({ where: { status: 'new' } }),
  ]);

  return NextResponse.json({ properties, agents, inquiries, users, newInquiries });
}