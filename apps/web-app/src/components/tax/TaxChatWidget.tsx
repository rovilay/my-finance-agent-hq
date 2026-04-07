'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { Button, Card, CardContent, Input } from '@/components/ui';
import { sendTaxChatMessage, fetchConversationHistory } from '@/lib/ai-api';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface TaxChatWidgetProps {
  entityId: string;
  taxYear?: string;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const TaxChatWidget: React.FC<TaxChatWidgetProps> = ({
  entityId,
  taxYear,
  isOpen: externalIsOpen,
  onOpen: externalOnOpen,
  onClose: externalOnClose,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const historyLoadedRef = useRef(false);

  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleOpen = () => {
    if (externalOnOpen) {
      externalOnOpen();
    } else {
      setInternalIsOpen(true);
    }
  };
  const [input, setInput] = useState('');
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
    if (isOpen && !historyLoadedRef.current) {
      historyLoadedRef.current = true;
      loadHistory();
    }
  }, [isOpen]);

  const SUGGESTED_QUESTIONS = [
    'What is a T4 slip and where do I get it?',
    'Do I need to file taxes if I arrived mid-year?',
    'What credits can newcomers claim?',
    'How do tax brackets work in Canada?',
  ];

  const sendSuggestion = (question: string) => {
    setInput(question);
    // Use a ref-based approach: set input then trigger send on next tick
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), content: question, role: 'user', timestamp: new Date() },
      ]);
      setInput('');
      setIsLoading(true);
      sendTaxChatMessage({ message: question, entityId, taxYear })
        .then(data =>
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              content: data.response,
              role: 'assistant',
              timestamp: new Date(),
            },
          ])
        )
        .catch(() =>
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              content: "I'm having trouble responding right now. Please try again.",
              role: 'assistant',
              timestamp: new Date(),
            },
          ])
        )
        .finally(() => setIsLoading(false));
    }, 0);
  };

  const WELCOME_MESSAGE: Message = {
    id: 'welcome',
    content:
      "Hello! 👋 I'm your Canadian Tax Assistant for newcomers. I'm here to help you understand your taxes in simple terms. Feel free to ask me anything about Canadian taxes, deductions, credits, or your tax situation!",
    role: 'assistant',
    timestamp: new Date(),
  };

  const loadHistory = async () => {
    try {
      const data = await fetchConversationHistory(entityId, taxYear);
      if (data.messages?.length > 0) {
        const loaded: Message[] = data.messages.map(
          (m: { id: string; role: string; content: string; createdAt: string }) => ({
            id: m.id,
            content: m.content,
            role: m.role as 'user' | 'assistant',
            timestamp: new Date(m.createdAt),
          })
        );
        setMessages(loaded);
      } else {
        setMessages([WELCOME_MESSAGE]);
      }
    } catch {
      setMessages([WELCOME_MESSAGE]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendTaxChatMessage({
        message: input.trim(),
        entityId,
        taxYear,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const markdownComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {
    p: ({ children }) => <p className="text-sm my-1">{children}</p>,
    ul: ({ children }) => <ul className="text-sm list-disc pl-4 my-1 space-y-0.5">{children}</ul>,
    ol: ({ children }) => (
      <ol className="text-sm list-decimal pl-4 my-1 space-y-0.5">{children}</ol>
    ),
    li: ({ children }) => <li className="text-sm">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    h1: ({ children }) => <h1 className="text-sm font-semibold mt-2 mb-1">{children}</h1>,
    h2: ({ children }) => <h2 className="text-sm font-semibold mt-2 mb-1">{children}</h2>,
    h3: ({ children }) => <h3 className="text-sm font-semibold mt-1 mb-0.5">{children}</h3>,
    code: ({ children }) => (
      <code className="text-xs bg-neutral-100 rounded px-1 py-0.5 font-mono">{children}</code>
    ),
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 w-16 h-16 bg-linear-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 group cursor-pointer"
          aria-label="Open tax chat assistant"
        >
          <MessageCircle className="w-7 h-7 transition-transform group-hover:scale-110" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-success-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-150 shadow-2xl z-50 flex flex-col animate-in fade-in-0 slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-linear-to-r from-primary-500 to-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Tax Assistant 🇨🇦</h3>
                <p className="text-xs text-white/80">For Newcomers to Canada</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="hover:bg-white/20 rounded-full p-1.5 transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-900'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <ReactMarkdown components={markdownComponents}>{message.content}</ReactMarkdown>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                  <p
                    className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-neutral-500'}`}
                  >
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Suggested questions — only show when conversation is fresh */}
            {messages.length === 1 && messages[0].id === 'welcome' && !isLoading && (
              <div className="flex flex-wrap gap-2 mt-1">
                {SUGGESTED_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => sendSuggestion(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary-200 bg-white text-primary-700 hover:bg-primary-50 hover:border-primary-400 transition-colors text-left leading-snug cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-200 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="border-t border-neutral-200 p-4 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about Canadian taxes..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="md"
                className="shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-neutral-500 mt-2 text-center">
              AI responses may contain errors. Verify with CRA.
            </p>
          </div>
        </Card>
      )}
    </>
  );
};

export default TaxChatWidget;
