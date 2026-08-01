import { useState, useEffect, useRef } from 'react';
import { analyticsApi, chatApi } from '../services/api';
import ChatBubble from '../components/ChatBubble';
import useVoice from '../hooks/useVoice';
import { useAnalyticsStore } from '../stores/analyticsStore';
import {
  PhoneCall, CheckCircle2, XCircle, Clock, Mic, Send, RotateCcw, Users, Trophy, Target,
} from 'lucide-react';
import MetricCard from '../components/ui/MetricCard';
import Card from '../components/ui/Card';
import SectionHeader from '../components/ui/SectionHeader';
import MiniBarChart from '../components/ui/MiniBarChart';
import { SkeletonCard, SkeletonBlock } from '../components/ui/Skeleton';

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between items-center text-[13px] border-b border-border/60 py-2.5 last:border-b-0 last:pb-0 first:pt-0">
      <span className="text-text-3 font-medium">{label}</span>
      <span className="text-text-1 font-semibold">{value}</span>
    </div>
  );
}

export default function Analytics() {
  // Atomic selectors — unchanged
  const messages = useAnalyticsStore((state) => state.messages);
  const setMessages = useAnalyticsStore((state) => state.setMessages);
  const inputValue = useAnalyticsStore((state) => state.inputValue);
  const setInputValue = useAnalyticsStore((state) => state.setInputValue);

  const [metrics, setMetrics] = useState(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const scrollRef = useRef(null);

  const handleVoiceResult = (transcript) => {
    setInputValue(inputValue ? `${inputValue} ${transcript}` : transcript);
  };
  const { isSupported, isListening, toggleListening } = useVoice(handleVoiceResult);

  useEffect(() => {
    analyticsApi.getMetrics()
      .then(res => setMetrics(res.data))
      .catch(err => console.error("Failed to load metrics", err));
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoadingChat]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newUserMsg = { role: 'user', content: inputValue };
    const updatedMessages = [...messages, newUserMsg];

    setMessages(updatedMessages);
    setInputValue('');
    setIsLoadingChat(true);

    try {
      const response = await analyticsApi.askAnalyst(updatedMessages);
      setMessages([...updatedMessages, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      setMessages([...updatedMessages, { role: 'assistant', content: '⚠️ **System Error:** Could not reach the RelayAI analytics backend.' }]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  if (!metrics) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <SkeletonBlock className="h-40" />
          <SkeletonBlock className="h-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">

      {/* ================= TOP ANALYTICS ================= */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-6 pb-6">

          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon={PhoneCall}
              label="Total Calls"
              value={metrics.Total_Calls_All_Time}
              accent="accent"
            />
            <MetricCard
              icon={CheckCircle2}
              label="Completed"
              value={metrics.Completed_Calls_All_Time}
              accent="success"
            />
            <MetricCard
              icon={XCircle}
              label="Failed"
              value={metrics.Failed_Calls_All_Time}
              accent="danger"
            />
            <MetricCard
              icon={Clock}
              label="Pending Queue"
              value={metrics.Pending_Calls_Current}
              accent="warning"
            />
          </div>

          {/* Distribution Chart + Network Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <SectionHeader>Call Distribution Outcomes</SectionHeader>
              <Card>
                <MiniBarChart
                  data={[
                    {
                      label: 'Completed',
                      value: metrics.Completed_Calls_All_Time,
                      color: 'var(--color-success)',
                    },
                    {
                      label: 'Failed',
                      value: metrics.Failed_Calls_All_Time,
                      color: 'var(--color-danger)',
                    },
                    {
                      label: 'Pending',
                      value: metrics.Pending_Calls_Current,
                      color: 'var(--color-warning)',
                    },
                  ]}
                />
              </Card>
            </div>

            <div>
              <SectionHeader>Telephony Network Health</SectionHeader>
              <Card>
                <StatRow
                  label="Total Retries"
                  value={metrics.Total_Retries_All_Time}
                />
                <StatRow
                  label="Retries Today"
                  value={metrics.Retries_Today}
                />
                <StatRow
                  label="Total Contacts Saved"
                  value={metrics.Total_Contacts}
                />
              </Card>
            </div>
          </div>

          {/* Insights */}
          <div>
            <SectionHeader>Insights</SectionHeader>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card hover className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-ds-sm bg-accent-soft text-accent flex items-center justify-center shrink-0">
                  <Target size={16} />
                </div>

                <div>
                  <div className="text-[11px] text-text-3 font-bold uppercase tracking-wider mb-1">
                    Completed Today
                  </div>

                  <div className="text-lg font-bold text-text-1">
                    {metrics.Todays_Completed_Tasks_Count}
                  </div>
                </div>
              </Card>

              <Card hover className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-ds-sm bg-accent-indigo-soft text-[color:var(--color-accent-indigo)] flex items-center justify-center shrink-0">
                  <Users size={16} />
                </div>

                <div>
                  <div className="text-[11px] text-text-3 font-bold uppercase tracking-wider mb-1">
                    Most Called Contact
                  </div>

                  <div className="text-lg font-bold text-text-1 truncate">
                    {metrics.Most_Called_Contact_All_Time}
                  </div>
                </div>
              </Card>

              <Card hover className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-ds-sm bg-success-soft text-success flex items-center justify-center shrink-0">
                  <Trophy size={16} />
                </div>

                <div>
                  <div className="text-[11px] text-text-3 font-bold uppercase tracking-wider mb-1">
                    Highest Success Rate
                  </div>

                  <div className="text-lg font-bold text-text-1 truncate">
                    {metrics.Contact_With_Highest_Success_Rate}
                  </div>
                </div>
              </Card>
            </div>
          </div>


        </div>
      </div>

      {/* ================= CHAT ================= */}
      <div className="shrink-0 border-t border-border pt-4">

        <h4 className="text-[16px] text-text-1 font-semibold mb-1">
          Data Analyst Agent
        </h4>

        <p className="text-xs text-text-3 mb-4">
          Ask natural language questions regarding database history or system health.
        </p>

        <Card
          padding="p-0"
          className="flex flex-col min-h-0 max-h-[45vh] overflow-hidden"
        >

          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar"
          >
            {messages.length === 0 ? (
              <div className="text-center py-10 text-text-4 text-sm flex flex-col items-center gap-2">
                <RotateCcw size={18} className="text-text-4" />
                e.g., "Why did the last call fail?" or "Summarize overall success rate"
              </div>
            ) : (
              messages.map((msg, idx) => (
                <ChatBubble
                  key={idx}
                  role={msg.role}
                  content={msg.content}
                />
              ))
            )}

            {isLoadingChat && (
              <ChatBubble
                role="assistant"
                content=""
                isTyping
              />
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="shrink-0 p-3 border-t border-border bg-surface flex items-center gap-1"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask the Analyst..."
              disabled={isLoadingChat}
              className="flex-1 bg-transparent border-none text-text-1 text-sm py-2 px-3 focus:outline-none placeholder-text-4"
            />

            <button
              type="button"
              onClick={toggleListening}
              title={isSupported ? "Click to dictate" : "Voice not supported"}
              className={`p-2 rounded-full transition-all duration-150 cursor-pointer outline-none ${!isSupported
                ? "opacity-30 cursor-not-allowed"
                : isListening
                  ? "text-danger bg-danger-soft animate-pulse"
                  : "text-text-2 hover:bg-surface-2 hover:text-text-1"
                }`}
            >
              <Mic size={16} strokeWidth={2.25} />
            </button>

            <button
              type="submit"
              disabled={isLoadingChat || !inputValue.trim()}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-accent to-blue-700 text-white disabled:opacity-40 disabled:grayscale hover:shadow-glow transition-all duration-150 cursor-pointer"
            >
              <Send size={13} strokeWidth={2.25} />
            </button>
          </form>

        </Card>

      </div>

    </div>
  );
}