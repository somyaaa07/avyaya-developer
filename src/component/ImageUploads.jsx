'use client';
import { useState } from 'react';

export default function ImageUpload({ value = [], onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    const newUrls = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} too large — max 5MB`);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) {
          newUrls.push(data.url);
        } else {
          alert('Upload failed: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('❌ Upload error:', err);
        alert('Upload failed. Try again.');
      }
    }

    if (newUrls.length) {
      onChange([...value, ...newUrls]);
    }

    setUploading(false);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const removeImage = (index) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const moveImage = (from, to) => {
    const updated = [...value];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}>

      {/* ── Previews Grid ── */}
      {value.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '10px',
          marginBottom: '14px',
        }}>
          {value.map((url, index) => (
            <div key={url + index} style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              border: index === 0 ? '2px solid #2e5d42' : '1px solid #d6ddd8',
              aspectRatio: '4/3',
              background: '#f0f4f1',
            }}>
              <img
                src={url}
                alt={`Property image ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />

              {/* Primary badge */}
              {index === 0 && (
                <span style={{
                  position: 'absolute', top: '6px', left: '6px',
                  background: '#2e5d42', color: '#fff',
                  fontSize: '10px', fontWeight: '600', letterSpacing: '0.05em',
                  padding: '2px 7px', borderRadius: '4px',
                }}>
                  MAIN
                </span>
              )}

              {/* Controls */}
              <div style={{
                position: 'absolute', top: '6px', right: '6px',
                display: 'flex', gap: '4px',
              }}>
                {index > 0 && (
                  <button
                    onClick={() => moveImage(index, index - 1)}
                    title="Move left"
                    style={iconBtn}
                  >◀</button>
                )}
                {index < value.length - 1 && (
                  <button
                    onClick={() => moveImage(index, index + 1)}
                    title="Move right"
                    style={iconBtn}
                  >▶</button>
                )}
                <button
                  onClick={() => removeImage(index)}
                  title="Remove"
                  style={{ ...iconBtn, background: '#c0392b' }}
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Upload Button ── */}
      <label style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '14px',
        border: `2px dashed ${uploading ? '#93c5fd' : '#d6ddd8'}`,
        borderRadius: '10px',
        cursor: uploading ? 'not-allowed' : 'pointer',
        color: '#6b7c72',
        fontSize: '14px',
        background: uploading ? '#f8fafc' : '#fafaef',
        transition: 'all 0.2s',
      }}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={uploading}
        />
        {uploading ? (
          <span style={{ color: '#3b82f6' }}>⏳ Uploading…</span>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            {value.length > 0 ? 'Add More Images' : 'Upload Images'}
          </>
        )}
      </label>

      <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
        JPG, PNG, WEBP — Max 5MB each. First image = main display image.
      </p>
    </div>
  );
}

const iconBtn = {
  width: '22px', height: '22px',
  background: 'rgba(0,0,0,0.55)',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '10px',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  lineHeight: 1,
};