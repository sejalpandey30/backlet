'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  FileText,
  Star,
  Clock,
  ArrowLeft,
  Edit3,
  Eye,
  Check,
  Share2,
  Folder,
  Code,
  CheckSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { backletStore } from '@/lib/db/store';
import { formatDate } from '@/lib/utils';
import { KnowledgePage } from '@/types/workspace.types';

export default function KnowledgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params?.pageId as string;
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const allPages = backletStore.getKnowledgePages();
  const page = backletStore.getKnowledgePageById(pageId) || allPages[0];

  const [isEditing, setIsEditing] = React.useState(false);
  const [content, setContent] = React.useState(page?.content || '');
  const [title, setTitle] = React.useState(page?.title || '');
  const [isFavorite, setIsFavorite] = React.useState(page?.isFavorite || false);
  const [isSaved, setIsSaved] = React.useState(false);

  React.useEffect(() => {
    if (page) {
      setContent(page.content);
      setTitle(page.title);
      setIsFavorite(page.isFavorite);
    }
  }, [page]);

  const handleSave = () => {
    if (page) {
      backletStore.updateKnowledgePage(page.id, { title, content });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      setIsEditing(false);
    }
  };

  const handleToggleFavorite = () => {
    if (page) {
      const fav = backletStore.toggleFavoritePage(page.id);
      setIsFavorite(fav);
    }
  };

  // Render Markdown formatting with code blocks, checklists, and callouts
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeContent: string[] = [];

    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${idx}`}
              className="my-3 overflow-x-auto rounded-lg border bg-muted/60 p-4 font-mono text-xs text-foreground"
            >
              <code>{codeContent.join('\n')}</code>
            </pre>
          );
          codeContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={idx} className="text-2xl font-bold tracking-tight text-foreground mt-6 mb-3">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={idx} className="text-lg font-semibold tracking-tight text-foreground mt-5 mb-2 border-b pb-1">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={idx} className="text-base font-semibold text-foreground mt-4 mb-1">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
        const checked = line.startsWith('- [x] ');
        const label = line.replace(/- \[[ x]\] /, '');
        elements.push(
          <div key={idx} className="flex items-center gap-2 my-1 text-xs">
            <input
              type="checkbox"
              checked={checked}
              readOnly
              className="rounded border-input text-primary h-3.5 w-3.5"
            />
            <span className={checked ? 'line-through text-muted-foreground' : 'text-foreground'}>
              {label}
            </span>
          </div>
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={idx} className="ml-4 list-disc text-xs text-foreground/90 my-1 leading-relaxed">
            {line.replace(/^[-*] /, '')}
          </li>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={idx} className="h-2" />);
      } else {
        elements.push(
          <p key={idx} className="text-xs text-foreground/90 leading-relaxed my-1">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  if (!page) {
    return <div className="p-8 text-center text-sm">Page not found.</div>;
  }

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Nested Document Sidebar */}
      <div className="hidden lg:flex w-64 border-r bg-card/40 flex-col p-3 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            All Documents
          </span>
          <Link href={`/workspace/${workspaceSlug}/knowledge`}>
            <span className="text-[11px] text-primary hover:underline">Hub</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {allPages.map((p) => {
            const isSelected = p.id === page.id;
            return (
              <Link
                key={p.id}
                href={`/workspace/${workspaceSlug}/knowledge/${p.id}`}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors truncate ${
                  isSelected
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <span>{p.icon}</span>
                <span className="truncate">{p.title}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Document Reader / Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Document Action Header */}
        <div className="flex h-14 items-center justify-between border-b px-6 bg-card/60">
          <div className="flex items-center gap-3">
            <Link
              href={`/workspace/${workspaceSlug}/knowledge`}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
            <span className="text-muted-foreground/50">/</span>
            <Badge variant="secondary" className="text-[10px]">
              {page.category}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleToggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={`h-4 w-4 ${
                  isFavorite ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
                }`}
              />
            </Button>

            {isEditing ? (
              <Button size="sm" onClick={handleSave} className="h-8 gap-1.5 text-xs">
                <Check className="h-3.5 w-3.5" /> Save
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 gap-1.5 text-xs"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit Page
              </Button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-4xl mx-auto w-full">
          {/* Metadata banner */}
          <div className="flex items-center justify-between border-b pb-4 mb-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar src={page.author.avatarUrl} name={page.author.fullName} size="sm" />
              <span>Authored by {page.author.fullName}</span>
              <span>·</span>
              <span>Updated {formatDate(page.updatedAt)}</span>
            </div>
            <span>{page.readingTimeMinutes || 4} min read</span>
          </div>

          {/* Edit mode vs Read mode */}
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold bg-transparent border-b pb-2 focus:outline-none"
                placeholder="Document Title"
              />
              <textarea
                rows={18}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full font-mono text-xs rounded-lg border bg-muted/20 p-4 leading-relaxed focus:outline-none"
                placeholder="Write Markdown specifications here..."
              />
            </div>
          ) : (
            <article className="prose dark:prose-invert max-w-none">
              <div className="text-3xl font-extrabold tracking-tight mb-4 flex items-center gap-3">
                <span>{page.icon}</span>
                <span>{title}</span>
              </div>
              <div>{renderMarkdown(content)}</div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
