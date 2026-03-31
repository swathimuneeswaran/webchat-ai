import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Auth from './components/ui/Auth';
import ChatList from './components/ui/ChatList';
import QAList from './components/QAList';
import QuestionInput from './components/QuestionInput';
import UrlInputForm from './components/UrlInputForm';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import { Trash2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

function App() {
  const [session, setSession] = useState<any>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatUrl, setChatUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
const hasActiveChatWithoutUrl = selectedChatId !== null && chatUrl === null;
  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setSelectedChatId(null);
        setChatUrl(null);
        setMessages([]);
      }
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  // Fetch messages (reusable)
  const fetchMessages = useCallback(async (chatId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    if (error) console.error('Error fetching messages:', error);
    else setMessages(data || []);
  }, []);

  // Fetch chat URL when chat changes
  useEffect(() => {
    if (!selectedChatId) {
      setChatUrl(null);
      return;
    }
    const fetchChatUrl = async () => {
      const { data, error } = await supabase
        .from('chat_urls')
        .select('url')
        .eq('chat_id', selectedChatId)
        .maybeSingle();
      if (error) console.error('Error fetching chat URL:', error);
      setChatUrl(data?.url || null);
    };
    fetchChatUrl();
  }, [selectedChatId]);

  // Fetch messages and subscribe when chat has URL
  useEffect(() => {
    if (!selectedChatId || !chatUrl) return;
    fetchMessages(selectedChatId);

    const subscription = supabase
      .channel(`messages:${selectedChatId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `chat_id=eq.${selectedChatId}` }, () => {
        fetchMessages(selectedChatId);
      })
      .subscribe();
    return () => subscription.unsubscribe();
  }, [selectedChatId, chatUrl, fetchMessages]);

  const sendQuestion = async () => {
    if (!selectedChatId || !question.trim() || isAsking) return;
    setIsAsking(true);
    try {
      const token = session?.access_token;
      const res = await fetch(`${API_BASE}/chats/${selectedChatId}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error('Failed to get answer');
      const data = await res.json();
      console.log('✅ Answer received:', data);

      // Refresh messages immediately
      await fetchMessages(selectedChatId);

      setQuestion('');
    } catch (err) {
      console.error(err);
      alert('Failed to get answer');
    } finally {
      setIsAsking(false);
    }
  };

  const removeUrl = async () => {
    if (!selectedChatId || !chatUrl) return;
    try {
      const token = session?.access_token;
      const res = await fetch(`${API_BASE}/chats/${selectedChatId}/urls/${encodeURIComponent(chatUrl)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to remove URL');
      setChatUrl(null);
    } catch (err) {
      console.error(err);
      alert('Failed to remove URL');
    }
  };

  if (!session) return <Auth />;

  return (
    <main className="h-screen py-5" style={{ backgroundColor: "#f4f8fe" }}>
      <div className="max-w-8xl mx-auto px-20 h-full flex flex-col">
        <Header session={session} />

        <div className="flex flex-1 min-h-0 mt-5 gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 h-full">
            <ChatList
              selectedChatId={selectedChatId}
              onSelectChat={setSelectedChatId}
              onCreateNewChat={async () => {
                if (!session) return;
                const { data, error } = await supabase
                  .from('chats')
                  .insert({ user_id: session.user.id })
                  .select()
                  .single();
                if (error) console.error(error);
                else {
                  setSelectedChatId(data.id);
                  setChatUrl(null);
                  setMessages([]);
                }
              }}
              disableNewChat={hasActiveChatWithoutUrl}
            />
          </div>

          {/* Main chat area */}
          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl shadow-lg overflow-hidden">
            {selectedChatId ? (
              <>
                {chatUrl ? (
                  <>
                    <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                      <div className="truncate">
                        <span className="text-sm text-gray-500">Website:</span>
                        <span className="ml-2 text-sm font-medium text-blue-600">
                          {chatUrl}
                        </span>
                      </div>
                      <button
                        onClick={removeUrl}
                        className="text-red-500 hover:text-red-700"
                        title="Remove URL"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <QAList messages={messages} />
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <QuestionInput
                        question={question}
                        onChange={setQuestion}
                        onSend={sendQuestion}
                        disabled={isAsking}
                        isLoading={isAsking}
                      />
                    </div>
                  </>
                ) : (
                  <UrlInputForm chatId={selectedChatId} onUrlAdded={setChatUrl} />
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select or create a chat to start
              </div>
            )}
          </div>

          {/* Right robot illustration – optional */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <img
              src="/images/img4.png"
              alt="Robot assistant"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;