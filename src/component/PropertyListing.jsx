'use client';

import { useEffect, useState } from 'react';

export default function PropertiesList({ type, heading }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const url = type
    ? `/api/admin/properties?type=${type}`
    : `/api/admin/properties`;

  console.log('🔍 Fetching:', url);

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log('📦 Response:', data);
      setProperties(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch(err => {
      console.error('❌ Fetch error:', err);
      setLoading(false);
    });
}, [type]);

  if (loading) return <p>Loading...</p>;
  if (!properties.length) return <p>No properties found.</p>;

  return (
    <div>
      <h1>{heading}</h1>
      <div className="grid grid-cols-3 gap-4">
        {properties.map(property => (
          <div key={property.id} className="border rounded p-4">
            {/* Show first image */}
            {property.images?.[0] && (
              <img
                src={property.images[0].url}
                alt={property.title}
                className="w-full h-48 object-cover rounded"
              />
            )}
            <h2 className="text-lg font-bold mt-2">{property.title}</h2>
            <p>{property.city}</p>
            <p className="text-green-600 font-semibold">PKR {property.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}