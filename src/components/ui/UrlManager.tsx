import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Plus } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

const normalizeUrl = (url: string): string => {
  return url.trim().toLowerCase().replace(/\/$/, '');
};

interface UrlManagerProps {
  chatId: string;
}

const UrlManager: React.FC<UrlManagerProps> = ({ chatId }) => {
  const [urls, setUrls] = useState<{ id: string; url: string; title: string }[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUrls = async () => {
  const { data, error } = await supabase
    .from('chat_urls')
    .select('url')
    .eq('chat_id', chatId);
  if (error) console.error('fetchUrls error:', error);
  else {
    const mapped = data.map(item => ({
      id: item.url, // use URL as unique identifier
      url: item.url,
      title: item.url,
    }));
    setUrls(mapped);
  }
};

  useEffect(() => {
    fetchUrls();
  }, [chatId]);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session token:', session?.access_token?.slice(0, 20) + '...');
    return session?.access_token;
  };

 

  const addUrl = async () => {
  if (!newUrl.trim()) return;
  setLoading(true);
  try {
    const normalized = normalizeUrl(newUrl);
    const token = await getToken();
    if (!token) throw new Error('No authentication token');

    // Step 1: Index the URL
    const fetchRes = await fetch(`${API_BASE}/fetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url: normalized }),
    });
    if (!fetchRes.ok) throw new Error(`Indexing failed: ${fetchRes.status}`);

    // Step 2: Add URL to chat
    const addRes = await fetch(`${API_BASE}/chats/${chatId}/urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url: normalized }),
    });
    if (!addRes.ok) throw new Error(`Failed to add URL to chat: ${addRes.status}`);

    setNewUrl('');
    fetchUrls(); // refresh the list
  } catch (err) {
    console.error('addUrl error:', err);
    alert(`Failed to add URL: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

  const removeUrl = async (docId: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/chats/${chatId}/urls/${docId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to remove URL');
      fetchUrls();
    } catch (err) {
      console.error(err);
      alert(`Failed to remove URL: ${err.message}`);
    }
  };

  return (
    <div className="border-b border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Context URLs</h3>
      <div className="space-y-2">
        {urls.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <span className="text-xs text-gray-600 truncate" title={item.url}>
              {item.title}
            </span>
            <button onClick={() => removeUrl(item.id)} className="text-red-500 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Add URL..."
          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
          disabled={loading}
        />
        <button
          onClick={addUrl}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default UrlManager;