'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    institution: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message.split(" ")[0])
        if(data.message.split(" ")[0]=='E11000') {
          setError('Email already in use');
          return;
        }
        setError( 'Sign up failed');
        return;
      }

      router.push('/signin');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center app-bg py-12 px-4 sm:px-6 lg:px-8 home-bg">
      <div className="max-w-md w-full glass-card p-8">
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-8">Sign Up</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-center text-red-700 px-4 py-3 rounded-2xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-black">
          <div>
            <label htmlFor="name" className="label">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="label">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="role" className="label">
              Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="select"
            >
              <option value="">Select a role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="both">Teacher and student</option>
            </select>
          </div>

          <div>
            <label htmlFor="institution" className="label">
              Institution (Optional)
            </label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              className="input"
              placeholder="Your institution name"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          Already have an account?{' '}
          <a href="/signin" className="text-indigo-700 hover:text-indigo-800 font-semibold">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
