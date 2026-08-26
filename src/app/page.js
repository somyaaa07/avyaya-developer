import Link from 'next/link';

export default function HomePage() {
  const categories = [
    { label: 'Buy',  desc: 'Wanna buy home?',  color: '#3b82f6', type: 'buy'  },
    { label: 'Sell', desc: 'wanna sell home?',    color: '#10b981', type: 'sell' },
    { label: 'Rent', desc: 'need rented house', color: '#f59e0b', type: 'rent' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: '#fff',
        padding: '100px 24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '800',
          marginBottom: '16px',
          lineHeight: 1.2
        }}>
          Find Your Home
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#94a3b8',
          marginBottom: '40px'
        }}>
          Buy, Sell or Rent Your Properties
        </p>

        <Link
          href="/properties"
          style={{
            padding: '16px 40px',
            background: '#3b82f6',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
         See Properties
        </Link>
      </div>

      {/* Categories */}
      <div style={{
        maxWidth: '900px',
        margin: '60px auto',
        padding: '0 24px'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '32px',
          color: '#1e293b'
        }}>
          what you wanna search
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px'
        }}>
          {categories.map(cat => (
            <Link
              href={`/properties?type=${cat.type}`}
              key={cat.type}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="card"
                style={{
                  background: '#fff',
                  padding: '32px 24px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                  borderTop: `4px solid ${cat.color}`,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
              >
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: cat.color,
                  marginBottom: '8px'
                }}>
                  {cat.label}
                </h3>

                <p style={{
                  color: '#64748b',
                  fontSize: '14px'
                }}>
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}