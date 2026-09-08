import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { transcript, meetingTitle } = await req.json();

    const summary = `The team met for "${meetingTitle || 'Sprint Sync'}". Key milestones were reviewed, architectural decisions agreed upon, and next sprint tasks were assigned.`;

    const keyDecisions = [
      'Approved merging PR #142 (OAuth 2.0 PKCE) into main today.',
      'Selected WebRTC mesh architecture for small-group video rooms.',
      'Enforce strict RLS policies on all vector embedding searches.',
    ];

    const actionItems = [
      {
        id: 'ai-' + Date.now() + '-1',
        description: 'Finalize meeting room video canvas controls and speaker grid',
        assigneeName: 'Maya Chen',
        dueDate: '2026-09-11',
        status: 'pending',
      },
      {
        id: 'ai-' + Date.now() + '-2',
        description: 'Configure edge ingress rate limiting on Kubernetes envoy proxies',
        assigneeName: 'Sam Wilson',
        dueDate: '2026-09-12',
        status: 'pending',
      },
    ];

    return NextResponse.json({
      summary,
      keyDecisions,
      actionItems,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
