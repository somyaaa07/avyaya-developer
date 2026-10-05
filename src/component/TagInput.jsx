'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const C = {
  primary: '#2e5d42',
  primaryPale: '#e8f0eb',
  white: '#ffffff',
  border: '#d6ddd8',
  text: '#1a2e22',
  muted: '#6b7c72',
};

/**
 * Tag input for string arrays.
 * - Enter or comma adds a tag, Backspace on empty input removes the last one
 * - Pending text is added on blur
 * - Optional `suggestions` render as one-click chips
 *
 * <TagInput value={form.amenities} onChange={fn} suggestions={['Gym', 'Lift']} />
 */
export default function TagInput({
  value = [],
  onChange,
  placeholder = 'Type and press Enter',
  suggestions = [],
}) {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);

  const addMany = (raw) => {
    const items = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s, i, arr) => arr.indexOf(s) === i)
      .filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()));
    if (items.length) onChange([...value, ...items]);
  };

  const commit = () => {
    addMany(text);
    setText('');
  };

  const remove = (item) => onChange(value.filter((v) => v !== item));

  const remaining = suggestions.filter(
    (s) => !value.some((v) => v.toLowerCase() === s.toLowerCase())
  );

  return (
    <div>
      {/* Input box with chips inside */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 10px',
          minHeight: '50px',
          background: C.white,
          border: `1.5px solid ${focused ? C.primary : C.border}`,
          boxShadow: focused ? `0 0 0 3px ${C.primaryPale}` : 'none',
          borderRadius: '12px',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          cursor: 'text',
        }}
        onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
      >
        <AnimatePresence initial={false}>
          {value.map((item) => (
            <motion.span
              key={item}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 6px 5px 12px',
                background: C.primaryPale,
                color: C.primary,
                border: `1px solid ${C.primary}22`,
                borderRadius: '999px',
                fontFamily: "'Jost', sans-serif",
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              {item}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(item);
                }}
                aria-label={`Remove ${item}`}
                style={{
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  border: 'none',
                  background: `${C.primary}1f`,
                  color: C.primary,
                  fontSize: '13px',
                  lineHeight: 1,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                ×
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        <input
          value={text}
          placeholder={value.length ? 'Add another…' : placeholder}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            if (text.trim()) commit();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              commit();
            } else if (e.key === 'Backspace' && !text && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          style={{
            flex: 1,
            minWidth: '140px',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            padding: '6px 4px',
            fontFamily: "'Jost', sans-serif",
            fontSize: '15px',
            color: C.text,
          }}
        />
      </div>

      {/* Quick-add suggestions */}
      {remaining.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: C.muted,
              marginBottom: '8px',
            }}
          >
            Quick add
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {remaining.map((s) => (
              <motion.button
                key={s}
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange([...value, s])}
                style={{
                  padding: '5px 12px',
                  background: 'transparent',
                  border: `1px dashed ${C.border}`,
                  borderRadius: '999px',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '12.5px',
                  color: C.muted,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.primary;
                  e.currentTarget.style.color = C.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.color = C.muted;
                }}
              >
                + {s}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <p
        style={{
          marginTop: '10px',
          fontSize: '12px',
          color: C.muted,
          fontFamily: "'Jost', sans-serif",
        }}
      >
        Press Enter or comma to add{value.length > 0 ? ` · ${value.length} added` : ''}
      </p>
    </div>
  );
}