// src/components/UrlInputForm.tsx
import React, { useState } from 'react';
import Button from './ui/Button';
import { useToast } from '../context/toastContext';
import { supabase } from '../lib/supabase';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

interface UrlInputFormProps {
  chatId: string;
  onUrlAdded: (url: string) => void;
}

const UrlInputForm: React.FC<UrlInputFormProps> = ({ chatId, onUrlAdded }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      showToast('Please enter a URL', 'info');
      return;
    }
    setLoading(true);
    try {
      // 1. Index the website
      const fetchRes = await fetch(`${API_BASE}/fetch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (!fetchRes.ok) throw new Error('Indexing failed');

      // 2. Associate URL with the chat
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Not authenticated');

      const addRes = await fetch(`${API_BASE}/chats/${chatId}/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (!addRes.ok) throw new Error('Failed to associate URL with chat');

      showToast('Website added successfully!', 'success');
      onUrlAdded(url.trim());
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to add URL', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-center" style={{ color: '#24528e' }}>
          Add a Website URL
        </h2>
        <p className="text-gray-500 text-center">
          Enter a URL to start chatting about its content.
        </p>
        <div className="flex gap-2 w-full">
          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <Button type="submit" isLoading={loading} disabled={loading}>
            Add URL
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UrlInputForm;