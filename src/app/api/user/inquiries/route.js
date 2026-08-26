import { NextResponse }    from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions }     from '@/app/api/auth/[...nextauth]/route';
import dbInit, { Inquiry, Property, PropertyImage } from '@/lib/dbInit';

export async function GET() {
  await dbInit();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 });
  }

  const inquiries = await Inquiry.findAll({
    where: { user_id: session.user.id },
    order: [['created_at', 'DESC']],
    include: [{
      model: Property,
      as: 'property',
      required: false,
      include: [{
        model: PropertyImage,
        as: 'images',
        order: [['order', 'ASC']],
        limit: 1,
      }],
    }],
  });

  return NextResponse.json(inquiries);
}