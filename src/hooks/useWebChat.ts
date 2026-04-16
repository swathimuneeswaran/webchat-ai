import { useState } from 'react';
import type { AppState, Message } from '../types';
import { EXAMPLE_MESSAGES } from '../utils/constants';
import { useToast } from '../context/toastContext';

const API_BASE = 'http://54.80.228.75:3000/api'; // adjust if needed

export const useWebChat = () => {
  const [state, setState] = useState<AppState>('input');
  const [url, setUrl] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const {showToast}=useToast()

  const handleFetchAnalyze = async () => {
    if (!url.trim()) return;
    setIsFetching(true);
    setState('analyzing');
    try {
      const response = await fetch(`${API_BASE}/fetch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) {
        throw new Error('Failed to index website');
      }
      // Success: move to Q&A state
      setState('qa');
      showToast('Website indexed successfully!', 'success');
    } catch (error) {
      console.error(error);
      // Optionally show error to user via toast/alert
      showToast('Failed to index website. Please check the URL and try again.',"error");
      setState('input');
    } finally {
      setIsFetching(false);
    }
  };

// Inside handleSendQuestion
const handleSendQuestion = async () => {
  if (!question.trim() || isAsking) return;
  setIsAsking(true);
  try {
    const response = await fetch(`${API_BASE}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, url }),
    });
    if (!response.ok) {
      throw new Error('Failed to get answer');
    }
    const data = await response.json();
    const newMessage: Message = {
      id: Date.now().toString(),
      question,
      answer: data.answer,
      sources: data.sources, 
    };
    setMessages(prev => [...prev, newMessage]);
    setQuestion('');
  } catch (error) {
    console.error(error);
    showToast('Failed to get answer. Please try again.', 'error');
  } finally {
    setIsAsking(false);
  }
};

  return {
    state,
    url,
    setUrl,
    question,
    setQuestion,
    messages,
    handleFetchAnalyze,
    handleSendQuestion,
    isFetching,
    isAsking,
  };
};
