/**
 * TypingIndicator — the three-dot "assistant is thinking" animation, used
 * by AgenticChat and the Analytics Data Analyst Agent in later phases.
 * Kept separate from ChatBubble so it can also be used standalone (e.g. a
 * toolbar "AI is working" state) without pulling in bubble markup.
 */
export default function TypingIndicator({ className = '' }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`} aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-accent"
          style={{ animation: `ds-typing-dot 1.2s ${i * 0.15}s ease-in-out infinite` }}
        />
      ))}
    </div>
  );
}