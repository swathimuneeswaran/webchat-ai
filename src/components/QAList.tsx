import React, { useRef, useEffect } from 'react';
import { Bot, User } from 'lucide-react';
import type { Message } from '../types';

interface QAListProps {
  messages: Message[];
}

const QAList: React.FC<QAListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto pr-2 py-5 space-y-4">
      {messages.map((msg) => (
        <div key={msg.id}>
          {msg.role === 'user' ? (
            <div className="flex justify-end mb-2">
              <div className="flex items-start gap-2 max-w-[80%]">
                <div className="bg-blue-600 text-white rounded-2xl rounded-br-none px-4 py-2 shadow-sm">
                  <p className="text-sm">{msg.content}</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-start mb-2">
              <div className="flex items-start gap-2 max-w-[80%]">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none px-4 py-2 shadow-sm">
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          )}
          {/* Sources only for assistant messages */}
          {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
            <div className="mt-2 ml-8 text-xs text-gray-500 border-t border-gray-200 pt-2">
              <p className="font-semibold text-gray-600 mb-1">Sources:</p>
              {msg.sources.map((src, idx) => (
                <div key={idx} className="mt-1 pl-2 border-l-2 border-gray-300">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {src.url}
                  </a>
                  <p className="truncate text-gray-500">{src.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default QAList;