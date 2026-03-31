import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cooldown, setCooldown] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown) {
      setErrorMessage('Please wait a moment before trying again.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({ email, password });
        if (result.error) {
          if (result.error.message.includes('email rate limit')) {
            setErrorMessage('Too many sign-up attempts. Please wait a few minutes or use a different email.');
            setCooldown(true);
            setTimeout(() => setCooldown(false), 60000);
          } else {
            setErrorMessage(result.error.message);
          }
        } else {
          setErrorMessage('Check your email to confirm your account.');
        }
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) setErrorMessage(result.error.message);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left side – Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="text-gray-500 mb-6">
            {isSignUp
              ? 'Sign up to start chatting with any website.'
              : 'Sign in to continue to your chats.'}
          </p>
          <form onSubmit={handleAuth} className="space-y-4">
            {errorMessage && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                {errorMessage}
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || cooldown}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage('');
              }}
              className="w-full text-sm text-blue-600 hover:underline mt-2"
            >
              {isSignUp
                ? 'Already have an account? Sign In'
                : 'Need an account? Sign Up'}
            </button>
          </form>
        </div>

        {/* Right side – Image */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 items-center justify-center p-8">
          <img
            src="/images/img4.png"
            alt="Robot assistant"
            className="w-full max-w-md object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;