import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query, workspaceId } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const qLower = query.toLowerCase();
    let answer = '';
    let sources: { title: string; type: string }[] = [];

    if (qLower.includes('auth') || qLower.includes('pkce')) {
      answer =
        'During the Sprint 14 Engineering Sync, the team approved merging PR #142 (OAuth 2.0 PKCE with Supabase Auth) into main. PKCE is enforced across all OAuth flows with HTTP-only session cookies scoped to SameSite=Lax.';
      sources = [
        { title: 'Sprint 14 Engineering Sync', type: 'meeting' },
        { title: 'OAuth 2.0 PKCE & Session Security Specification', type: 'doc' },
        { title: 'PR #142: Implement OAuth 2.0 PKCE', type: 'github' },
      ];
    } else if (qLower.includes('block') || qLower.includes('frontend')) {
      answer =
        'Frontend blockers: (1) Maya Chen is verifying OAuth token refresh locally before staging merge. (2) Meeting room video canvas controls (Task #143) are in progress. (3) Envoy edge ingress rate limits await Sam’s Helm chart release.';
      sources = [
        { title: 'Task #143: Design interactive video room UI', type: 'task' },
        { title: 'PR #142: Implement OAuth 2.0 PKCE', type: 'github' },
      ];
    } else {
      answer =
        'Sprint 14 (Realtime Engine & Copilot) is currently active. 4 out of 6 tasks are in progress or in review, with 1 urgent task assigned to Alex Rivera (OAuth 2.0 PKCE).';
      sources = [
        { title: 'Sprint 14 Kanban Board', type: 'task' },
        { title: 'Backlet Labs Projects Overview', type: 'project' },
      ];
    }

    return NextResponse.json({
      answer,
      sources,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
