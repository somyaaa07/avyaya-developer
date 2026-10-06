'use client';
import { useRef, useState } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, Loader2, UploadCloud, X } from 'lucide-react';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageUpload({ value = [], onChange, max = 20 }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [errors, setErrors] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  // Upload ke dauran parent ki value badal sakti hai, isliye latest value ref me rakhte hain
  const valueRef = useRef(value);
  valueRef.current = value;

  const atLimit = value.length >= max;
  const disabled = uploading || atLimit;

  const uploadFiles = async (fileList) => {
    const problems = [];
    let files = Array.from(fileList || []);
    if (!files.length) return;

    // Sirf images, 5MB tak
    files = files.filter((f) => {
      if (!f.type.startsWith('image/')) {
        problems.push(`${f.name} is not an image.`);
        return false;
      }
      if (f.size > MAX_SIZE) {
        problems.push(`${f.name} is too large (max 5MB).`);
        return false;
      }
      return true;
    });

    // Max images limit
    const slots = Math.max(0, max - valueRef.current.length);
    if (files.length > slots) {
      problems.push(`You can add up to ${max} images. Extra files were skipped.`);
      files = files.slice(0, slots);
    }

    setErrors(problems);
    if (!files.length) return;

    setUploading(true);
    setProgress({ done: 0, total: files.length });
    const newUrls = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.url) {
          newUrls.push(data.url);
        } else {
          problems.push(`${file.name}: ${data.error || 'upload failed.'}`);
        }
      } catch (err) {
        console.error('❌ Upload error:', err);
        problems.push(`${file.name}: couldn’t reach the server.`);
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }

    setErrors([...problems]);
    if (newUrls.length) onChange([...valueRef.current, ...newUrls]);
    setUploading(false);
  };

  const handleFileChange = (e) => {
    uploadFiles(e.target.files);
    e.target.value = ''; // same file dobara select kar sako
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) uploadFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => onChange(value.filter((_, i) => i !== index));

  const moveImage = (from, to) => {
    const updated = [...value];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  const ctrl =
    'flex h-8 w-8 items-center justify-center rounded-full bg-[#0f2645]/85 text-white transition hover:bg-[#0f2645] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]';

  return (
    <div className="font-sans">
      {/* Previews */}
      {value.length > 0 && (
        <ul className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url, index) => (
            <li
              key={url + index}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F3F0E8] ${
                index === 0 ? 'ring-2 ring-[#D4AF37] ring-offset-2' : 'border border-[#0f2645]/15'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Property image ${index + 1}`} className="h-full w-full object-cover" />

              {index === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-[#0f2645] px-2.5 py-1 text-[11px] tracking-wide text-[#F5D77A]">
                  COVER
                </span>
              )}

              <div className="absolute inset-x-2 bottom-2 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {index > 0 && (
                    <button type="button" onClick={() => moveImage(index, index - 1)} aria-label="Move image earlier" className={ctrl}>
                      <ChevronLeft size={16} aria-hidden="true" />
                    </button>
                  )}
                  {index < value.length - 1 && (
                    <button type="button" onClick={() => moveImage(index, index + 1)} aria-label="Move image later" className={ctrl}>
                      <ChevronRight size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label="Remove image"
                  className={`${ctrl} !bg-[#9C3B2B]/90 hover:!bg-[#9C3B2B]`}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Dropzone */}
      <label
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition focus-within:border-[#D4AF37] focus-within:ring-4 focus-within:ring-[#FFCD39]/30 ${
          disabled
            ? 'cursor-not-allowed border-[#0f2645]/15 bg-[#F3F0E8]/60 opacity-70'
            : dragOver
            ? 'cursor-pointer border-[#D4AF37] bg-[#FFCD39]/10'
            : 'cursor-pointer border-[#0f2645]/20 bg-[#F3F0E8]/50 hover:border-[#D4AF37] hover:bg-[#F3F0E8]'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={disabled}
          className="sr-only"
        />
        {uploading ? (
          <>
            <Loader2 size={26} className="animate-spin text-[#B8902F]" aria-hidden="true" />
            <span className="text-[15px] text-[#0f2645]" role="status">
              Uploading {Math.min(progress.done + 1, progress.total)} of {progress.total}…
            </span>
          </>
        ) : atLimit ? (
          <span className="text-[15px] text-[#52685B]">Maximum of {max} images reached</span>
        ) : (
          <>
            <UploadCloud size={28} className="text-[#B8902F]" aria-hidden="true" />
            <span className="text-[15px] text-[#0f2645]">
              {value.length > 0 ? 'Add more images' : 'Upload images'}
            </span>
            <span className="text-xs text-[#52685B]">Click to browse or drag and drop</span>
          </>
        )}
      </label>

      <p className="mt-2 text-xs text-[#52685B]">
        JPG, PNG, WEBP or GIF · max 5MB each · first image is the cover
        {value.length > 0 && ` · ${value.length}/${max}`}
      </p>

      {/* Errors (alert ki jagah) */}
      {errors.length > 0 && (
        <ul role="alert" className="mt-3 space-y-1.5 rounded-xl border border-[#9C3B2B]/25 bg-[#F6E3DF] px-4 py-3 text-sm text-[#9C3B2B]">
          {errors.map((m, i) => (
            <li key={i} className="flex items-start gap-2">
              <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" /> {m}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}