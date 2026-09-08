'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { MessageSquare, Send, Paperclip, Smile, Search, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { backletStore } from '@/lib/db/store';
import { formatRelativeTime } from '@/lib/utils';
import { UserProfile } from '@/types/workspace.types';

export default function DirectMessagesPage() {
  const params = useParams();
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const currentUser = backletStore.getCurrentUser();
  const teamMembers = backletStore.getTeamMembers().filter((m) => m.id !== currentUser.id);

  const [activePartner, setActivePartner] = React.useState<UserProfile>(teamMembers[0]);
  const [chatHistory, setChatHistory] = React.useState<
    { id: string; senderId: string; content: string; time: string }[]
  >([
    {
      id: 'dm-1',
      senderId: teamMembers[0]?.id || 'maya',
      content: 'Hey Alex! Just checked out the OAuth PKCE PR. Looks super clean.',
      time: '10m ago',
    },
    {
      id: 'dm-2',
      senderId: currentUser.id,
      content: 'Thanks Maya! Make sure the session cookie domain is set appropriately for staging.',
      time: '8m ago',
    },
    {
      id: 'dm-3',
      senderId: teamMembers[0]?.id || 'maya',
      content: 'Will do! Joining the Engineering Sync now.',
      time: '3m ago',
    },
  ]);
  const [inputMessage, setInputMessage] = React.useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setChatHistory((prev) => [
      ...prev,
      {
        id: 'dm-' + Date.now(),
        senderId: currentUser.id,
        content: inputMessage,
        time: 'Just now',
      },
    ]);
    setInputMessage('');
  };

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Left Conversations List */}
      <div className="w-72 border-r bg-card/50 flex flex-col">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search people..." className="pl-8 h-8 text-xs" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Direct Messages
          </div>
          {teamMembers.map((member) => {
            const isSelected = activePartner.id === member.id;
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => setActivePartner(member)}
                className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
                  isSelected
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Avatar src={member.avatarUrl} name={member.fullName} size="sm" status={member.status} />
                <div className="truncate flex-1">
                  <div className="font-semibold text-xs truncate">{member.fullName}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{member.roleTitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="flex h-14 items-center justify-between border-b px-4 bg-card/60">
          <div className="flex items-center gap-3">
            <Avatar
              src={activePartner.avatarUrl}
              name={activePartner.fullName}
              size="sm"
              status={activePartner.status}
            />
            <div>
              <h3 className="font-semibold text-xs leading-none">{activePartner.fullName}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{activePartner.roleTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Phone className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Video className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatHistory.map((m) => {
            const isMe = m.senderId === currentUser.id;
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 text-xs ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <Avatar src={activePartner.avatarUrl} name={activePartner.fullName} size="sm" />
                )}
                <div
                  className={`rounded-xl px-3.5 py-2 max-w-[70%] space-y-0.5 ${
                    isMe
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'bg-muted/60 text-foreground border'
                  }`}
                >
                  <p className="leading-relaxed">{m.content}</p>
                  <div
                    className={`text-[9px] text-right ${
                      isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="border-t p-3 bg-card/50">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Message ${activePartner.fullName.split(' ')[0]}...`}
              className="text-xs"
            />
            <Button type="submit" size="sm" disabled={!inputMessage.trim()}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
