'use client';

import { useState } from 'react';

export default function UploadExample() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [error, setError] = useState('');

interface UploadResponse {
    url?: string;
    error?: string;
}

interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

const handleSubmit = async (e: HandleSubmitEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await fetch('/api/upload-wallpaper', {
            method: 'POST',
            body: formData,
        });
        const data: UploadResponse = await res.json();
        if (!res.ok) {
            setError(data.error || 'Upload failed');
        } else {
            setUploadedUrl(data.url || '');
            setError('');
        }
    } catch (err) {
        console.error('Upload error:', err);
        setError('Unexpected error');
    }
};

  return (
    <div>
      <h1>Upload File to S3</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit">Upload</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {uploadedUrl && (
        <p>
          File uploaded!{' '}
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
            View here
          </a>
        </p>
      )}
    </div>
  );
}