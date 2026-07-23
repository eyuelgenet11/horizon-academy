'use client';
import { useState } from 'react';

export default function CloudinaryUpload({ onUploadSuccess, label = 'Upload File', fileType = 'auto' }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setProgress('Uploading to cloud...');

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dxjdwulmc';
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'horizon_uploads';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Upload failed. Check if upload preset is set to Unsigned in Cloudinary.');
      }

      setProgress('✓ Complete');
      onUploadSuccess(data.secure_url);
    } catch (err) {
      console.error('[CLOUDINARY_UPLOAD]', err);
      setError(err.message || 'An error occurred during file upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="cloudinary-uploader-box" style={{ marginTop: '0.5rem' }}>
      <label className="btn btn-outline btn-sm" style={{ display: 'inline-flex', cursor: 'pointer', gap: '0.5rem', alignItems: 'center', margin: 0, borderRadius: 'var(--radius-md)' }}>
        <span>{uploading ? '⏳ Sending...' : `📤 ${label}`}</span>
        <input
          type="file"
          accept={fileType === 'video' ? 'video/*' : fileType === 'audio' ? 'audio/*' : fileType === 'image' ? 'image/*' : '*/*'}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={uploading}
        />
      </label>
      
      {progress && <span style={{ fontSize: '0.8rem', marginLeft: '1rem', color: 'var(--color-primary)' }}>{progress}</span>}
      {error && <p style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '0.5rem', fontWeight: '500' }}>⚠️ {error}</p>}
    </div>
  );
}
