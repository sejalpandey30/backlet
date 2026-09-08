'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Share2,
  PhoneOff,
  Hand,
  MessageSquare,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowLeft,
  CheckSquare,
  Plus,
  Send,
  FileText,
  Clock,
  Layers,
  MonitorUp,
  Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { backletStore } from '@/lib/db/store';
import { formatTime } from '@/lib/utils';
import { Meeting, MeetingActionItem } from '@/types/workspace.types';

export default function MeetingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params?.meetingId as string;
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const meeting = backletStore.getMeetingById(meetingId) || backletStore.getMeetings()[0];
  const currentUser = backletStore.getCurrentUser();

  // Media states
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoOff, setIsVideoOff] = React.useState(false);
  const [isScreenSharing, setIsScreenSharing] = React.useState(false);
  const [isHandRaised, setIsHandRaised] = React.useState(false);
  const [cameraActive, setCameraActive] = React.useState(false);

  // Video element refs
  const localVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const screenShareVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const localStreamRef = React.useRef<MediaStream | null>(null);
  const screenStreamRef = React.useRef<MediaStream | null>(null);

  // Active speaker
  const [activeSpeaker, setActiveSpeaker] = React.useState<string>('Alex Rivera');

  // Side panel tabs: 'ai' | 'notes' | 'chat' | 'people'
  const [activeTab, setActiveTab] = React.useState<'ai' | 'notes' | 'chat' | 'people'>('ai');

  // Action items local state
  const [actionItems, setActionItems] = React.useState<MeetingActionItem[]>(
    meeting?.notes?.actionItems || []
  );

  // Live meeting chat
  const [chatMessages, setChatMessages] = React.useState<
    { sender: string; text: string; time: string }[]
  >([
    { sender: 'Maya Chen', text: 'Audio check - can everyone hear me?', time: '10:31' },
    { sender: 'Alex Rivera', text: 'Loud and clear! Sharing the RFC link now.', time: '10:32' },
  ]);
  const [chatInput, setChatInput] = React.useState('');

  // Meeting notes state
  const [notesContent, setNotesContent] = React.useState(
    meeting?.notes?.summary ||
      'Sprint 14 review notes:\n- PR #142 OAuth approved for merge\n- Maya finalizing meeting room canvas\n- Sam monitoring staging envoy latencies'
  );

  // Request real camera stream on mount or when camera is toggled
  const startCamera = React.useCallback(async () => {
    try {
      if (navigator?.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        setIsVideoOff(false);
      }
    } catch {
      // Graceful fallback to avatar if camera permission is denied or no camera device exists
      setCameraActive(false);
    }
  }, []);

  const stopCamera = React.useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsVideoOff(true);
  }, []);

  // Toggle Camera
  const handleToggleVideo = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Toggle Audio Microphone
  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !nextMute;
      });
    }
  };

  // Toggle Real Screen Sharing
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
    } else {
      try {
        if (navigator?.mediaDevices?.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          screenStreamRef.current = stream;
          if (screenShareVideoRef.current) {
            screenShareVideoRef.current.srcObject = stream;
          }
          setIsScreenSharing(true);

          stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            screenStreamRef.current = null;
          };
        } else {
          setIsScreenSharing(true);
        }
      } catch {
        setIsScreenSharing(false);
      }
    }
  };

  // Clean up media tracks on unmount
  React.useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleConvertActionItem = (actionItemId: string) => {
    if (!meeting) return;
    const task = backletStore.convertActionItemToTask(meeting.id, actionItemId);
    if (task) {
      setActionItems(meeting.notes?.actionItems ? [...meeting.notes.actionItems] : []);
      alert(`Action item converted into Sprint Task: ${task.projectKey}-${task.taskNumber}!`);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: currentUser.fullName,
        text: chatInput,
        time: formatTime(new Date()),
      },
    ]);
    setChatInput('');
  };

  const participants = meeting?.participants || backletStore.getTeamMembers();

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100 overflow-hidden select-none">
      {/* Top Meeting Room Bar */}
      <div className="flex h-14 items-center justify-between border-b border-zinc-800/80 px-4 bg-zinc-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href={`/workspace/${workspaceSlug}/meetings`}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Leave Room</span>
          </Link>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <h1 className="font-semibold text-sm truncate max-w-sm">{meeting?.title}</h1>
            <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-700">
              WebRTC Live
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {cameraActive && (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
              <Camera className="h-3.5 w-3.5" /> Webcam Connected
            </span>
          )}
          {isScreenSharing && (
            <span className="inline-flex items-center gap-1 text-[11px] text-indigo-400">
              <MonitorUp className="h-3.5 w-3.5" /> Screen Sharing
            </span>
          )}
          <span className="text-xs font-mono text-zinc-400">10:30 - 11:15</span>
        </div>
      </div>

      {/* Center Meeting Canvas */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Video Grid or Screen Share Spotlight */}
        <div className="flex flex-1 flex-col p-4 overflow-hidden">
          {/* Spotlight Screen Share View if active */}
          {isScreenSharing ? (
            <div className="flex-1 flex flex-col rounded-2xl overflow-hidden bg-zinc-900 border border-indigo-500/50 mb-3 relative">
              <video
                ref={screenShareVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md bg-zinc-950/80 px-2.5 py-1 text-xs backdrop-blur-sm border border-zinc-700 text-indigo-400">
                <MonitorUp className="h-3.5 w-3.5" />
                <span>You are presenting your screen</span>
              </div>
            </div>
          ) : null}

          {/* Video Grid (2x2 Grid) */}
          <div
            className={`grid gap-3 min-h-0 ${
              isScreenSharing
                ? 'h-32 grid-cols-4'
                : 'flex-1 grid-cols-1 md:grid-cols-2'
            }`}
          >
            {participants.map((p) => {
              const isMe = p.id === currentUser.id;
              const isSpeaker = activeSpeaker === p.fullName;

              return (
                <div
                  key={p.id}
                  className={`relative flex items-center justify-center rounded-2xl overflow-hidden bg-zinc-900 border transition-all ${
                    isSpeaker
                      ? 'border-primary ring-2 ring-primary/40'
                      : 'border-zinc-800'
                  }`}
                >
                  {/* If this is the current user and camera is active, render real live HTML5 webcam video */}
                  {isMe && cameraActive ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-full w-full object-cover -scale-x-100"
                    />
                  ) : (
                    /* Avatar and Voice Visualizer */
                    <div className="text-center space-y-3">
                      <div className="relative inline-block">
                        <Avatar
                          src={p.avatarUrl}
                          name={p.fullName}
                          size="lg"
                          className={`${
                            isScreenSharing ? 'h-12 w-12 text-sm' : 'h-20 w-20 text-xl'
                          } mx-auto shadow-2xl ring-4 ring-zinc-800`}
                        />
                        {isSpeaker && !isScreenSharing && (
                          <div className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-30" />
                        )}
                      </div>
                      {!isScreenSharing && (
                        <div>
                          <div className="font-semibold text-sm">{p.fullName}</div>
                          <div className="text-xs text-zinc-400">{p.roleTitle}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-zinc-950/70 px-2 py-1 text-[11px] backdrop-blur-sm">
                    {isSpeaker && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                    <span>{p.fullName} {isMe ? '(You)' : ''}</span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    {isMe && isMuted && (
                      <span className="rounded-full bg-rose-500/80 p-1 text-white">
                        <MicOff className="h-3 w-3" />
                      </span>
                    )}
                    {isSpeaker && (
                      <span className="rounded bg-primary/80 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                        Speaking
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Media Control Bar */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <Button
              variant={isMuted ? 'destructive' : 'secondary'}
              size="icon"
              className="h-11 w-11 rounded-full shadow-lg"
              onClick={handleToggleMute}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button
              variant={isVideoOff || !cameraActive ? 'destructive' : 'secondary'}
              size="icon"
              className="h-11 w-11 rounded-full shadow-lg"
              onClick={handleToggleVideo}
              title={cameraActive ? 'Stop webcam' : 'Enable live webcam'}
            >
              {cameraActive && !isVideoOff ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>

            <Button
              variant={isScreenSharing ? 'default' : 'secondary'}
              size="icon"
              className="h-11 w-11 rounded-full shadow-lg"
              onClick={handleToggleScreenShare}
              title="Share screen"
            >
              <Share2 className="h-5 w-5" />
            </Button>

            <Button
              variant={isHandRaised ? 'default' : 'secondary'}
              size="icon"
              className="h-11 w-11 rounded-full shadow-lg"
              onClick={() => setIsHandRaised(!isHandRaised)}
              title="Raise hand"
            >
              <Hand className="h-5 w-5" />
            </Button>

            <Button
              variant="destructive"
              className="h-11 rounded-full px-5 gap-2 font-semibold text-xs shadow-lg"
              onClick={() => router.push(`/workspace/${workspaceSlug}/meetings`)}
            >
              <PhoneOff className="h-4 w-4" />
              <span>Leave</span>
            </Button>
          </div>
        </div>

        {/* Right Side Panel: AI Intelligence & Notes */}
        <div className="w-80 md:w-96 border-l border-zinc-800 bg-zinc-900/90 flex flex-col h-full">
          {/* Tabs */}
          <div className="flex border-b border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-3 text-center font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'ai'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Intelligence</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Notes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'chat'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Chat ({chatMessages.length})
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {activeTab === 'ai' && (
              <div className="space-y-4">
                {/* Executive Summary */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>Executive Summary</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    {meeting?.notes?.summary ||
                      'Reviewed Sprint 14 deliverables. The OAuth 2.0 PKCE implementation was approved for merge.'}
                  </p>
                </div>

                {/* Key Decisions Extracted */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-300 uppercase tracking-wider text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Key Decisions Made ({meeting?.notes?.keyDecisions.length || 2})</span>
                  </div>
                  <div className="space-y-1.5">
                    {(meeting?.notes?.keyDecisions || [
                      'Approved merging PR #142 (OAuth 2.0 PKCE) into main today.',
                      'Selected WebRTC mesh for 1-6 participant video huddles.',
                    ]).map((dec, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-zinc-800/80 bg-zinc-950/40 p-2 text-zinc-300 leading-relaxed"
                      >
                        • {dec}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Items with 1-Click Convert */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px]">
                      Action Items ({actionItems.length})
                    </span>
                    <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-700">
                      Auto-Extracted
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {actionItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-2.5 space-y-2"
                      >
                        <div className="text-zinc-200 leading-snug">{item.description}</div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/50">
                          <span>Assignee: {item.assigneeName || 'Alex'}</span>
                          {item.status === 'converted' ? (
                            <Badge variant="default" className="text-[9px] bg-emerald-600">
                              Added to Tasks
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConvertActionItem(item.id)}
                              className="h-6 text-[10px] gap-1 border-primary/50 text-primary hover:bg-primary/20"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Convert to Task</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-2 h-full flex flex-col">
                <span className="font-semibold text-zinc-300">Synchronized Scratchpad</span>
                <textarea
                  value={notesContent}
                  onChange={(e) => setNotesContent(e.target.value)}
                  className="flex-1 w-full rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-zinc-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                />
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="h-full flex flex-col">
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className="rounded-lg bg-zinc-950/60 p-2 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400">
                        <span className="font-semibold text-zinc-200">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-zinc-300">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-zinc-800">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Message room..."
                    className="bg-zinc-950 border-zinc-800 text-xs h-8 text-zinc-200"
                  />
                  <Button type="submit" size="sm" className="h-8">
                    <Send className="h-3 w-3" />
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
