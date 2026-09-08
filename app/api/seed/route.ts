import { NextResponse } from 'next/server';
import {
  DEMO_PROFILES,
  DEMO_WORKSPACE,
  DEMO_CHANNELS,
  DEMO_PROJECTS,
  DEMO_TASKS,
  DEMO_MESSAGES,
  DEMO_MEETINGS,
  DEMO_KNOWLEDGE_PAGES,
  DEMO_PULL_REQUESTS,
} from '@/lib/seed/demo-data';

export async function GET() {
  return NextResponse.json({
    message: 'Backlet Labs seed payload ready',
    workspace: DEMO_WORKSPACE,
    teamMembersCount: Object.keys(DEMO_PROFILES).length,
    channelsCount: DEMO_CHANNELS.length,
    projectsCount: DEMO_PROJECTS.length,
    tasksCount: DEMO_TASKS.length,
    messagesCount: DEMO_MESSAGES.length,
    meetingsCount: DEMO_MEETINGS.length,
    docsCount: DEMO_KNOWLEDGE_PAGES.length,
    prsCount: DEMO_PULL_REQUESTS.length,
  });
}
