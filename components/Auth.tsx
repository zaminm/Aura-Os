
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { LogoIcon, SpinnerIcon } from './Icons';

export const Auth: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const resetState = () => {
      setError(null);
      setMessage(null);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    resetState();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    resetState();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setMessage('Success! Check your email for the confirmation link.');
      setEmail('');
      setPassword('');
    }
    setLoading(false);
  };

  const handleTabChange = (signUp: boolean) => {
      setIsSignUp(signUp);
      resetState();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-beige">
      <div className="w-full max-w-sm p-8 space-y-6 bg-brand-white rounded-lg shadow-lg border border-brand-grey/30 relative">
        {onBack && (
            <button 
                onClick={onBack} 
                className="absolute top-4 left-4 text-brand-grey hover:text-brand-navy transition-colors"
                aria-label="Back to home"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
        )}
        <div className="flex flex-col items-center pt-6">
          <LogoIcon className="w-12 h-12 text-brand-navy" />
          <h1 className="mt-2 text-3xl font-bold tracking-wide text-brand-navy">Aura</h1>
          <p className="text-brand-grey">Your personal life OS</p>
        </div>

        <div className="flex border-b border-brand-grey/30">
            <button 
                onClick={() => handleTabChange(false)}
                className={`w-1/2 py-2 text-center font-semibold transition-colors ${!isSignUp ? 'text-brand-burgundy border-b-2 border-brand-burgundy' : 'text-brand-grey hover:text-brand-navy'}`}
            >
                Sign In
            </button>
            <button 
                onClick={() => handleTabChange(true)}
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
              className="w-full h-10 px-4 py-2 font-bold text-white bg-brand-navy rounded-md hover:bg-brand-burgundy focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-burgundy disabled:opacity-50 transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <SpinnerIcon className="w-6 h-6" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </div>
          {message && <p className="text-green-600 text-sm text-center">{message}</p>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};
