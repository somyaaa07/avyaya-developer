import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbInit from '@/lib/dbInit';
import User from '@/models/User';

export async function GET() {
  try {
    await dbInit();
    const admins = await User.count({ where: { role: 'admin' } });
    return NextResponse.json({ needsSetup: admins === 0 });
  } catch (err) {
    return NextResponse.json({ error: 'Unable to check setup status' }, { status: 500 });
  }
}

export async function POST(req) {
  await dbInit();

  const admins = await User.count({ where: { role: 'admin' } });
  if (admins > 0) {
    return NextResponse.json(
      { error: 'Setup already completed. Please log in.' },
      { status: 403 }
    );
  }

  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Please fill in all fields' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  await User.create({ name, email, password: hashed, role: 'admin' });

  return NextResponse.json({ message: 'Account Created!' });
}