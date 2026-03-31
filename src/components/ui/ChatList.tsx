import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, MessageSquare } from 'lucide-react';
import { useToast } from '../../context/toastContext';

interface ChatListProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onCreateNewChat: () => Promise<void>;
  disableNewChat?: boolean; // <-- new prop
}

const ChatList: React.FC<ChatListProps> = ({
  selectedChatId,
  onSelectChat,
  onCreateNewChat,
  disableNewChat = false,
}) => {
  const [chats, setChats] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useToast();

  const fetchChats = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data, error } = await supabase
      .from('chats')
      .select('id, created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      showToast('Failed to load chats', 'error');
    } else {
      setChats(data || []);
    }
  }, [showToast]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleCreateChat = async () => {
    if (isCreating || disableNewChat) return;
    setIsCreating(true);
    try {
      await onCreateNewChat();
      await fetchChats(); // refresh list
    } catch (err) {
      console.error(err);
      showToast('Failed to create new chat', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={handleCreateChat}
          disabled={isCreating || disableNewChat}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title={disableNewChat ? "Please add a URL to the current chat first" : ""}
        >
          <Plus className="w-4 h-4" />
          {isCreating ? 'Creating...' : 'New Chat'}
        </button>
        {disableNewChat && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Add a URL to the current chat before creating a new one
          </p>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`p-3 cursor-pointer hover:bg-gray-50 transition ${
              selectedChatId === chat.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 truncate">
                {new Date(chat.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;