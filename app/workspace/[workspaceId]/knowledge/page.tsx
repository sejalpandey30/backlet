'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  FileText,
  Plus,
  Star,
  Clock,
  Folder,
  Search,
  BookOpen,
  Code,
  Sparkles,
  Layout,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { backletStore } from '@/lib/db/store';
import { formatDate } from '@/lib/utils';
import { KnowledgePage } from '@/types/workspace.types';

export default function KnowledgeHubPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = (params?.workspaceId as string) || 'backlet-labs';

  const [pages, setPages] = React.useState<KnowledgePage[]>(backletStore.getKnowledgePages());
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [isNewDocModalOpen, setIsNewDocModalOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newCategory, setNewCategory] = React.useState<KnowledgePage['category']>('Engineering');

  const categories = ['All', 'Engineering', 'Product', 'Design', 'Handbook'];

  const filteredPages = pages.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const favorites = pages.filter((p) => p.isFavorite);

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = backletStore.createKnowledgePage(newTitle, newCategory);
    setIsNewDocModalOpen(false);
    setNewTitle('');
    router.push(`/workspace/${workspaceSlug}/knowledge/${created.id}`);
  };

  const handleTemplateCreate = (title: string, cat: KnowledgePage['category']) => {
    const created = backletStore.createKnowledgePage(title, cat);
    router.push(`/workspace/${workspaceSlug}/knowledge/${created.id}`);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Knowledge Hub</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Architecture RFCs, product specs, engineering runbooks, and company handbooks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setIsNewDocModalOpen(true)} className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            <span>New Document</span>
          </Button>
        </div>
      </div>

      {/* Quick Templates Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => handleTemplateCreate('RFC: New Feature Specification', 'Engineering')}
          className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-3 text-left hover:border-primary/50 transition-colors"
        >
          <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-500">
            <Code className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-xs">Engineering RFC</div>
            <div className="text-[10px] text-muted-foreground">Architecture design template</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleTemplateCreate('Product Requirements Document (PRD)', 'Product')}
          className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-3 text-left hover:border-primary/50 transition-colors"
        >
          <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-xs">Product PRD</div>
            <div className="text-[10px] text-muted-foreground">User stories & scope</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleTemplateCreate('Sprint Retrospective & Learnings', 'Engineering')}
          className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-3 text-left hover:border-primary/50 transition-colors"
        >
          <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-xs">Sprint Retro</div>
            <div className="text-[10px] text-muted-foreground">What went well & action items</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleTemplateCreate('Team Onboarding Guide', 'Handbook')}
          className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-3 text-left hover:border-primary/50 transition-colors"
        >
          <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-xs">Team Runbook</div>
            <div className="text-[10px] text-muted-foreground">Setup instructions & culture</div>
          </div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <Button
              key={c}
              variant={selectedCategory === c ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(c)}
              className="text-xs h-7 px-3"
            >
              {c}
            </Button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 w-60 text-xs"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPages.map((page) => (
          <Link key={page.id} href={`/workspace/${workspaceSlug}/knowledge/${page.id}`}>
            <Card className="h-full border-border/60 hover:border-primary/50 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{page.icon}</span>
                  {page.isFavorite && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                </div>
                <CardTitle className="text-base mt-2 line-clamp-1">{page.title}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                  {page.content.split('\n\n')[1]?.replace(/[`*#]/g, '') || 'Click to view document specifications.'}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Avatar src={page.author.avatarUrl} name={page.author.fullName} size="sm" />
                    <span className="truncate">{page.author.fullName.split(' ')[0]}</span>
                  </div>
                  <span className="text-[11px]">{page.readingTimeMinutes || 4} min read</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* New Doc Modal */}
      <Modal
        isOpen={isNewDocModalOpen}
        onClose={() => setIsNewDocModalOpen(false)}
        title="Create Knowledge Document"
        description="Add a new technical specification, product requirement, or guide."
      >
        <form onSubmit={handleCreatePage} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Document Title</label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Distributed WebSocket State Protocol"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as KnowledgePage['category'])}
              className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground focus:outline-none"
            >
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Operations">Operations</option>
              <option value="Handbook">Handbook</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsNewDocModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Page
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
