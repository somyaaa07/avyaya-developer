'use client';
import { useState, useEffect } from 'react';
import { useSession }          from 'next-auth/react';
import { useRouter }           from 'next/navigation';
import ImageUpload from '@/component/ImageUploads';

const C = {
  primary:     '#2e5d42',
  primaryPale: '#e8f0eb',
  bg:          '#fafaef',
  white:       '#ffffff',
  border:      '#d6ddd8',
  text:        '#1a2e22',
  muted:       '#6b7c72',
  accent:      '#c8a96e',
};

export default function ListPropertyPage() {
  const { data: session, status } = useSession();
  const router                    = useRouter();
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);

  const [form, setForm] = useState({
    title:         '',
    description:   '',
    price:         '',
    type:          'sell',
    property_type: 'apartment',
    location:      '',
    city:          '',
    area:          '',
    bedrooms:      '',
    bathrooms:     '',
    status:        'active',
    images:        [],
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const res = await fetch('/api/user/properties', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } else {
      setError(data.error || 'Something went wrong');
    }
  };

  const inputStyle = {
    width:        '100%',
    padding:      '11px 14px',
    border:       `1.5px solid ${C.border}`,
    borderRadius: '8px',
    fontSize:     '14px',
    fontFamily:   "'Jost', sans-serif",
    color:        C.text,
    outline:      'none',
    boxSizing:    'border-box',
    background:   C.white,
  };

  const labelStyle = {
    display:       'block',
    fontSize:      '11px',
    fontWeight:    '600',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color:         C.primary,
    marginBottom:  '6px',
    fontFamily:    "'Jost', sans-serif",
  };

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Jost', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>✅</p>
          <h2 style={{ fontFamily: "'Marcellus', serif", fontSize: '24px', color: C.primary, marginBottom: '8px' }}>Property Listed Successfully!</h2>
          <p style={{ color: C.muted }}>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Jost', sans-serif", paddingBottom: '80px' }}>

        {/* Header */}
        <div style={{ background: C.primary, padding: '32px 24px' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <a href="/dashboard" style={{ color: '#a8c5b5', fontSize: '14px', textDecoration: 'none' }}>
              ← Dashboard
            </a>
            <h1 style={{ fontFamily: "'Marcellus', serif", fontSize: '28px', color: '#fff', marginTop: '12px', fontWeight: '400' }}>
              List Your Property
            </h1>
            <p style={{ color: '#a8c5b5', fontSize: '14px', marginTop: '6px' }}>
              You will receive email notifications at ({session?.user?.email}) when someone inquires about your property
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '700px', margin: '32px auto', padding: '0 20px' }}>

          {error && (
            <div style={{ background: '#fdf0ef', borderLeft: `3px solid #c0392b`, borderRadius: '8px', padding: '12px 16px', color: '#c0392b', fontSize: '14px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '32px' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

              {/* Title */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Property Title *</label>
                <input style={inputStyle} value={form.title} placeholder="e.g. 3BHK Apartment in Sector 45" onChange={set('title')} />
              </div>

              {/* Description */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Description</label>
                <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }} value={form.description} placeholder="Enter property details..." onChange={set('description')} />
              </div>

              {/* Price */}
              <div>
                <label style={labelStyle}>Price (₹) *</label>
                <input type="number" style={inputStyle} value={form.price} placeholder="e.g. 5000000" onChange={set('price')} />
              </div>

              {/* Type */}
              <div>
                <label style={labelStyle}>Listing Type *</label>
                <select style={inputStyle} value={form.type} onChange={set('type')}>
                  <option value="sell">Sell</option>
                  <option value="rent">Rent</option>
                  <option value="buy">Buy</option>
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label style={labelStyle}>Property Type *</label>
                <select style={inputStyle} value={form.property_type} onChange={set('property_type')}>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label style={labelStyle}>Bedrooms</label>
                <input type="number" style={inputStyle} value={form.bedrooms} placeholder="e.g. 3" onChange={set('bedrooms')} />
              </div>

              {/* Bathrooms */}
              <div>
                <label style={labelStyle}>Bathrooms</label>
                <input type="number" style={inputStyle} value={form.bathrooms} placeholder="e.g. 2" onChange={set('bathrooms')} />
              </div>

              {/* Area */}
              <div>
                <label style={labelStyle}>Area (sq ft)</label>
                <input type="number" style={inputStyle} value={form.area} placeholder="e.g. 1200" onChange={set('area')} />
              </div>

              {/* Location */}
              <div>
                <label style={labelStyle}>Location / Area *</label>
                <input style={inputStyle} value={form.location} placeholder="e.g. Sector 45, Noida" onChange={set('location')} />
              </div>

              {/* City */}
              <div>
                <label style={labelStyle}>City *</label>
                <input style={inputStyle} value={form.city} placeholder="e.g. Noida" onChange={set('city')} />
              </div>

              {/* Images */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Property Images</label>
                <ImageUpload
                  value={form.images}
                  onChange={(urls) => setForm(p => ({ ...form, images: urls }))}
                />
              </div>

            </div>

            {/* Info box */}
            <div style={{ background: C.primaryPale, borderRadius: '8px', padding: '14px 16px', marginTop: '24px', fontSize: '13px', color: C.primary }}>
              ℹ️ When someone inquires about your property, an email notification will be sent to <strong>{session?.user?.email}</strong>.
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width:        '100%',
                marginTop:    '24px',
                padding:      '14px',
                background:   loading ? C.muted : C.primary,
                color:        '#fff',
                border:       'none',
                borderRadius: '10px',
                fontSize:     '16px',
                fontFamily:   "'Jost', sans-serif",
                fontWeight:   '600',
                cursor:       loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Listing Property...' : 'List Property'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}