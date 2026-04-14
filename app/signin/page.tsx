"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function Signin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router=useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'login failed');
        return;
      }

      router.push('/');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='text-center flex flex-row items-center justify-center mt-40 w-full  bg-gray-800'>
        <div className='bg-gray-800 w-1/3 p-8 rounded-lg'>
          <h1 className='text-2xl font-bold mb-6'>Signin</h1>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label htmlFor="email" className='block text-left mb-2'>Email:</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full px-3 py-2 border rounded-md'
              />
            </div>
            <div>
              <label htmlFor="password" className='block text-left mb-2'>Password:</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full px-3 py-2 border rounded-md'
              />
            </div>
            <button type="submit" className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 mt-4'>
              Sign In
            </button>

          </form>
          <p className='text-sm text-gray-800 mt-4'>
            Don't have an account?{' '}
            <Link href="/signup" className='text-blue-500 hover:text-blue-700'>
              Sign up
            </Link>
          </p>
        </div>
    </div>
    
  )
}
