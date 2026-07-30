import { useState, useEffect } from 'react';
import { callsApi } from '../services/api';
import StatusPill from '../components/StatusPill';
import ChatBubble from '../components/ChatBubble';
import { useCallsStore } from '../stores/callsStore';
import { ListOrdered, CheckCircle2, Radio, RefreshCw, ChevronDown, ChevronRight, PhoneCall, Inbox, Sparkles } from 'lucide-react';
import MetricCard from '../components/ui/MetricCard';
import Card from '../components/ui/Card';
import SectionHeader from '../components/ui/SectionHeader';
import ActionButton from '../components/ui/ActionButton';
import EmptyState from '../components/ui/EmptyState';
import LoadingState from '../components/ui/LoadingState';
import AnimatedContainer from '../components/ui/AnimatedContainer';

// Sub-component to lazily fetch transcript only when expanded — unchanged logic
function TranscriptViewer({ conversationId }) {
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    callsApi.getTranscript(conversationId)
      .then(res => {
        setTranscript(res.data.transcript);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load transcript.");
        setLoading(false);
      });
  }, [conversationId]);

  if (loading) return <LoadingState label="Fetching transcript from ElevenLabs..." />;
  if (error) return <div className="text-sm text-danger">{error}</div>;

  return (
    <div className="bg-surface border border-border rounded-ds-md p-3 max-h-96 overflow-y-auto custom-scrollbar">
      {transcript.map((msg, idx) => (
        <ChatBubble key={idx} role={msg.role} content={msg.content} />
      ))}
    </div>
  );
}

export default function LiveMonitor() {
  const [pendingCalls, setPendingCalls] = useState([]);
  const [completedCalls, setCompletedCalls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { expandedCallId, setExpandedCallId } = useCallsStore();

  const fetchCalls = async () => {
    setIsLoading(true);
    try {
      const [pendingRes, completedRes] = await Promise.all([
        callsApi.getCalls('PENDING'),
        callsApi.getCalls('COMPLETED')
      ]);
      setPendingCalls(pendingRes.data.calls || []);
      setCompletedCalls(completedRes.data.calls || []);
    } catch (error) {
      console.error("Failed to fetch calls:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
    const interval = setInterval(fetchCalls, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AnimatedContainer delay={0}><MetricCard icon={ListOrdered} label="Queue Depth" value={pendingCalls.length} accent="warning" /></AnimatedContainer>
        <AnimatedContainer delay={60}><MetricCard icon={CheckCircle2} label="Completed Calls" value={completedCalls.length} accent="success" /></AnimatedContainer>
        <AnimatedContainer delay={120}><MetricCard icon={Radio} label="Monitoring" value="Live" accent="accent" /></AnimatedContainer>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-2">
        {/* Left Column: Pending Queue */}
        <div className="flex-1 lg:max-w-[38%]">
          <SectionHeader>Pending Execution Queue</SectionHeader>

          <div className="space-y-2.5">
            {isLoading && pendingCalls.length === 0 ? (
              <LoadingState label="Loading queue..." />
            ) : pendingCalls.length === 0 ? (
              <EmptyState icon={Sparkles} title="Queue clear" description="No pending calls waiting." />
            ) : (
              pendingCalls.map((task) => (
                <Card key={task._id} hover className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-ds-sm bg-warning-soft text-warning flex items-center justify-center shrink-0">
                        <PhoneCall size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-text-1 text-[14px] truncate">{task.title || 'Untitled Call'}</div>
                        <div className="text-[12px] text-text-3 mt-0.5 truncate">Contact: {task.contact_name || 'Unknown'}</div>
                      </div>
                    </div>
                    <StatusPill status={task.status} />
                  </div>
                </Card>
              ))
            )}
          </div>

          <ActionButton
            icon={RefreshCw}
            onClick={fetchCalls}
            className="w-full justify-center mt-5"
          >
            Refresh Queue & Monitor
          </ActionButton>
        </div>

        {/* Right Column: Call History Timeline */}
        <div className="flex-[1.6] min-w-0">
          <SectionHeader>Call History & Transcripts</SectionHeader>

          {isLoading && completedCalls.length === 0 ? (
            <LoadingState label="Loading history..." />
          ) : completedCalls.length === 0 ? (
            <EmptyState icon={Inbox} title="No history yet" description="No completed calls found in database history." />
          ) : (
            <div className="relative">
              {completedCalls.map((task, idx) => {
                const isExpanded = expandedCallId === task._id;
                const dateStr = task.created_at ? new Date(task.created_at).toLocaleString() : 'N/A';
                const isLast = idx === completedCalls.length - 1;

                return (
                  <div key={task._id} className={`relative pl-9 ${isLast ? '' : 'pb-4'}`}>
                    {!isLast && (
                      <div className="absolute left-[9px] top-6 bottom-0 w-px bg-border" />
                    )}
                    <div className="absolute left-0 top-2 w-5 h-5 rounded-full bg-success-soft border-2 border-success flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    </div>

                    <Card padding="p-0" className="overflow-hidden">
                      <button
                        onClick={() => setExpandedCallId(isExpanded ? null : task._id)}
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${task.title || 'call'} with ${task.contact_name}`}
                        className="ds-focus-ring w-full flex justify-between items-center p-4 hover:bg-surface-3/60 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <PhoneCall size={14} className="text-text-3 shrink-0" />
                          <span className="font-medium text-text-1 text-sm truncate">{task.title || 'Call'} — {task.contact_name}</span>
                        </div>
                        <div className="text-text-4 shrink-0 ml-2">
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-border mt-1 pt-4 animate-ds-fade-in">
                          <div className="flex items-center gap-3 mb-4">
                            <StatusPill status="COMPLETED" />
                            <span className="text-[12px] text-text-3">Logged {dateStr}</span>
                          </div>

                          <p className="text-[11px] text-text-3 uppercase font-bold tracking-wider mb-1.5">Task Instructions</p>
                          <div className="bg-surface border border-border rounded-ds-sm p-3 mb-4 text-text-2 text-[13px]">
                            {task.description || 'No description logged.'}
                          </div>

                          <p className="text-[11px] text-text-3 uppercase font-bold tracking-wider mb-1.5">ElevenLabs Call Transcript</p>
                          {task.conversation_id ? (
                            <TranscriptViewer conversationId={task.conversation_id} />
                          ) : (
                            <div className="text-xs text-text-4 italic">No ElevenLabs conversation ID recorded for this call.</div>
                          )}
                        </div>
                      )}
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}