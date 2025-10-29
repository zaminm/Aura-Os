import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { LogoIcon } from './Icons';

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else alert('Check your email for the login link!');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-beige">
      <div className="w-full max-w-sm p-8 space-y-6 bg-brand-white rounded-lg shadow-lg border border-brand-grey/30">
        <div className="flex flex-col items-center">
          <LogoIcon className="w-12 h-12 text-brand-navy" />
          <h1 className="mt-2 text-3xl font-bold tracking-wide text-brand-navy">Aura</h1>
          <p className="text-brand-grey">Your personal life OS</p>
        </div>

        <div className="flex border-b border-brand-grey/30">
            <button 
                onClick={() => setIsSignUp(false)}
                className={`w-1/2 py-2 text-center font-semibold transition-colors ${!isSignUp ? 'text-brand-burgundy border-b-2 border-brand-burgundy' : 'text-brand-grey hover:text-brand-navy'}`}
            >
                Sign In
            </button>
            <button 
                onClick={() => setIsSignUp(true)}
                className={`w-1/2 py-2 text-center font-semibold transition-colors ${isSignUp ? 'text-brand-burgundy border-b-2 border-brand-burgundy' : 'text-brand-grey hover:text-brand-navy'}`}
            >
                Sign Up
            </button>
        </div>

        <form className="space-y-4" onSubmit={isSignUp ? handleSignUp : handleLogin}>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              className="w-full px-4 py-2 border rounded-md bg-brand-white border-brand-grey/50 focus:ring-brand-burgundy focus:border-brand-burgundy"
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password"className="sr-only">Password</label>
            <input
              id="password"
              className="w-full px-4 py-2 border rounded-md bg-brand-white border-brand-grey/50 focus:ring-brand-burgundy focus:border-brand-burgundy"
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-brand-navy rounded-md hover:bg-brand-burgundy focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-burgundy disabled:opacity-50 transition-colors"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};
