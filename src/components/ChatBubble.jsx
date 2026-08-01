import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import TypingIndicator from './ui/TypingIndicator';

// Manual markdown element styling (no @tailwindcss/typography) — keeps the
// dependency footprint to just react-markdown itself.
const markdownComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-accent underline decoration-accent/40 hover:decoration-accent">
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-text-1">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  h1: ({ children }) => <h1 className="text-base font-semibold text-text-1 mt-1 mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-[15px] font-semibold text-text-1 mt-1 mb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold text-text-1 mt-1 mb-1.5">{children}</h3>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent/40 pl-3 my-2 text-text-2 italic">{children}</blockquote>
  ),
  pre: ({ children }) => (
    <pre className="bg-bg border border-border rounded-ds-md p-3 overflow-x-auto my-2 custom-scrollbar text-[13px]">
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = /language-/.test(className || '');
    if (isBlock) {
      return (
        <code className={`font-mono ${className || ''}`} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className="font-mono text-[12.5px] bg-surface-3 text-accent-cyan px-1.5 py-0.5 rounded-ds-sm" {...props}>
        {children}
      </code>
    );
  },
};

/**
 * ChatBubble — role: 'user' | 'assistant', content: string, isTyping?: bool,
 * timestamp?: string (optional, only rendered if provided by the caller).
 * Same prop contract as before; assistant content now renders as markdown,
 * user content stays plain text (avoids misinterpreting typed input as
 * markdown syntax).
 */
export default function ChatBubble({ role, content, isTyping = false, timestamp }) {
  const isUser = role === 'user';

  return (
    <div
      className={`group flex gap-3.5 px-4 py-4 mb-3 rounded-ds-lg animate-ds-fade-in transition-colors duration-150 ${isUser
          ? 'bg-surface-2 border border-border'
          : 'bg-[#161B22]/40 border border-border border-l-[3px] border-l-accent pl-5 hover:bg-[#161B22]/60'
        }`}
    >
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_0_2px_var(--color-surface),0_0_0_3px_var(--color-border)] ${isUser ? 'bg-surface-3 text-text-3' : 'bg-gradient-to-br from-accent to-blue-700 text-white'
          }`}
      >
        {isUser ? <User size={15} strokeWidth={2.25} /> : <Bot size={15} strokeWidth={2.25} />}
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        {isTyping ? (
          <div className="h-5 flex items-center">
            <TypingIndicator />
          </div>
        ) : isUser ? (
          <p className="text-[14.5px] leading-relaxed text-text-1 whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="text-[14.5px] text-text-1">
                <ReactMarkdown components={markdownComponents}>
                  {typeof content === "string"
                    ? content
                    : JSON.stringify(content, null, 2)}
                </ReactMarkdown>
          </div>
        )}

        {timestamp && !isTyping && (
          <div className="mt-1.5 text-[10.5px] text-text-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
}