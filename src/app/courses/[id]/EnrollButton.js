'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EnrollButton({ courseId, isLoggedIn }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/courses/${courseId}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorText = typeof data.error === 'object' ? JSON.stringify(data.error) : (data.error || 'Failed to enroll.');
        setError(errorText);
        setLoading(false);
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      router.push(`/learning-portal/${courseId}`);
      router.refresh();

    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="enroll-btn-container w-full">
      {error && <p className="enroll-error mb-2">{error}</p>}
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="btn btn-primary w-full text-center"
      >
        {loading ? 'Enrolling...' : 'Enroll in Course 🎓'}
      </button>
    </div>
  );
}
