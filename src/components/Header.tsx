import React, { useState } from 'react';
import { MessageSquareText, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  session: any; // Pass the session from App to conditionally show logout
}

const Header: React.FC<HeaderProps> = ({ session }) => {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await supabase.auth.signOut();
    // The App component will automatically detect the session change and show Auth
    setLoggingOut(false);
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-300 py-3">
      <div className="flex gap-3.5 items-center">
        <MessageSquareText size={50} color="white" fill="#2374d3" />
        <h1 className="text-4xl font-bold">
          <span style={{ color: '#355b8e' }}>WebChat</span>{' '}
          <span style={{ color: '#6587bc' }} className="font-medium">AI</span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {session && (
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        )}
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-3xl">🤖</span>
        </div>
      </div>
    </div>
  );
};

export default Header;