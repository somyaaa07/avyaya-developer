import { NextResponse }    from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions }     from '@/app/api/auth/[...nextauth]/route';
import dbInit, { SavedProperty, Property, PropertyImage } from '@/lib/dbInit';

export async function GET(req) {
  try {
    await dbInit();

    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const property_id = searchParams.get('property_id');

    // Single check
    if (property_id) {
      if (!session) return NextResponse.json({ saved: false });
      const exists = await SavedProperty.findOne({
        where: { user_id: session.user.id, property_id },
      });
      return NextResponse.json({ saved: !!exists });
    }

    if (!session) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 });
    }

    // Step 1 — saved records lo
    const savedRecords = await SavedProperty.findAll({
      where: { user_id: session.user.id },
      order: [['created_at', 'DESC']],
    });

    // Step 2 — har ek ke liye property manually fetch karo
    const result = await Promise.all(
      savedRecords.map(async (record) => {
        const property = await Property.findByPk(record.property_id, {
          include: [{
            model: PropertyImage,
            as:    'images',
            limit: 1,
            order: [['order', 'ASC']],
          }],
        });

        return {
          id:          record.id,
          user_id:     record.user_id,
          property_id: record.property_id,
          created_at:  record.created_at,
          property:    property ? property.toJSON() : null,
        };
      })
    );

    console.log('✅ Saved with properties:', JSON.stringify(result, null, 2));
    return NextResponse.json(result);

  } catch (err) {
    console.error('❌ Saved error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbInit();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 });

    const { property_id } = await req.json();

    const existing = await SavedProperty.findOne({
      where: { user_id: session.user.id, property_id },
    });

    if (existing) {
      await existing.destroy();
      return NextResponse.json({ saved: false });
    } else {
      await SavedProperty.create({ user_id: session.user.id, property_id });
      return NextResponse.json({ saved: true });
    }
  } catch (err) {
    console.error('❌ Save toggle error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}