import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbInit from '@/lib/dbInit';
import User from '@/models/User';

export async function POST(req) {
  await dbInit();

  const { name, email, password ,role} = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: 'fill all the fields ' },
      { status: 400 }
    );
  }

  const existing = await User.findOne({ where: { email } });

  if (existing) {
    return NextResponse.json(
      { error: 'Email already registered' },
      { status: 409 }
    );
  }

  const hashed = await bcrypt.hash(password, 12);

  await User.create({ name, email, password: hashed , role });

  return NextResponse.json({ message: 'Account Created!' });
}