"use client";

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;

}

interface AIHelperProps {
  onClose: () => void;
}

export default function AIHelper({ onClose }: AIHelperProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your MemoirVault AI assistant named Memo. I'm here to help you with writing your memoir, organizing your memories, or any questions about the platform. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input when component mounts
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Create initial AI message
    const aiMessageId = (Date.now() + 1).toString();
    const initialAiMessage: Message = {
      id: aiMessageId,
      text: '',
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, initialAiMessage]);

    try {
      const response = await fetch('/api/ai-helper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to get response');
      }

      setMessages(prev => prev.map(msg =>
        msg.id === aiMessageId
          ? { ...msg, text: data.response }
          : msg
      ));
    } catch (error) {
      console.error('Error sending message:', error);

      let errorMessage = "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";

      if (error instanceof Error) {
        if (error.message.includes('AI service temporarily unavailable')) {
          errorMessage = "The AI assistant is currently unavailable. This might be due to missing configuration. Please contact support if this persists.";
        } else if (error.message.includes('authentication failed')) {
          errorMessage = "There's an authentication issue with the AI service. Please contact support.";
        } else if (error.message.includes('busy')) {
          errorMessage = "The AI service is busy right now. Please wait a moment and try again.";
        }
      }

      setMessages(prev => prev.map(msg =>
        msg.id === aiMessageId
          ? { ...msg, text: errorMessage }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickPrompts = [
    "Help me start writing my memoir",
    "I have writer's block, what should I do?",
    "How do I organize my memories chronologically?",
    "What are some good memoir writing prompts?",
    "How do I upload photos to my entries?",
    "Tell me about MemoirVault's privacy features"
  ];



  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-[#EBEDE8] flex justify-between items-center bg-gradient-to-r from-[#004838] to-[#073127] text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E2FB6C] rounded-full flex items-center justify-center">
              <span className="text-[#004838] text-xl">🤖</span>
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold">AI Assistant</h2>
              <p className="text-sm opacity-90">Powered by Google Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#E2FB6C] text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${message.isUser
                  ? 'bg-[#004838] text-white'
                  : 'bg-[#EBEDE8] text-[#333F3C]'
                  }`}
              >
                {message.isUser ? (
                  <p className="whitespace-pre-wrap">{message.text}</p>
                ) : (
                  <div className="ai-message-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                    >
                      {message.text || ''}
                    </ReactMarkdown>
                  </div>
                )}
                <p className={`text-xs mt-1 ${message.isUser ? 'text-[#E2FB6C]' : 'text-gray-500'
                  }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {/* {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#EBEDE8] text-[#333F3C] p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#004838] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#004838] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[#004838] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )} */}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="px-4 py-2 border-t border-[#EBEDE8] space-y-3">
            <div>
              <p className="text-sm text-[#333F3C] mb-2 font-medium">Quick prompts to get started:</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-xs bg-[#E2FB6C] text-[#004838] px-3 py-1 rounded-full hover:bg-[#d4e85c] transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>


          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-[#EBEDE8]">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about memoir writing or MemoirVault..."
              className="flex-1 p-3 border border-[#EBEDE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004838] focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-[#004838] text-[#E2FB6C] rounded-lg font-medium hover:bg-[#073127] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            AI responses are generated and may not always be accurate. Use your best judgment or contact us via email.
          </p>
        </div>
      </div>
    </div>
  );
}