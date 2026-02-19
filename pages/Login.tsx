import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { supabase } from '../supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    // basic signup
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: email.split('@')[0], // Default name
          avatar: `https://i.pravatar.cc/150?u=${email}`
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setError('Check your email for the confirmation link!');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-light flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600">Dronetribes</h1>
          <p className="text-gray-500 mt-1">Welcome back! Please sign in to your account.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                Email Address
              </label>
              <input
                className="border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-300"
                id="username"
                type="text"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-300"
                id="password"
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className='flex gap-2'>
              <Button className="w-full" type="button" variant="secondary" onClick={handleSignUp} disabled={loading}>
                Sign Up
              </Button>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Sign In'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;