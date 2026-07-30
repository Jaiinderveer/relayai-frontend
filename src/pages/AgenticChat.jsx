import { useState, useRef, useEffect } from 'react';
import { chatApi } from '../services/api';
import useVoice from '../hooks/useVoice';
import ChatBubble from '../components/ChatBubble';
import { useChatStore } from '../stores/chatStore';
import { Mic, Send, Sparkles, Zap, Calendar, PhoneCall, ListChecks } from 'lucide-react';
import Card from '../components/ui/Card';
import SectionHeader from '../components/ui/SectionHeader';
import EmptyState from '../components/ui/EmptyState';

export default function AgenticChat() {
  // PROPER ARCHITECTURE: Atomic selectors — unchanged
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);
  const inputValue = useChatStore((state) => state.inputValue);
  const setInputValue = useChatStore((state) => state.setInputValue);

  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Voice subsystem — untouched, same hook, same returned API
  const handleVoiceResult = (transcript) => {
    setInputValue(inputValue ? `${inputValue} ${transcript}` : transcript);
  };
  const { isSupported, isListening, toggleListening } = useVoice(handleVoiceResult);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async (forcedText = null) => {
    const textToSend = forcedText || inputValue;
    if (!textToSend.trim()) return;

    const newUserMsg = { role: 'user', content: textToSend };
    const updatedMessages = [...messages, newUserMsg];

    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(updatedMessages);
      setMessages([...updatedMessages, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages([...updatedMessages, { role: 'assistant', content: '⚠️ **System Error:** Could not reach the RelayAI backend.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const presets = [
    { label: "Schedule a Meeting", query: "call jai regarding the meeting tomorrow at 6 PM.", icon: Calendar },
    { label: "Call Contact", query: "Call John regarding the project delivery status.", icon: PhoneCall },
    { label: "Query Tasks", query: "Show me all pending call tasks.", icon: ListChecks },
  ];

  return (
    <div className="h-full overflow-hidden">
      <div className="flex h-full gap-6 overflow-hidden">
        <div className="flex flex-1 flex-col min-w-0 min-h-0">
          {/* Message Thread */}
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar"
          >
            {messages.length === 0 ? (
              <EmptyState
                icon={Zap}
                title="Delegate your first task"
                description='Try a quick preset below, or type a request — e.g. "Call Jai regarding the Monte Carlo submission."'
              />
            ) : (
              messages.map((msg, index) => (
                <ChatBubble key={index} role={msg.role} content={msg.content} />
              ))
            )}
            {isLoading && <ChatBubble role="assistant" content="" isTyping={true} />}
          </div>

          {/* Quick Presets */}
          <div className="mt-auto pt-3">
            <div className="mb-2 flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              <span className="shrink-0 flex items-center gap-1 text-[10.5px] text-text-4 font-bold uppercase tracking-wider">
                <Sparkles size={12} /> Try
              </span>
              {presets.map((preset, idx) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(preset.query)}
                    disabled={isLoading}
                    className="shrink-0 flex items-center gap-1.5 bg-surface-2 border border-border text-text-2 text-[12px] font-medium py-1.5 px-3 rounded-full hover:border-accent hover:text-accent transition-all duration-150 cursor-pointer disabled:opacity-50"
                  >
                    <Icon size={12} strokeWidth={2.25} />
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Composer — mic + send preserved exactly, restyled only */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center bg-surface border border-border rounded-ds-xl shadow-ds-lg focus-within:border-accent focus-within:shadow-glow transition-all duration-200"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Write a task to delegate..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-none text-text-1 text-sm py-4 pl-5 focus:outline-none placeholder-text-4"
            />

            <button
              type="button"
              onClick={toggleListening}
              title={isSupported ? "Click to dictate" : "Voice not supported"}
              className={`p-2.5 mx-1 rounded-full transition-all duration-150 cursor-pointer outline-none ${!isSupported && 'opacity-30 cursor-not-allowed'
                } ${isListening ? 'text-danger bg-danger-soft animate-pulse' : 'text-text-2 hover:bg-surface-2 hover:text-text-1'}`}
            >
              <Mic size={17} strokeWidth={2.25} />
            </button>

            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="mr-2 w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-accent to-blue-700 text-white disabled:opacity-40 disabled:grayscale hover:shadow-glow transition-all duration-150 cursor-pointer"
            >
              <Send size={15} strokeWidth={2.25} />
            </button>
          </form>
        </div>

        {/* Side Context Panel */}
        <div className="w-64 hidden lg:flex flex-col shrink-0">
          <SectionHeader>Tips</SectionHeader>
          <Card padding="p-4" className="text-[12.5px] leading-relaxed text-text-2 space-y-3.5">
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase bg-accent-soft text-accent border border-accent/25 px-2 py-0.5 rounded-full">
                Action
              </span>
              <p className="mt-1.5">"Call contact regarding topic"</p>
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase bg-surface-3 text-text-3 border border-border px-2 py-0.5 rounded-full">
                Query
              </span>
              <p className="mt-1.5">"Show pending or failed calls"</p>
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase bg-surface-3 text-text-3 border border-border px-2 py-0.5 rounded-full">
                Voice
              </span>
              <p className="mt-1.5">Use the mic icon in the composer to dictate.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}