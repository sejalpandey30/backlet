'use client';

import * as React from 'react';
import { Sidebar } from '@/components/navigation/sidebar';
import { Topbar } from '@/components/navigation/topbar';
import { CommandPalette } from '@/components/command/command-palette';
import { AICopilotDrawer } from '@/components/copilot/ai-copilot-drawer';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = React.useState(false);

  // Register global Cmd+K shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full flex-shrink-0">
        <Sidebar
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
        />
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64">
            <Sidebar
              onOpenCommandPalette={() => {
                setIsMobileMenuOpen(false);
                setIsCommandPaletteOpen(true);
              }}
              onOpenCopilot={() => {
                setIsMobileMenuOpen(false);
                setIsCopilotOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
        />

        <main className="flex-1 overflow-y-auto bg-muted/20">{children}</main>
      </div>

      {/* Global Modals & Drawers */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />
    </div>
  );
}
