import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import Button from './ui/Button'; // use Button component

interface QuestionInputProps {
  question: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  question,
  onChange,
  onSend,
  disabled,
  isLoading = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled && !isLoading && question.trim()) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      className={`
        flex items-center gap-2 bg-white rounded-xl border transition-all
        ${isFocused 
          ? 'border-blue-400 ring-2 ring-blue-100' 
          : 'border-gray-200 hover:border-gray-300'
        }
        ${disabled || isLoading ? 'opacity-60 bg-gray-50' : ''}
      `}
    >
      <input
        type="text"
        value={question}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Ask a follow-up question..."
        disabled={disabled || isLoading}
        className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 disabled:cursor-not-allowed"
      />
      <Button
        onClick={onSend}
        disabled={disabled || isLoading || !question.trim()}
        isLoading={isLoading}
        variant="primary"
        className="mr-2"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default QuestionInput;