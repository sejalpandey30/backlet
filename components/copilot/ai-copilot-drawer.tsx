'use client';

import * as React from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { backletStore } from '@/lib/db/store';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  sources?: { title: string; type: string; url?: string }[];
  timestamp: string;
}

export function AICopilotDrawer({ isOpen, onClose }: CopilotDrawerProps) {
  const [messages, setMessages] = React.useState<CopilotMessage[]>([
    {
      id: 'm-welcome',
      sender: 'assistant',
      content:
        "Hello Alex! I am your Backlet AI Copilot. I have full context across your team's discussions, meetings, PRs, task board, and knowledge docs. How can I assist you today?",
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const suggestedQueries = [
    'What did we decide about authentication?',
    'What is blocking the frontend team?',
    "Summarize today's engineering sync.",
    'Show high priority sprint tasks.',
  ];

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: CopilotMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      content: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    // AI Semantic Engine Response matching workspace context
    setTimeout(() => {
      let replyContent = '';
      let sources: { title: string; type: string; url?: string }[] = [];

      const qLower = query.toLowerCase();

      if (qLower.includes('auth') || qLower.includes('authentication')) {
        replyContent = `During the **Sprint 14 Engineering Sync**, the team approved merging **PR #142 (OAuth 2.0 PKCE)** into \`main\` today.
Key Decisions:
1. Proof Key for Code Exchange (PKCE) is enforced across all OAuth flows to mitigate token interception.
2. Session cookies are HTTP-only with \`SameSite=Lax\`.
3. User invite tokens will persist seamlessly through the Google OAuth callback.`;
        sources = [
          { title: 'Sprint 14 Engineering Sync (Meeting)', type: 'meeting' },
          { title: 'OAuth 2.0 PKCE & Session Security Spec', type: 'doc' },
          { title: 'PR #142: Implement OAuth 2.0 PKCE', type: 'github' },
        ];
      } else if (qLower.includes('block') || qLower.includes('frontend')) {
        replyContent = `Current frontend team status & blockers:
1. **PR #142 Review**: Maya Chen is conducting local verification of the OAuth SSR cookie refresh before staging merge.
2. **Video Canvas Controls**: Maya is wrapping up the microphone/camera media controls for the meeting room (Task #143).
3. **API Dependency**: Ingress rate limiting on Kubernetes envoy proxies is pending Sam's Helm chart update.`;
        sources = [
          { title: 'Task #143: Design interactive video room UI', type: 'task' },
          { title: 'PR #142: Implement OAuth 2.0 PKCE', type: 'github' },
          { title: '#engineering discussion thread', type: 'message' },
        ];
      } else if (qLower.includes('summar') || qLower.includes('meeting') || qLower.includes('sync')) {
        replyContent = `**Executive Summary for Today's Engineering Sync**:
The engineering team met to review Sprint 14 deliverables. 
- PR #142 passed local and staging smoke tests and will be merged today.
- Staging WebSocket latencies averaged 22ms under Kubernetes cluster v1.30.
- WebRTC mesh architecture was ratified for 1-6 participant video huddles.`;
        sources = [
          { title: 'Sprint 14 Engineering Sync', type: 'meeting' },
          { title: 'Action Items: Video controls & Ingress limits', type: 'task' },
        ];
      } else {
        replyContent = `Based on Backlet Labs workspace data:
- **Active Sprint**: Sprint 14 (Realtime Engine & Copilot) with 6 active tasks.
- **Top Priority**: Task #142 (OAuth 2.0 PKCE) is Urgent and in progress.
- **Next Sync**: Product Roadmap Review at 14:00 with Jordan Taylor.`;
        sources = [
          { title: 'Sprint 14 Kanban Board', type: 'task' },
          { title: 'Backlet Labs Projects Overview', type: 'project' },
        ];
      }

      const botMsg: CopilotMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        content: replyContent,
        sources,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
    }, 750);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l bg-card shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Backlet Copilot</h3>
            <p className="text-[10px] text-muted-foreground">Workspace Intelligence · RLS Secured</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Suggested Questions */}
      <div className="border-b bg-muted/20 p-2.5">
        <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground mb-1.5">
          <Lightbulb className="h-3 w-3 text-amber-500" />
          Suggested queries:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQueries.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="rounded-md border border-border/80 bg-background px-2 py-1 text-[11px] text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 text-sm ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={`rounded-xl px-3.5 py-2.5 max-w-[85%] ${
                m.sender === 'user'
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'bg-muted/60 text-foreground border border-border/60'
              }`}
            >
              <div className="whitespace-pre-line text-xs leading-relaxed">{m.content}</div>

              {/* Source Citations */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 border-t border-border/50 pt-2 text-[10px] space-y-1">
                  <div className="font-semibold text-muted-foreground">Cited Workspace Sources:</div>
                  <div className="flex flex-wrap gap-1">
                    {m.sources.map((s, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded bg-background px-1.5 py-0.5 text-[10px] border border-border/60"
                      >
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        {s.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {m.sender === 'user' && (
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-foreground text-xs">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse p-2">
            <Sparkles className="h-4 w-4 text-primary animate-spin" />
            <span>Consulting workspace discussions, meetings & docs...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t p-3 bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about tasks, decisions, PRs..."
            className="text-xs"
          />
          <Button type="submit" size="sm" disabled={loading || !input.trim()}>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
