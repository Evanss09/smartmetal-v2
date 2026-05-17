'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import type { ChatMessage } from '@/lib/types';
import Button from '@/components/ui/button';

const QUICK_STARTS = [
  "What's the difference between TDF and S&D flanges?",
  'How do I size a supply trunk duct?',
  'What support spacing do I need for rectangular duct?',
  'When do I use gripples vs threaded rod?',
  'How do I calculate a duct offset?',
  'What causes duct noise and how do I fix it?',
];

export default function AskDanClient() {
  const { isLoggedIn, openModal } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  async function sendMessage(content: string) {
    if (!content.trim() || streaming) return;
    const userMsg: ChatMessage = { role: 'user', content: content.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setStreaming(true);
    setStreamingText('');

    try {
      const res = await fetch('/api/ask-dan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: 'Request failed.' }));
        setMessages((prev) => [...prev, { role: 'assistant', content: `Sorry, something went wrong: ${err.error}` }]);
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setStreamingText(full);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: full }]);
      setStreamingText('');
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Network error. Check your connection and try again.' }]);
    } finally {
      setStreaming(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-surface border border-neutral-800 p-12 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center mb-6">
          <span className="font-display text-2xl font-black text-orange-500">D</span>
        </div>
        <h2 className="font-display text-xl font-black text-neutral-100 uppercase mb-3">Login to Talk to Dan</h2>
        <p className="text-sm text-neutral-500 mb-8 max-w-sm">
          Create a free account to ask Dan anything about sheet metal work. No credit card required.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => openModal('signup')}>Create Account</Button>
          <Button variant="secondary" onClick={() => openModal('login')}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-surface border border-neutral-800" style={{ minHeight: '600px' }}>
      <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-800">
        <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
          <span className="font-display text-base font-black text-white">D</span>
        </div>
        <div>
          <p className="text-sm font-bold text-neutral-100">Dan</p>
          <p className="text-xs text-neutral-500">40-year sheet metal journeyman</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => { setMessages([]); setStreamingText(''); }}
            className="ml-auto text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-400 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
        {messages.length === 0 && !streaming && (
          <div className="flex flex-col items-center py-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-600 mb-6">Try asking Dan about...</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {QUICK_STARTS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left text-xs text-neutral-400 hover:text-neutral-100 border border-neutral-800 hover:border-orange-500/40 px-4 py-3 transition-all duration-150"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                <span className="font-display text-xs font-black text-white">D</span>
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-orange-500/10 border border-orange-500/20 text-neutral-100 ml-auto'
                  : 'bg-[#0a0a0a] border border-neutral-800 text-neutral-300'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {streaming && streamingText && (
          <div className="flex gap-3 flex-row">
            <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center shrink-0 mt-0.5">
              <span className="font-display text-xs font-black text-white">D</span>
            </div>
            <div className="max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap bg-[#0a0a0a] border border-neutral-800 text-neutral-300">
              {streamingText}
              <span className="inline-block w-1.5 h-4 bg-orange-500 ml-0.5 animate-pulse" />
            </div>
          </div>
        )}

        {streaming && !streamingText && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
              <span className="font-display text-xs font-black text-white">D</span>
            </div>
            <div className="px-4 py-3 bg-[#0a0a0a] border border-neutral-800 flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-0 border-t border-neutral-800"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Dan anything about the trade..."
          disabled={streaming}
          rows={1}
          className="flex-1 bg-transparent px-6 py-4 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none resize-none disabled:opacity-40"
          style={{ minHeight: '56px', maxHeight: '160px' }}
        />
        <button
          type="submit"
          disabled={!input.trim() || streaming}
          className="px-6 text-orange-500 hover:text-orange-400 disabled:text-neutral-700 transition-colors border-l border-neutral-800 shrink-0"
          aria-label="Send"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
